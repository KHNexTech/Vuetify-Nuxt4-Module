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
  createI18nLocaleAdapter,
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
    const [blueprint, dateConfig, iconConfig, localeConfig, i18nLocaleAdapter] = await Promise.all([
      config.blueprint ? loadBlueprint(config.blueprint) : undefined,
      config.dateAdapter && config.dateAdapter !== 'vuetify' ? createDateConfig(config.dateAdapter) : undefined,
      config.icons ? createIconConfig(config.icons) : createIconConfig(),
      config.locale ? createLocaleConfig(config.locale) : createLocaleConfig(),
      isI18nEnabled(i18nOption) ? createI18nLocaleAdapter() : undefined,
    ])
    // Apply loaded configs
    if (blueprint) vuetifyOptions.blueprint = blueprint
    if (dateConfig) vuetifyOptions.date = dateConfig
    if (iconConfig) vuetifyOptions.icons = iconConfig
    // Apply locale config - i18n adapter takes precedence over default locale config
    if (i18nLocaleAdapter) {
      // i18n adapter successfully created
      vuetifyOptions.locale = i18nLocaleAdapter
      logger.debug('Using vue-i18n adapter for Vuetify locale')
    }
    else if (localeConfig) {
      // Use default locale config if i18n not enabled or failed
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
