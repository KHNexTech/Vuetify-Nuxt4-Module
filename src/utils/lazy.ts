// src/runtime/utils/lazy.ts
import { defineAsyncComponent, type Component } from 'vue'
import type { NuxtApp } from '#app'
import type { AsyncComponentLoader } from '@vue/runtime-core'

export interface LazyComponentOptions {
  delay?: number
  timeout?: number
  loadingComponent?: Component
  errorComponent?: Component
}

const defaultOptions: LazyComponentOptions = {
  delay: 200,
  timeout: 10000,
}

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

export type LazyComponentName = keyof typeof heavyComponents

export function createLazyComponent(
  name: LazyComponentName,
  options: LazyComponentOptions = {},
): Component {
  const loader: AsyncComponentLoader = heavyComponents[name]
  if (!loader) {
    throw new Error(`Unknown lazy component: ${name}`)
  }

  const opts = { ...defaultOptions, ...options }

  return defineAsyncComponent({
    loader: loader,
    delay: opts.delay,
    timeout: opts.timeout,
    loadingComponent: opts.loadingComponent,
    errorComponent: opts.errorComponent,
  })
}

export function registerLazyComponents(
  app: NuxtApp['vueApp'],
  components: LazyComponentName[] = [],
  options: LazyComponentOptions = {},
): void {
  const componentsToRegister = components.length > 0
    ? components
    : Object.keys(heavyComponents) as LazyComponentName[]

  for (const name of componentsToRegister) {
    app.component(name, createLazyComponent(name, options))
  }
}
