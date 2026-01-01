import type { IconOptions } from 'vuetify/framework'

export type IconSetName = 'mdi' | 'mdi-svg' | 'fa' | 'fa-svg' | 'fa4' | 'md' | 'custom'

export interface IconsConfig {
  defaultSet?: IconSetName
  aliases?: Record<string, string>
  sets?: Record<string, IconSetName>
  svg?: {
    mdi?: {
      aliases?: Record<string, string>
    }
    fa?: {
      libraries?: string[]
    }
  }
}

export type ResolvedIconConfig = IconOptions
