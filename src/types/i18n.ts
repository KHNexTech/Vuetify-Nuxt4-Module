import type { LocaleInstance } from 'vuetify'

export interface I18nConfig {
  /**
   * vue-i18n integration (works with @nuxtjs/i18n or vue-i18n)
   * - true: auto-detect @nuxtjs/i18n, enable if found
   * - false: disable i18n integration
   * - { adapter: true }: force to enable (user must install vue-i18n)
   * - { adapter: false }: disable adapter
   * @default false
   */
  adapter?: boolean
}

/**
 * Vuetify's LocaleInstance interface for i18n adapter
 *
 * This adapter is created automatically when @nuxtjs/i18n or vue-i18n is installed.
 * It integrates Vuetify's locale system with vue-i18n.
 *
 * @see https://vuetifyjs.com/en/features/internationalization/#vue-i18n
 * @see https://i18n.nuxtjs.org/
 *
 * @example
 * ```typescript
 * // Option 1: With @nuxtjs/i18n (recommended)
 * // nuxt.config.ts
 * export default defineNuxtConfig({
 *   modules: [
 *     '@nuxtjs/i18n',
 *     'vuetify-nuxt4-module',
 *   ],
 *   i18n: {
 *     locales: ['en', 'km', 'ar'],
 *     defaultLocale: 'en',
 *   },
 * })
 *
 * // Option 2: With standalone vue-i18n
 * // plugins/i18n.ts
 * import { createI18n } from 'vue-i18n'
 *
 * export default defineNuxtPlugin((nuxtApp) => {
 *   const i18n = createI18n({
 *     legacy: false,
 *     locale: 'en',
 *     messages: { en: { ... }, km: { ... } },
 *   })
 *   nuxtApp.vueApp.use(i18n)
 * })
 * ```
 */

export interface I18nLocaleAdapter extends LocaleInstance {
  t: (key: string, ...params: unknown[]) => string
}
