import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('Vuetify Nuxt 4 Module', async () => {
  await setup({
    rootDir: './playground',
    dev: false,
  })

  it('renders vuetify app', async () => {
    const html = await $fetch('/')
    expect(html).toContain('v-application')
  })

  it('applies theme', async () => {
    const html = await $fetch('/')
    expect(html).toContain('theme--light')
  })
})
