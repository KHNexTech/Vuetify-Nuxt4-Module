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
    const [blueprint, dateConfig, iconConfig, localConfig] = await Promise.all([
      config.blueprint ? loadBlueprint(config.blueprint) : undefined,
      config.dateAdapter ? createDateConfig(config.dateAdapter) : undefined,
      config.icons ? createIconConfig(config.icons) : createIconConfig(),
      config.locale ? createLocaleConfig(config.locale) : createLocaleConfig(),
    ])

    // Apply loaded configs
    if (blueprint) vuetifyOptions.blueprint = blueprint
    if (dateConfig) vuetifyOptions.date = dateConfig
    if (iconConfig) vuetifyOptions.icons = iconConfig
    if (config.locale) vuetifyOptions.locale = localConfig

    /// Hook: before-create
    await callVuetifyHook(nuxtApp as NuxtApp, 'vuetify:before-create', { vuetifyOptions })

    // Create Vuetify instance
    const vuetify = createVuetify(vuetifyOptions)

    // Install Vuetify
    nuxtApp.vueApp.use(vuetify)

    // Handle theme persistence (client-only, non-blocking)
    if (import.meta.client) {
      const persistenceConfig = resolvePersistenceConfig(persistenceOptions)

      if (persistenceConfig.enabled) {
        // Use requestIdleCallback for non-critical work
        const setupPersistence = () => {
          const persistedTheme = getPersistedTheme(persistenceConfig)
          if (persistedTheme && vuetify.theme.themes.value[persistedTheme]) {
            vuetify.theme.global.name.value = persistedTheme
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
