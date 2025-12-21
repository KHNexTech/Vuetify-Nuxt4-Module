const PREFIX = '[nuxt:vuetify]'

export const logger = {
  info: (...args: unknown[]) => console.info(PREFIX, ...args),
  warn: (...args: unknown[]) => console.warn(PREFIX, ...args),
  error: (...args: unknown[]) => console.error(PREFIX, ...args),
  success: (...args: unknown[]) => console.log('✅', PREFIX, ...args),
  debug: (...args: unknown[]) => {
    if (import.meta.dev) {
      console.debug(PREFIX, ...args)
    }
  },
  log: (...args: unknown[]) => console.log(PREFIX, ...args),
}
