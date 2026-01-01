import type { LocaleMessages } from 'vuetify'
import type { LocaleConfig, ResolvedLocaleConfig } from '../node'

// Map of available locales - only import what's needed
const localeImportMap: Record<string, () => Promise<{ default: LocaleMessages }>> = {
  en: () => import('vuetify/locale').then(m => ({ default: m.en })),
  ja: () => import('vuetify/locale').then(m => ({ default: m.ja })),
  km: () => import('vuetify/locale').then(m => ({ default: m.km })),
  ko: () => import('vuetify/locale').then(m => ({ default: m.ko })),
  zhHans: () => import('vuetify/locale').then(m => ({ default: m.zhHans })),
  zhHant: () => import('vuetify/locale').then(m => ({ default: m.zhHant })),
}
/**
 * Create locale configuration for Vuetify
 */
export async function createLocaleConfig(
  options?: LocaleConfig,
): Promise<ResolvedLocaleConfig> {
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

/**
 * Check if a locale is RTL
 */
export function isRtlLocale(locale: string, rtlConfig?: Record<string, boolean>): boolean {
  // Check custom RTL config first
  if (rtlConfig && locale in rtlConfig && rtlConfig[locale]) {
    return rtlConfig[locale]
  }

  // Default RTL locales
  const defaultRtlLocales = ['ar', 'he', 'fa', 'ur', 'yi', 'ps', 'sd']
  return defaultRtlLocales.includes(locale)
}
