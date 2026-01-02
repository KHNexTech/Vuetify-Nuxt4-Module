import type { App, Component, AsyncComponentLoader } from 'vue'
import type { LazyComponentName } from '../types'
import { logger } from './logger'

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
