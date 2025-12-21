import type { VuetifyOptions } from 'vuetify'
import type { DateAdapterName } from '../types'
import { logger } from './logger'

type DateConfig = VuetifyOptions['date']

const adapterPackages: Record<DateAdapterName, string[]> = {
  'vuetify': ['vuetify'],
  'date-fns': ['@date-io/date-fns', 'date-fns'],
  'dayjs': ['@date-io/dayjs', 'dayjs'],
  'luxon': ['@date-io/luxon', 'luxon'],
  'moment': ['@date-io/moment', 'moment'],
}

const adapterCache = new Map<string, DateConfig>()

export async function createDateConfig(adapterName: DateAdapterName = 'vuetify'): Promise<DateConfig | undefined> {
  const cached = adapterCache.get(adapterName)
  if (cached) return cached

  try {
    let config: DateConfig

    switch (adapterName) {
      case 'date-fns': {
        const { default: adapter } = await import('@date-io/date-fns')
        config = { adapter }
        break
      }
      case 'dayjs': {
        const { default: adapter } = await import('@date-io/dayjs')
        config = { adapter }
        break
      }
      case 'luxon': {
        const { default: adapter } = await import('@date-io/luxon')
        config = { adapter }
        break
      }
      case 'moment': {
        const { default: adapter } = await import('@date-io/moment')
        config = { adapter }
        break
      }
      default: {
        const { VuetifyDateAdapter } = await import('vuetify/date/adapters/vuetify')
        config = { adapter: VuetifyDateAdapter }
      }
    }

    adapterCache.set(adapterName, config)
    return config
  }
  catch {
    const packages = adapterPackages[adapterName]
    logger.error(
      `Date adapter "${adapterName}" failed to load.\n`
      + `Install required packages: npm install ${packages.join(' ')}`,
    )
    return undefined
  }
}
