import type { LocaleMessages, LocaleOptions, RtlOptions } from 'vuetify/framework'

export interface LocaleConfig {
  locale?: string
  fallback?: string
  messages?: LocaleMessages
  rtl?: Record<string, boolean>
}

export interface ResolvedLocaleConfig extends LocaleOptions, RtlOptions {
  locale?: string
  fallback?: string
  rtl?: Record<string, boolean>
}
