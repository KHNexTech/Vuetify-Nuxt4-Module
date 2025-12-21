export { logger } from './logger'
export { callVuetifyHook, onVuetifyHook, offVuetifyHook } from './hooks'
export { createIconConfig, loadIconSet } from './icon'
export { createLocaleConfig } from './locale'
export { createDateConfig } from './date'
export { loadBlueprint } from './blueprints'
export {
  resolvePersistenceConfig,
  getPersistedTheme,
  setPersistedTheme,
} from './persistence'

export type { VuetifyHookName } from './hooks'
export type { ResolvedPersistenceConfig } from './persistence'
