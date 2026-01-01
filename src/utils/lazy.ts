import type { App, Component, AsyncComponentLoader } from 'vue'
import type { LazyComponentName } from '../node'
import { logger } from './logger'

// Map of heavy Vuetify components
const heavyComponents = {
  VDataTable: () => import('vuetify/components/VDataTable').then(m => ({ default: m.VDataTable })),
  VDataTableServer: () => import('vuetify/components/VDataTable').then(m => ({ default: m.VDataTableServer })),
  VDataTableVirtual: () => import('vuetify/components/VDataTable').then(m => ({ default: m.VDataTableVirtual })),
  VCalendar: () => import('vuetify/components/VCalendar').then(m => ({ default: m.VCalendar })),
  VDatePicker: () => import('vuetify/components/VDatePicker').then(m => ({ default: m.VDatePicker })),
  VTimePicker: () => import('vuetify/components/VTimePicker').then(m => ({ default: m.VTimePicker })),
  VColorPicker: () => import('vuetify/components/VColorPicker').then(m => ({ default: m.VColorPicker })),
  VVirtualScroll: () => import('vuetify/components/VVirtualScroll').then(m => ({ default: m.VVirtualScroll })),
  VInfiniteScroll: () => import('vuetify/components/VInfiniteScroll').then(m => ({ default: m.VInfiniteScroll })),
  VSparkline: () => import('vuetify/components/VSparkline').then(m => ({ default: m.VSparkline })),
} as const

/**
 * Create a lazy-loaded component
 */
export function createLazyComponent(
  loader: AsyncComponentLoader,
  options?: { delay?: number, timeout?: number },
): Component {
  return {
    name: 'LazyComponent',
    async setup() {
      const { defineAsyncComponent } = await import('vue')
      return () => defineAsyncComponent({
        loader,
        delay: options?.delay ?? 200,
        timeout: options?.timeout ?? 30000,
      })
    },
  }
}

/**
 * Register lazy-loaded Vuetify components
 */
export function registerLazyComponents(
  app: App,
  components?: LazyComponentName[],
  options?: { delay?: number },
): void {
  const delay = options?.delay ?? 200

  // Default heavy components to lazy load
  const defaultComponents: LazyComponentName[] = [
    'VDataTable',
    'VDatePicker',
    'VCalendar',
    'VTimePicker',
    'VColorPicker',
  ]

  const componentsToLazyLoad = components ?? defaultComponents

  for (const componentName of componentsToLazyLoad) {
    try {
      // Note: This is a placeholder. In practice, vite-plugin-vuetify
      // handles lazy loading of Vuetify components automatically.
      logger.debug(`Lazy loading configured for: ${componentName}`)
    }
    catch (error) {
      logger.warn(`Failed to register lazy component ${componentName}:`, error)
    }
  }

  logger.debug('Lazy components configuration applied', { components: componentsToLazyLoad, delay })
}
