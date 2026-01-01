// =============================================================================
// Runtime Utilities for Vuetify Plugin
// =============================================================================

// Re-export all types
export * from '../types'

// Logger
export { logger } from './logger'

// Hooks
export { callVuetifyHook } from './hooks'

// Icon Configuration
export { createIconConfig, loadIconSet, getIconCssPath } from './icon'

// Locale Configuration
export { createLocaleConfig, isRtlLocale } from './locale'

// Date Adapter
export { createDateConfig } from './date'

// Blueprints
export { loadBlueprint } from './blueprints'

// i18n Adapter
export {
  isI18nEnabled,
  hasVueI18n,
  getI18nInstance,
  createI18nLocaleAdapter,
  tryCreateI18nLocaleAdapter,
} from './i18n'

// Lazy Loading
export { createLazyComponent, registerLazyComponents } from './lazy'

// Persistence
export {
  resolvePersistenceConfig,
  getPersistedTheme,
  setPersistedTheme,
  clearPersistedTheme,
} from './persistence'
