import type { ThemeDefinition } from 'vuetify'

interface VariationsOptions {
  colors: string[]
  lighten: number
  darken: number
}
export interface ThemeConfig {
  defaultTheme?: 'light' | 'dark' | 'system' | (string & {})
  variations?: false | VariationsOptions
  themes?: Record<string, ThemeDefinition>
}
