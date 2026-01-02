import { defineNuxtPlugin, type NuxtApp, useCookie, useRuntimeConfig } from '#app'
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
  setPersistedTheme,
  isI18nEnabled,
  registerLazyComponents, tryCreateI18nLocaleAdapter,
} from '../../utils'

export default defineNuxtPlugin({
  name: 'vuetify',
  // enforce: 'pre',
  parallel: true,
  async setup(nuxtApp) {
    const runtimeConfig = useRuntimeConfig().public.vuetify as VuetifyRuntimeConfig
    const {
      vuetifyOptions: config,
      persistence: persistenceOptions,
      i18n: i18nOption,
      lazyComponents: lazy,
    } = runtimeConfig

    logger.debug('Initializing Vuetify...')

    // Resolve persistence config
    const persistenceConfig = resolvePersistenceConfig(persistenceOptions)

    // Get a persisted theme BEFORE creating Vuetify (works on both SSR and client)
    let initialTheme = config.theme?.defaultTheme ?? 'light'

    if (persistenceConfig.enabled && persistenceConfig.storage === 'cookie') {
      const themeCookie = useCookie<string>(persistenceConfig.key, {
        maxAge: persistenceConfig.cookieOptions?.maxAge,
        path: persistenceConfig.cookieOptions?.path,
        sameSite: persistenceConfig.cookieOptions?.sameSite as 'lax' | 'strict' | 'none',
      })

      if (themeCookie.value) {
        initialTheme = themeCookie.value
      }
    }

    // Build options
    const vuetifyOptions: VuetifyOptions = {
      ssr: config.ssr ?? true,
      theme: {
        ...config.theme,
        defaultTheme: initialTheme,
      },
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

    // i18n Integration (supports @nuxtjs/i18n and vue-i18n)
    let i18nLocaleAdapter
    if (isI18nEnabled(i18nOption)) {
      i18nLocaleAdapter = await tryCreateI18nLocaleAdapter(nuxtApp as NuxtApp)
    }
    // Apply locale config - i18n adapter takes precedence
    if (i18nLocaleAdapter) {
      vuetifyOptions.locale = {
        adapter: i18nLocaleAdapter,
      }
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

    // Theme Persistence (Client-Only)
    if (import.meta.client && persistenceConfig.enabled) {
      // Watch for theme changes and persist them
      watch(
        () => vuetify.theme.global.name.value,
        (theme) => {
          setPersistedTheme(persistenceConfig, theme)

          // Also update the cookie for SSR
          if (persistenceConfig.storage === 'cookie') {
            const themeCookie = useCookie<string>(persistenceConfig.key, {
              maxAge: persistenceConfig.cookieOptions?.maxAge,
              path: persistenceConfig.cookieOptions?.path,
              sameSite: persistenceConfig.cookieOptions?.sameSite as 'lax' | 'strict' | 'none',
            })
            themeCookie.value = theme
          }
        },
      )

      // Handle localStorage persistence (client-only read)
      if (persistenceConfig.storage === 'localStorage') {
        const storedTheme = localStorage.getItem(persistenceConfig.key)
        if (storedTheme && vuetify.theme.themes.value[storedTheme]) {
          vuetify.theme.global.name.value = storedTheme
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
