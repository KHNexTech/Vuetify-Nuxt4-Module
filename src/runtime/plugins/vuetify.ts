import { defineNuxtPlugin, type NuxtApp, useRuntimeConfig } from '#app'
import { createVuetify } from 'vuetify'
import { watch } from 'vue'
import type { VuetifyOptions } from 'vuetify'
import type { VuetifyRuntimeConfig } from '../../types'
import {
  logger,
  callVuetifyHook,
  createIconConfig,
  createLocaleConfig,
  createDateConfig,
  loadBlueprint,
  resolvePersistenceConfig,
  getPersistedTheme,
  setPersistedTheme,
  isI18nEnabled,
  registerLazyComponents,
} from '../../utils'

export default defineNuxtPlugin({
  name: 'vuetify',
  enforce: 'pre',
  parallel: true,
  async setup(nuxtApp) {
    const runtimeConfig = useRuntimeConfig().public.vuetify as VuetifyRuntimeConfig
    const { vuetifyOptions: config, persistence: persistenceOptions, i18n: i18nOption, lazyComponents: lazy } = runtimeConfig
    logger.debug('Initializing Vuetify...')

    // Build options
    const vuetifyOptions: VuetifyOptions = {
      ssr: config.ssr ?? true,
      theme: config.theme,
      defaults: config.defaults,
      aliases: config.aliases as VuetifyOptions['aliases'],
    }

    // Load async configurations in parallel
    const [blueprint, dateConfig, iconConfig, localeConfig] = await Promise.all([
      config.blueprint ? loadBlueprint(config.blueprint) : undefined,
      config.dateAdapter && config.dateAdapter !== 'vuetify' ? createDateConfig(config.dateAdapter) : undefined,
      config.icons ? createIconConfig(config.icons) : createIconConfig(),
      config.locale ? createLocaleConfig(config.locale) : createLocaleConfig(),
    ])

    // Apply loaded configs
    if (blueprint) vuetifyOptions.blueprint = blueprint
    if (dateConfig) vuetifyOptions.date = dateConfig
    if (iconConfig) vuetifyOptions.icons = iconConfig

    // Handle i18n adapter - only on client side to avoid hydration mismatch
    let i18nLocaleAdapter
    if (isI18nEnabled(i18nOption) && import.meta.client) {
      try {
        // Get i18n instance from nuxt app - @nuxtjs/i18n provides it as $i18n
        const i18nInstance = (nuxtApp as any).$i18n
        if (i18nInstance?.global) {
          const { createVueI18nAdapter } = await import('vuetify/locale/adapters/vue-i18n')
          const { useI18n } = await import('vue-i18n')

          i18nLocaleAdapter = {
            adapter: createVueI18nAdapter({ i18n: i18nInstance, useI18n }),
          }
          logger.debug('Using vue-i18n adapter for Vuetify locale')
        }
      }
      catch (error) {
        logger.debug('Failed to create i18n locale adapter:', error)
      }
    }
    // Apply locale config - i18n adapter takes precedence over default locale config
    if (i18nLocaleAdapter) {
      vuetifyOptions.locale = i18nLocaleAdapter
    }
    else if (localeConfig) {
      vuetifyOptions.locale = localeConfig
    }

    /// Hook: before-create
    await callVuetifyHook(nuxtApp as NuxtApp, 'vuetify:before-create', { vuetifyOptions })

    // Create Vuetify instance
    const vuetify = createVuetify(vuetifyOptions)

    // Install Vuetify
    nuxtApp.vueApp.use(vuetify)

    // Lazy Components
    if (lazy) {
      const lazyConfig = typeof lazy === 'object'
        ? lazy
        : {}

      registerLazyComponents(
        nuxtApp.vueApp,
        lazyConfig?.components,
        { delay: lazyConfig.delay },
      )
    }

    // Handle theme persistence (client-only, non-blocking)
    if (import.meta.client) {
      const persistenceConfig = resolvePersistenceConfig(persistenceOptions)

      if (persistenceConfig.enabled) {
        // Use requestIdleCallback for non-critical work
        const setupPersistence = () => {
          const persistedTheme = getPersistedTheme(persistenceConfig)
          if (persistedTheme && vuetify.theme.themes.value[persistedTheme]) {
            vuetify.theme.change(persistedTheme)
          }

          watch(
            () => vuetify.theme.global.name.value,
            theme => setPersistedTheme(persistenceConfig, theme),
          )
        }

        if ('requestIdleCallback' in window) {
          requestIdleCallback(setupPersistence)
        }
        else {
          setTimeout(setupPersistence, 0)
        }
      }
    }

    // Hook: configuration
    await callVuetifyHook(nuxtApp as NuxtApp, 'vuetify:configuration', { vuetifyOptions })

    // Hook: ready
    await callVuetifyHook(nuxtApp as NuxtApp, 'vuetify:ready', vuetify)

    logger.success('Vuetify initialized')
    nuxtApp.provide('vuetify', vuetify)
  },
})
