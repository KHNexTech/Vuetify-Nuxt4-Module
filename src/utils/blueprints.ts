import type { Blueprint } from 'vuetify'
import type { BlueprintName } from '../types'

let blueprintsCache: typeof import('vuetify/blueprints') | null = null

const fallbackDefaults: Record<BlueprintName, Blueprint> = {
  md1: {
    defaults: {
      VBtn: { variant: 'elevated', rounded: false },
      VCard: { variant: 'elevated', rounded: 'md' },
    },
  },
  md2: {
    defaults: {
      VBtn: { variant: 'elevated', rounded: 'sm' },
      VCard: { variant: 'elevated', rounded: 'lg' },
    },
  },
  md3: {
    defaults: {
      VBtn: { variant: 'elevated', rounded: 'xl' },
      VCard: { variant: 'elevated', rounded: 'xl' },
    },
  },
}

export async function loadBlueprint(name: BlueprintName): Promise<Blueprint> {
  try {
    blueprintsCache ??= await import('vuetify/blueprints')
    return blueprintsCache[name]
  }
  catch {
    return fallbackDefaults[name]
  }
}
