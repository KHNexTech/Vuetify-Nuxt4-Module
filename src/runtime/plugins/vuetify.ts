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
} from '../../utils'

export default defineNuxtPlugin({
  name: 'vuetify',
  enforce: 'pre',
  async setup(nuxtApp) {
    const runtimeConfig = useRuntimeConfig().public.vuetify as VuetifyRuntimeConfig
    const { vuetifyOptions: config, persistence: persistenceOptions } = runtimeConfig
    logger.debug('Initializing Vuetify...')

    // Build options
    const vuetifyOptions: VuetifyOptions = {
      ssr: config.ssr ?? true,
      theme: config.theme,
      defaults: config.defaults,
      aliases: config.aliases as VuetifyOptions['aliases'],
    }

    // Load async configurations in parallel
    const [blueprint, dateConfig, iconConfig] = await Promise.all([
      config.blueprint ? loadBlueprint(config.blueprint) : undefined,
      config.dateAdapter ? createDateConfig(config.dateAdapter) : undefined,
      config.icons ? createIconConfig(config.icons) : createIconConfig(),
    ])

    // Apply loaded configs
    if (blueprint) vuetifyOptions.blueprint = blueprint
    if (dateConfig) vuetifyOptions.date = dateConfig
    if (iconConfig) vuetifyOptions.icons = iconConfig

    // Locale is synchronous
    if (config.locale) {
      vuetifyOptions.locale = createLocaleConfig(config.locale)
    }

    /// Hook: before-create
    await callVuetifyHook(nuxtApp as NuxtApp, 'vuetify:before-create', { vuetifyOptions })

    // Create Vuetify instance
    const vuetify = createVuetify(vuetifyOptions)

    // Install Vuetify
    nuxtApp.vueApp.use(vuetify)

    // Handle theme persistence
    const persistenceConfig = resolvePersistenceConfig(persistenceOptions)

    if (persistenceConfig.enabled && import.meta.client) {
      // Restore persisted theme
      const persistedTheme = getPersistedTheme(persistenceConfig)
      if (persistedTheme && vuetify.theme.themes.value[persistedTheme]) {
        vuetify.theme.change(persistedTheme)
      }

      // Watch for theme changes and persist
      watch(
        () => vuetify.theme.global.name.value,
        (theme) => {
          setPersistedTheme(persistenceConfig, theme)
        },
      )
    }

    // Hook: configuration
    await callVuetifyHook(nuxtApp as NuxtApp, 'vuetify:configuration', { vuetifyOptions })

    // Hook: ready
    await callVuetifyHook(nuxtApp as NuxtApp, 'vuetify:ready', vuetify)

    logger.success('Vuetify initialized')
    nuxtApp.provide('vuetify', vuetify)
  },
})
