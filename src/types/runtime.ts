import type { VuetifyModuleOptionsConfig } from './vuetify'
import type { PersistenceConfig } from './persistence'
import type { I18nConfig } from './i18n'
import type { LazyComponentsConfig } from './lazy'

// Runtime config type for plugin access
export interface VuetifyRuntimeConfig {
  vuetifyOptions: VuetifyModuleOptionsConfig
  persistence?: PersistenceConfig
  i18n?: boolean | I18nConfig
  lazyComponents?: boolean | LazyComponentsConfig
}
export interface ModuleRuntimeConfig {
  public: {
    vuetify: VuetifyRuntimeConfig
  }
}
export interface ModulePublicRuntimeConfig {
  vuetify: VuetifyRuntimeConfig
}
// export interface NuxtAppWithI18n extends NuxtApp {
//   $i18n?: I18n
// }
export {}
