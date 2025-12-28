// src/utils/i18n.ts
import type { LocaleOptions } from 'vuetify'
import type { ModuleOptions } from '../types'
import { logger } from './logger'

/**
 * Check if i18n integration is enabled in module options
 */
export function isI18nEnabled(i18nOption?: ModuleOptions['i18n']): boolean {
  if (i18nOption === false) {
    return false
  }

  if (i18nOption === true) {
    return true
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
 * @param i18nInstance - Optional i18n instance. If not provided, will attempt to get from nuxtApp
 */
export async function createI18nLocaleAdapter(
  i18nInstance?: any,
): Promise<LocaleOptions | undefined> {
  // If no instance provided, try to get it from the nuxt app context
  let i18n = i18nInstance

  if (!i18n) {
    try {
      // Try to get i18n from nuxt app (runtime context)
      const { useNuxtApp } = await import('#app')
      const nuxtApp = useNuxtApp()
      i18n = nuxtApp.$i18n
    }
    catch {
      // Not in nuxt context or i18n not available
      logger.debug('Could not get i18n instance from nuxt app')
    }
  }

  // Safety check - make sure i18n is valid
  if (!i18n || !i18n.global) {
    logger.debug('vue-i18n not available or not initialized')
    return undefined
  }

  try {
    const { createVueI18nAdapter } = await import('vuetify/locale/adapters/vue-i18n')
    const { useI18n } = await import('vue-i18n')

    return {
      adapter: createVueI18nAdapter({ i18n, useI18n }),
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
  i18nInstance?: any,
): Promise<LocaleOptions | undefined> {
  if (!isI18nEnabled(i18nOption)) {
    return undefined
  }

  return createI18nLocaleAdapter(i18nInstance)
}

/**
 * Check if @nuxtjs/i18n module is installed
 */
export function hasI18nModule(nuxt: any): boolean {
  const modules = nuxt?.options?.modules || []
  return modules.some((m: string | string[]) => {
    const moduleName = Array.isArray(m) ? m[0] : m
    return moduleName === '@nuxtjs/i18n'
  })
}
