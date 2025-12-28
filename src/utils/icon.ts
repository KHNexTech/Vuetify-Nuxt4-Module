import type { IconOptions } from 'vuetify'
import type { ModuleOptions } from '../types'

type IconSet = NonNullable<ModuleOptions['vuetifyOptions']['icons']>['defaultSet']

const iconSetCache = new Map<string, Omit<IconOptions, 'defaultSet'>>()

export async function loadIconSet(
  defaultSet: IconSet = 'mdi',
): Promise<Omit<IconOptions, 'defaultSet'>> {
  const cacheKey = defaultSet ?? 'mdi'
  const cached = iconSetCache.get(cacheKey)
  if (cached) return cached

  let result: Omit<IconOptions, 'defaultSet'>

  // Use static imports to avoid chunk splitting issues
  const { aliases, mdi } = await import('vuetify/iconsets/mdi')

  switch (defaultSet) {
    case 'mdi': {
      result = { aliases: aliases, sets: { mdi: mdi } }
      break
    }
    case 'mdi-svg': {
      const { aliases, mdi } = await import('vuetify/iconsets/mdi-svg')
      result = { aliases, sets: { mdi } }
      break
    }
    case 'fa': {
      const { aliases, fa } = await import('vuetify/iconsets/fa')
      result = { aliases, sets: { fa } }
      break
    }
    case 'fa-svg': {
      const { aliases, fa } = await import('vuetify/iconsets/fa-svg')
      result = { aliases, sets: { fa } }
      break
    }
    case 'md': {
      const { aliases, md } = await import('vuetify/iconsets/md')
      result = { aliases, sets: { md } }
      break
    }
    case 'custom': {
      // Return empty, user provides via hooks
      result = { aliases: {}, sets: {} }
      break
    }
    default: {
      result = { aliases: aliases, sets: { mdi: mdi } }
    }
  }

  iconSetCache.set(defaultSet, result)
  return result
}

export async function createIconConfig(
  options?: ModuleOptions['vuetifyOptions']['icons'],
): Promise<IconOptions> {
  const defaultSet = options?.defaultSet ?? 'mdi'
  const iconSet = await loadIconSet(defaultSet)

  return {
    defaultSet,
    aliases: { ...iconSet.aliases, ...options?.aliases },
    sets: { ...iconSet.sets, ...options?.sets },
  }
}
