import type { LocaleOptions, LocaleMessages, RtlOptions } from 'vuetify'
import type { ModuleOptions } from '../types'

import { en, km } from 'vuetify/locale'

// Type based on actual locale structure

const builtInLocales: LocaleMessages = {
  en,
  km,
}

export function createLocaleConfig(
  options?: ModuleOptions['vuetifyOptions']['locale'],
): LocaleOptions & RtlOptions {
  return {
    locale: options?.locale ?? 'en',
    fallback: options?.fallback ?? 'en',
    messages: { ...builtInLocales, ...options?.messages },
    rtl: options?.rtl ?? {},
  }
}
