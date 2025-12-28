import type { IconAliases, IconOptions, IconSet } from 'vuetify'
import { logger } from './logger'
import type { IconSetName, IconConfig } from '../types'

export type { IconSetName, IconConfig } from '../types'
/**
 * Load icon set based on configuration
 */
export async function loadIconSet(setName: IconSetName): Promise<IconSet | undefined> {
  try {
    switch (setName) {
      case 'mdi':
        return (await import('vuetify/iconsets/mdi')).mdi
      case 'mdi-svg':
        return (await import('vuetify/iconsets/mdi-svg')).mdi
      case 'fa':
        return (await import('vuetify/iconsets/fa')).fa
      case 'fa-svg':
        return (await import('vuetify/iconsets/fa-svg')).fa
      case 'md':
        return (await import('vuetify/iconsets/md')).md
      default:
        return undefined
    }
  }
  catch (error) {
    logger.warn(`Failed to load icon set "${setName}":`, error)
    return undefined
  }
}

/**
 * Load default aliases for icon set
 */
export async function loadIconAliases(setName: IconSetName): Promise<IconAliases | undefined> {
  try {
    switch (setName) {
      case 'mdi':
        return (await import('vuetify/iconsets/mdi')).aliases
      case 'mdi-svg':
        return (await import('vuetify/iconsets/mdi-svg')).aliases
      case 'fa':
        return (await import('vuetify/iconsets/fa')).aliases
      case 'fa-svg':
        return (await import('vuetify/iconsets/fa-svg')).aliases
      case 'md':
        return (await import('vuetify/iconsets/md')).aliases
      default:
        return undefined
    }
  }
  catch (error) {
    logger.warn(`Failed to load aliases for icon set "${setName}":`, error)
    return undefined
  }
}

/**
 * Resolve SVG icon aliases from @mdi/js
 * Maps alias names to actual mdi icon paths
 */
export async function resolveMdiSvgAliases(
  aliases: Record<string, string>,
): Promise<Record<string, string>> {
  const resolved: Record<string, string> = {}

  try {
    // Dynamically import @mdi/js
    const mdiModule = await import('@mdi/js')

    for (const [aliasName, iconName] of Object.entries(aliases)) {
      // iconName should be like 'mdiAccount', 'mdiHome', etc.
      // Access the icon path, skipping 'default' export
      if (iconName in mdiModule && iconName !== 'default') {
        const iconPath = (mdiModule as unknown as Record<string, string>)[iconName]
        if (!iconPath) {
          logger.warn(`MDI icon "${iconName}" not found for alias "${aliasName}" for iconPath`)
          continue
        }
        resolved[aliasName] = iconPath
      }
      else {
        logger.warn(`MDI icon "${iconName}" not found for alias "${aliasName}"`)
      }
    }
  }
  catch (error) {
    logger.warn('Failed to import @mdi/js. Make sure it is installed:', error)
  }

  return resolved
}

/**
 * Create Vuetify icon configuration
 */
export async function createIconConfig(
  config?: IconConfig,
): Promise<IconOptions> {
  const defaultSet = config?.defaultSet ?? 'mdi'
  const isSvgSet = defaultSet.includes('svg')

  // Load the icon set
  const iconSet = await loadIconSet(defaultSet)

  // Load default aliases for Vuetify components
  const defaultAliases = await loadIconAliases(defaultSet)

  // Build the sets object
  const sets: Record<string, IconSet> = {}

  // Map the set name to the appropriate key
  // For 'mdi-svg', the set key is 'mdi'
  const setKey = defaultSet.replace('-svg', '')
  if (iconSet) {
    sets[setKey] = iconSet
  }

  // Handle custom aliases
  let customAliases: Record<string, string> = {}

  if (isSvgSet && config?.svg?.mdi?.aliases) {
    // For SVG sets, resolve icon paths from @mdi/js
    customAliases = await resolveMdiSvgAliases(config.svg.mdi.aliases)
  }
  else if (config?.aliases) {
    // For font-based sets, aliases are just string names
    customAliases = config.aliases
  }

  // Merge aliases
  const aliases = {
    ...defaultAliases,
    ...customAliases,
  }

  const iconOptions: IconOptions = {
    defaultSet: setKey,
    aliases,
    sets,
  }

  logger.debug(`Icon configuration created with defaultSet: ${setKey}`)

  return iconOptions
}

/**
 * Get CSS import path for font-based icon sets
 * Returns undefined for SVG-based sets (no CSS needed)
 */
export function getIconCssPath(setName: IconSetName): string | undefined {
  // SVG sets don't need CSS
  if (setName.includes('svg')) {
    return undefined
  }

  const cssMap: Record<string, string> = {
    mdi: '@mdi/font/css/materialdesignicons.css',
    fa: '@fortawesome/fontawesome-free/css/all.css',
    md: 'material-design-icons-iconfont/dist/material-design-icons.css',
  }

  return cssMap[setName]
}
