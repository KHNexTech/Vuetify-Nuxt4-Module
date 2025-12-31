import type { ModuleOptions, PersistenceConfig } from './options'

// Runtime config type for plugin access
export interface VuetifyRuntimeConfig {
  vuetifyOptions: ModuleOptions['vuetifyOptions']
  persistence?: PersistenceConfig
  i18n?: ModuleOptions['i18n']
  lazyComponents?: ModuleOptions['lazyComponents']
}
export interface ModuleRuntimeConfig {
  public: {
    vuetify: VuetifyRuntimeConfig
  }
}
export interface ModulePublicRuntimeConfig {
  vuetify: VuetifyRuntimeConfig
}

export {}
