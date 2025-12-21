import type { LocaleOptions, LocaleMessages, RtlOptions } from 'vuetify'
import type { ModuleOptions } from '../types'

// Map of available locales - only import what's needed
const localeImportMap: Record<string, () => Promise<{ default: LocaleMessages }>> = {
  en: () => import('vuetify/locale').then(m => ({ default: m.en })),
  ja: () => import('vuetify/locale').then(m => ({ default: m.ja })),
  km: () => import('vuetify/locale').then(m => ({ default: m.km })),
  ko: () => import('vuetify/locale').then(m => ({ default: m.ko })),
  zhHans: () => import('vuetify/locale').then(m => ({ default: m.zhHans })),
  zhHant: () => import('vuetify/locale').then(m => ({ default: m.zhHant })),
}

export async function createLocaleConfig(
  options?: ModuleOptions['vuetifyOptions']['locale'],
): Promise<LocaleOptions & RtlOptions> {
  const locale = options?.locale ?? 'en'
  const fallback = options?.fallback ?? 'en'

  // Only load required locales
  const localesToLoad = new Set([locale, fallback])
  const messages: LocaleMessages = {}

  await Promise.all(
    [...localesToLoad].map(async (loc) => {
      const loader = localeImportMap[loc]
      if (loader) {
        try {
          const module = await loader()
          messages[loc] = module.default
        }
        catch {
          // Fallback silently
        }
      }
    }),
  )

  // Merge with custom messages
  if (options?.messages) {
    Object.assign(messages, options.messages)
  }

  return {
    locale,
    fallback,
    messages,
    rtl: options?.rtl ?? {},
  }
}
