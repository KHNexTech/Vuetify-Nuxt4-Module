import {
  defineNuxtModule,
  addPlugin,
  addImports,
  createResolver,
  useLogger, extendViteConfig, addVitePlugin,
} from '@nuxt/kit'
import type { ModuleOptions } from './types'
import type { Nuxt } from '@nuxt/schema'
import defu from 'defu'

const MODULE_NAME = 'nuxt-vuetify-module'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: MODULE_NAME,
    configKey: 'vuetify',
    compatibility: {
      nuxt: '>=4.0.0',
    },
  },

  defaults: {
    vuetifyOptions: {
      blueprint: 'md3',
      dateAdapter: 'vuetify',
      icons: {
        defaultSet: 'mdi',
      },
      ssr: true,
    },
    importComposables: true,
    prefixComposables: false,
    transformAssetUrls: true,
    autoImport: true,
    styles: true,
    persistence: {
      enabled: true,
      key: 'nuxt-vuetify-theme',
      storage: 'cookie',
      cookieOptions: {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        sameSite: 'lax',
      },
    },
  },

  async setup(options, nuxt) {
    const logger = useLogger(MODULE_NAME)
    const { resolve } = createResolver(import.meta.url)

    logger.info('Setting up Vuetify module...')

    // Call register hook to allow programmatic configuration
    await nuxt.callHook('vuetify:register', (additionalOptions: Partial<ModuleOptions>) => {
      options = defu(additionalOptions, options) as ModuleOptions
    })

    // Add runtime config
    nuxt.options.runtimeConfig.public.vuetify = {
      vuetifyOptions: options.vuetifyOptions,
      persistence: options.persistence,
    }

    // Add styles
    addStyles(nuxt, options.styles)

    // Add icon CSS
    addIconStyles(nuxt, options.vuetifyOptions.icons)

    // Transpile vuetify
    nuxt.options.build.transpile.push('vuetify')

    // Add plugin
    addPlugin({
      src: resolve('./runtime/plugins/vuetify'),
      mode: 'all',
    })

    // Add Composables
    if (options.importComposables) {
      addVuetifyComposables(options.prefixComposables)
    }

    // Module imports
    addImports([
      {
        name: 'useVuetify',
        from: resolve('./runtime/composables/useVuetify'),
      },
      {
        name: 'onVuetifyHook',
        from: resolve('./utils/hooks'),
      },
      {
        name: 'offVuetifyHook',
        from: resolve('./utils/hooks'),
      },
    ])

    /* ------Configure Vite - Vite performance optimizations------ */
    extendViteConfig((config) => {
      /* Pre-bundle vuetify for faster dev startup */
      config.optimizeDeps ??= {}
      config.optimizeDeps.include ??= []
      config.optimizeDeps.include.push('vuetify')

      /* ------Exclude for tree-shaking in production------ */
      config.optimizeDeps.exclude ??= []
      config.optimizeDeps.exclude.push('vuetify/components', 'vuetify/directives')

      /* ------Enable tree-shaking------ */
      config.esbuild ??= {}
      if (typeof config.esbuild !== 'boolean') {
        config.esbuild.treeShaking = true
      }

      /* ------Build optimizations------ */
      config.build ??= {}
      config.build.rollupOptions ??= {}

      // Suppress dynamic import warnings for vuetify
      const existingOnWarn = config.build.rollupOptions.onwarn
      config.build.rollupOptions.onwarn = (warning, warn) => {
        if (warning.message?.includes('vuetify') && warning.message?.includes('dynamically imported')) {
          return
        }
        if (existingOnWarn) {
          existingOnWarn(warning, warn)
        }
        else {
          warn(warning)
        }
      }

      // Manual chunks for better caching
      const output = config.build.rollupOptions.output
      if (output && !Array.isArray(output)) {
        output.manualChunks = (id) => {
          // Vuetify styles
          if (id.includes('vuetify') && (id.endsWith('.css') || id.endsWith('.sass') || id.endsWith('.scss'))) {
            return 'vuetify-styles'
          }
          // Vuetify core framework
          if (id.includes('vuetify/lib/composables') || id.includes('vuetify/lib/util')) {
            return 'vuetify-core'
          }
          // Vuetify framework
          if (id.includes('vuetify/lib/framework')) {
            return 'vuetify-framework'
          }
          // Vuetify components
          if (id.includes('vuetify/lib/components')) {
            return 'vuetify-components'
          }
          // Vuetify directives
          if (id.includes('vuetify/lib/directives')) {
            return 'vuetify-directives'
          }
          // Icon fonts
          if (id.includes('@mdi/font') || id.includes('materialdesignicons')) {
            return 'icons'
          }
          // Vuetify styles
          if (id.includes('vuetify') && /\.(?:css|sass|scss)$/.test(id)) {
            return 'vuetify-styles'
          }
          // Other vuetify
          if (id.includes('vuetify')) {
            return 'vuetify'
          }
        }
      }

      // Minification settings
      config.build.minify = 'esbuild'
      config.build.cssMinify = 'lightningcss'
      // config.build.cssMinify = true
      config.build.cssCodeSplit = true
    })
    // Transform asset URLs
    if (options.transformAssetUrls) {
      await setupTransformAssetUrls(nuxt)
    }
    // Auto-import configuration
    if (options.autoImport) {
      await setupAutoImport(options.autoImport, logger)
    }

    // SSR optimizations
    if (options.vuetifyOptions.ssr) {
      nuxt.options.vite.ssr ??= {}
      nuxt.options.vite.ssr.noExternal ??= []
      if (Array.isArray(nuxt.options.vite.ssr.noExternal)) {
        nuxt.options.vite.ssr.noExternal.push('vuetify')
      }
    }
    addPreloadHints(nuxt, options.vuetifyOptions.icons)
    logger.success('Vuetify module setup complete')
  },
})
/*
* Function - Add Vuetify styles
*/
function addStyles(
  nuxt: Nuxt,
  styles: ModuleOptions['styles'],
) {
  if ((typeof styles === 'boolean' && !styles) || styles === 'none') return

  if (typeof styles === 'object' && styles.configFile) {
    // Custom SASS config file
    nuxt.options.css.unshift(styles.configFile)
  }
  else if (styles === 'sass') {
    nuxt.options.css.unshift('vuetify/styles/main.sass')
  }
  else {
    nuxt.options.css.unshift('vuetify/styles')
  }
}
/*
* Function - Add icon CSS based on an icon set
*/
function addIconStyles(nuxt: Nuxt, icons?: ModuleOptions['vuetifyOptions']['icons']) {
  const defaultSet = icons?.defaultSet ?? 'mdi'

  // Skip SVG sets
  if (defaultSet.includes('svg')) return

  const cssMap: Record<string, string> = {
    mdi: '@mdi/font/css/materialdesignicons.css',
    fa: '@fortawesome/fontawesome-free/css/all.css',
  }

  const css = cssMap[defaultSet]
  if (css && !nuxt.options.css.includes(css)) {
    nuxt.options.css.push(css)
  }
}
/*
* Function - Add Vuetify composables with an optional prefix
*/
function addVuetifyComposables(
  prefix?: boolean,
) {
  const composables = [
    'useLocale',
    'useDefaults',
    'useDisplay',
    'useLayout',
    'useRtl',
    'useTheme',
    'useDate',
    'useGoTo',
  ]

  const imports = composables.map(name => ({
    name,
    as: prefix ? name.replace('use', 'useV') : name,
    from: 'vuetify',
  }))

  addImports(imports)
}

