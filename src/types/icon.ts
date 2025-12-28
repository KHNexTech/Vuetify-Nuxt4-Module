export type IconSetName = 'mdi' | 'mdi-svg' | 'fa' | 'fa-svg' | 'md' | 'custom'

export interface IconConfig {
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
