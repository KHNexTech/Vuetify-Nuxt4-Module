import type { IconsConfig } from './icon'
import type { LocaleConfig } from './locale'
import type { ThemeConfig } from './theme'
import type { BlueprintName } from './blueprint'
import type { DateAdapterName } from './date'
import type * as Components from 'vuetify/components'
import type { VuetifyOptions } from 'vuetify'

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
  theme?: ThemeConfig

  /**
   * Icon configuration
   */
  icons?: IconsConfig

  /**
   * Locale configuration
   */
  locale?: LocaleConfig

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

export type VuetifyModuleOptions = Partial<Omit<VuetifyOptions, 'aliases' | 'blueprint' | 'theme' | 'icons' | 'locale'> & VuetifyOptionsConfig>