/**
 * Setup to transform asset URLs for Vuetify components
 */
async function setupTransformAssetUrls(nuxt: Nuxt) {
  try {
    const { transformAssetUrls } = await import('vite-plugin-vuetify')

    nuxt.options.vite.vue ??= {}
    nuxt.options.vite.vue.template = defu(nuxt.options.vite.vue.template || {}, {
      transformAssetUrls,
    })
  }
  catch {
    // Fallback if vite-plugin-vuetify is not available
    const fallbackTransformAssetUrls = {
      'v-img': ['src'],
      'v-card': ['image'],
      'v-card-item': ['image'],
      'v-carousel-item': ['src'],
      'v-navigation-drawer': ['image'],
      'v-parallax': ['src'],
      'v-avatar': ['image'],
    }

    nuxt.options.vite.vue ??= {}
    nuxt.options.vite.vue.template = defu(nuxt.options.vite.vue.template || {}, {
      transformAssetUrls: fallbackTransformAssetUrls,
    })
  }
}

/*
* Function - Setup Vuetify auto-import with vite-plugin-vuetify
* components and directives auto-import
*/
async function setupAutoImport(
  autoImport: NonNullable<ModuleOptions['autoImport']>,
  logger: ReturnType<typeof useLogger>,
) {
  try {
    const vuetifyPlugin = await import('vite-plugin-vuetify').then(m => m.default)

    const autoImportConfig
      = typeof autoImport === 'boolean'
        ? autoImport
        : {
            labs: autoImport.labs ?? false,
            ignore: autoImport.ignore ?? [],
          }

    addVitePlugin(vuetifyPlugin({ autoImport: autoImportConfig }))
  }
  catch {
    logger.warn(
      'vite-plugin-vuetify not found. Install it for auto-import support:\n'
      + '  npm install -D vite-plugin-vuetify',
    )
  }
}

function addPreloadHints(nuxt: Nuxt, icons?: ModuleOptions['vuetifyOptions']['icons']) {
  const defaultSet = icons?.defaultSet ?? 'mdi'

  nuxt.hook('nitro:config', (config) => {
    config.prerender ??= {}
    config.prerender.routes ??= []
  })

  // Add a link preload for icon fonts
  // @ts-expect-error @typescript-eslint/ban-ts-comment
  nuxt.hook('app:rendered', (ctx) => {
    if (defaultSet === 'mdi') {
      ctx.renderResult?.head?.push(
        '<link rel="preload" href="/_nuxt/@mdi/font/fonts/materialdesignicons-webfont.woff2" as="font" type="font/woff2" crossorigin>',
      )
    }
  })
}

// Export types
export type { ModuleOptions, VuetifyHooks, VuetifyHookContext } from './types'
