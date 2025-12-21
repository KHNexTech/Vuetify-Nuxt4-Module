export function measurePerformance(name: string, fn: () => void | Promise<void>) {
  if (import.meta.dev) {
    const start = performance.now()
    const result = fn()

    if (result instanceof Promise) {
      return result.finally(() => {
        console.log(`[vuetify] ${name}: ${(performance.now() - start).toFixed(2)}ms`)
      })
    }

    console.log(`[vuetify] ${name}: ${(performance.now() - start).toFixed(2)}ms`)
    return result
  }

  return fn()
}
