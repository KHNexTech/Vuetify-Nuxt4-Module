import type { Component } from 'vue'

export interface LazyComponentsConfig {
  components?: LazyComponentName[]
  /**
   * Delay before showing loading state (ms)
   * @default 200
   */
  delay?: number
}
export interface LazyComponentOptions {
  delay?: number
  timeout?: number
  loadingComponent?: Component
  errorComponent?: Component
}
/**
 * Components to lazy load
 * @default ['VDataTable', 'VCalendar', 'VDatePicker', 'VColorPicker']
 */
export type LazyComponentName
  = | 'VDataTable'
    | 'VDataTableServer'
    | 'VDataTableVirtual'
    | 'VDatePicker'
    | 'VCalendar'
    | 'VTimePicker'
    | 'VColorPicker'
    | 'VVirtualScroll'
    | 'VInfiniteScroll'
    | 'VSparkline'
    | string
