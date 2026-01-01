import type { Logger } from '../types'

const PREFIX = '[nuxt:vuetify]'
export const logger: Logger = {
  debug: (...args: unknown[]): void => {
    if (import.meta.dev) {
      console.log(PREFIX, ...args)
    }
  },
  info: (...args: unknown[]): void => {
    console.log(PREFIX, ...args)
  },
  success: (...args: unknown[]): void => {
    console.log('[vuetify] ✓', ...args)
  },
  warn: (...args: unknown[]): void => {
    console.warn(PREFIX, ...args)
  },
  error: (...args: unknown[]): void => {
    console.error(PREFIX, ...args)
  },
}
