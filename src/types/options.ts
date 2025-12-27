import type * as Components from 'vuetify/components'
import type * as Directives from 'vuetify/directives'
import type { IconOptions, VuetifyOptions, LocaleMessages } from 'vuetify'

export type IconSet = 'mdi' | 'mdi-svg' | 'fa' | 'fa-svg' | 'md' | 'custom'
export type BlueprintName = 'md1' | 'md2' | 'md3'
export type DateAdapterName = 'vuetify' | 'date-fns' | 'dayjs' | 'luxon' | 'moment'

export interface VuetifyOptionsConfig {
  /**
   * Component aliases (e.g., { VButton: VBtn, MyButton: 'VBtn' })
   */
  aliases?: Record<string, keyof typeof Components> | Record<string, string>

  /**
   * Blueprint preset
   * @default 'md3'
   */
  blueprint?: BlueprintName

  /**
   * Default component configurations
   */
  defaults?: VuetifyOptions['defaults']

  /**
   * Theme configuration
   */
  theme?: Exclude<VuetifyOptions['theme'], false>

  /**
   * Icon configuration
   */
  icons?: {
    defaultSet?: IconSet
    aliases?: IconOptions['aliases']
    sets?: IconOptions['sets']
  }

  /**
   * Locale configuration
   */
  locale?: {
    locale?: string
    fallback?: string
    messages?: LocaleMessages
    rtl?: Record<string, boolean>
  }

  /**
   * Date adapter configuration for date pickers
   * Options: 'vuetify' (built-in), 'date-fns', 'moment', 'luxon', 'dayjs', 'js-joda'
   * @default 'vuetify'
   */
  dateAdapter?: DateAdapterName
  /**
   * Enable/disable SSR
   * @default true
   */
  ssr?: boolean
}

export interface PersistenceConfig {
  enabled?: boolean
  key?: string
  storage?: 'cookie' | 'localStorage' | 'sessionStorage'
  cookieOptions?: {
    maxAge?: number
    path?: string
    sameSite?: 'strict' | 'lax' | 'none'
  }
}

export interface ModuleOptions {
  /**
   * Vuetify instance configuration
   */
  vuetifyOptions: Partial<Omit<VuetifyOptions, 'aliases' | 'blueprint' | 'theme' | 'icons' | 'locale'> & VuetifyOptionsConfig>

  /**
   * Auto-import Vuetify composables
   * @default true
   */
  importComposables?: boolean

  /**
   * If you are using another composables that collide with the Vuetify ones,
   * enable this flag to prefix them with `V`:
   * - `useLocale` -> `useVLocale`
   * - `useDefaults` -> `useVDefaults`
   * - `useDisplay` -> `useVDisplay`
   * - `useLayout` -> `useVLayout`
   * - `useRtl` -> `useVRtl`
   * - `useTheme` -> `useVTheme`
   *
   * @default false
   */
  prefixComposables?: boolean
  /**
   * Lazy load heavy components
   * @default false
   */
  lazyComponents?: boolean | {
    /**
     * Components to lazy load
     * @default ['VDataTable', 'VCalendar', 'VDatePicker', 'VColorPicker']
     */
    components?: (
      | 'VDataTable'
      | 'VDataTableServer'
      | 'VDataTableVirtual'
      | 'VCalendar'
      | 'VDatePicker'
      | 'VTimePicker'
      | 'VColorPicker'
      | 'VVirtualScroll'
      | 'VInfiniteScroll'
      | 'VSparkline'
    )[]
    /**
     * Delay before showing loading state (ms)
     * @default 200
     */
    delay?: number
  }

  /**
   * Transform asset URLs in Vuetify components
   * @default true
   */
  transformAssetUrls?: boolean

  /**
   * Enable automatic tree-shaking via vite-plugin-vuetify
   * Vuetify components and directives will be automatically imported
   * Include lab components when autoImport:  { labs: true }
   * @default true
   */
  autoImport?: boolean | {
    labs?: boolean
    ignore?: (keyof typeof Components | keyof typeof Directives)[]
  }

  /**
   * Include Vuetify styles
   * @default true
   */
  styles?: true | 'none' | 'sass' | {
    configFile: string
  }

  /**
   * Integration with vue-i18n for Vuetify locale
   * Auto-detects and integrates vue-i18n when available
   * Set to false to disable
   * @default true (auto-detect)
   */
  i18n?: boolean | {
    /**
     * Use vue-i18n adapter for Vuetify locale
     * @default true
     */
    useVueI18nAdapter?: boolean
  }
  /**
   * Preload critical assets
   * @default { fonts: false, criticalCSS: true }
   */
  preload?: {
    fonts?: boolean
    criticalCSS?: boolean
  }

  /**
   * Theme persistence configuration
   * @default { enabled: true, storage: 'cookie', key: 'nuxt-vuetify-theme' }
   */
  persistence?: PersistenceConfig
}

// Runtime config type for plugin access
export interface VuetifyRuntimeConfig {
  vuetifyOptions: ModuleOptions['vuetifyOptions']
  persistence?: PersistenceConfig
  i18n?: ModuleOptions['i18n']
  lazyComponents?: ModuleOptions['lazyComponents']
}

// ============================================
// Module Declarations
// ============================================
declare module '@nuxt/schema' {
  interface NuxtConfig {
    vuetify?: Partial<ModuleOptions>
  }
  interface NuxtOptions {
    vuetify?: ModuleOptions
  }
}

declare module 'nuxt/schema' {
  interface NuxtConfig {
    vuetify?: Partial<ModuleOptions>
  }
  interface NuxtOptions {
    vuetify?: ModuleOptions
  }
}
