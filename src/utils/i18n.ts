import type { LocaleOptions } from 'vuetify'
import type { ModuleOptions } from '../types'
import { logger } from './logger'
import type { I18n } from 'vue-i18n'
import type { Nuxt } from '@nuxt/schema'

/**
 * Check if i18n integration is enabled in module options
 */
export function isI18nEnabled(i18nOption?: ModuleOptions['i18n']): boolean {
  if (i18nOption === false || i18nOption === true) {
    return i18nOption
  }

  // Object form: check useVueI18nAdapter
  if (typeof i18nOption === 'object' && i18nOption) {
    return i18nOption.useVueI18nAdapter !== false
  }

  // Default: enabled (auto-detect)
  return true
}

/**
 * Create i18n locale adapter for Vuetify
 * Only call this AFTER vue-i18n is fully initialized
 *
 * @param i18nInstance - The vue-i18n instance (required)
 */
export async function createI18nLocaleAdapter(
  i18nInstance?: I18n,
): Promise<LocaleOptions | undefined> {
  // Safety check - make sure i18n is valid
  if (!i18nInstance || !i18nInstance.global) {
    logger.debug('vue-i18n instance not valid or not initialized')
    return undefined
  }

  try {
    const { createVueI18nAdapter } = await import('vuetify/locale/adapters/vue-i18n')
    const { useI18n } = await import('vue-i18n')

    return {
      adapter: createVueI18nAdapter({ i18n: i18nInstance, useI18n }),
    }
  }
  catch (error) {
    logger.debug('Failed to create vue-i18n adapter:', error)
    return undefined
  }
}

/**
 * Try to create i18n locale adapter, returns undefined if not available
 * This is a convenience wrapper that handles all error cases
 */
export async function tryCreateI18nLocaleAdapter(
  i18nOption?: ModuleOptions['i18n'],
  i18nInstance?: I18n,
): Promise<LocaleOptions | undefined> {
  if (!isI18nEnabled(i18nOption)) {
    return undefined
  }

  return createI18nLocaleAdapter(i18nInstance)
}

/**
 * Check if @nuxtjs/i18n module is installed
 */
export function hasI18nModule(nuxt: Nuxt): boolean {
  const modules = nuxt?.options?.modules || []
  return modules.some((m) => {
    if (!m) return false
    if (typeof m === 'string') return m === '@nuxtjs/i18n'
    if (Array.isArray(m)) {
      const moduleName = m[0]
      if (typeof moduleName === 'string') return moduleName === '@nuxtjs/i18n'
    }
    return false
  })
}
