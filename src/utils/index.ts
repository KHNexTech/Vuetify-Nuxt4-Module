export { logger } from './logger'
export { callVuetifyHook, onVuetifyHook, offVuetifyHook } from './hooks'
export { createIconConfig, loadIconSet } from './icon'
export { createLocaleConfig } from './locale'
export { createDateConfig } from './date'
export { loadBlueprint } from './blueprints'
export { createI18nLocaleAdapter, isI18nEnabled } from './i18n'
export {
  createLazyComponent,
  registerLazyComponents,
  type LazyComponentName,
  type LazyComponentOptions,
} from './lazy'
export {
  resolvePersistenceConfig,
  getPersistedTheme,
  setPersistedTheme,
} from './persistence'
export {
  generatePreloadLinks, injectPreloadHints,
} from './preload'

export type { VuetifyHookName } from './hooks'
export type { ResolvedPersistenceConfig } from './persistence'
