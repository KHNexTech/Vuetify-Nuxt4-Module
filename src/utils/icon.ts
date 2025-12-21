import type { IconOptions } from 'vuetify'
import type { ModuleOptions } from '../types'

type IconSet = NonNullable<ModuleOptions['vuetifyOptions']['icons']>['defaultSet']

const iconSetCache = new Map<string, Omit<IconOptions, 'defaultSet'>>()

export async function loadIconSet(
  defaultSet: IconSet = 'mdi',
): Promise<Omit<IconOptions, 'defaultSet'>> {
  const cached = iconSetCache.get(defaultSet)
  if (cached) return cached

  let result: Omit<IconOptions, 'defaultSet'>

  switch (defaultSet) {
    case 'mdi': {
      const { aliases, mdi } = await import('vuetify/iconsets/mdi')
      result = { aliases, sets: { mdi } }
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
    default: {
      const { aliases, mdi } = await import('vuetify/iconsets/mdi')
      result = { aliases, sets: { mdi } }
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
