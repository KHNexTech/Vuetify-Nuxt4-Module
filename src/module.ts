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
import { transformAssetUrls } from 'vite-plugin-vuetify'

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

    // Add composables
    if (options.importComposables) {
      addVuetifyComposables(options.prefixComposables)
    }

    // Add module composables and hooks
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

    /* ------Configure Vite------ */
    extendViteConfig((config) => {
      /* Optimize Vuetify */
      config.optimizeDeps ??= {}
      config.optimizeDeps.include ??= []
      config.optimizeDeps.include.push('vuetify')
      /* ------Bundle optimizations------ */
      config.optimizeDeps.exclude ??= []
      config.optimizeDeps.exclude.push(
        // 'vuetify',
        'vuetify/components',
        'vuetify/directives',
      )

      /* ------Force ESBuild Tree-Shaking (Hidden Gem)------ */
      config.esbuild ||= {}
      config.esbuild.treeShaking = true

      /* ------Split Vuetify Into Its Own Chunk------ */
      config.build ??= {}
      config.build.rollupOptions ??= {}
      // Handle rollupOptions.output properly
      const output = config.build.rollupOptions.output
      if (output && !Array.isArray(output)) {
        const existingManualChunks = output.manualChunks
        output.manualChunks = (id, context) => {
          if (id.includes('vuetify')) return 'vuetify'

          // Call existing manualChunks if it's a function
          if (typeof existingManualChunks === 'function') {
            return existingManualChunks(id, context)
          }

          // Handle object-based manualChunks
          if (existingManualChunks && typeof existingManualChunks === 'object') {
            for (const [chunk, patterns] of Object.entries(existingManualChunks)) {
              if (patterns.some((pattern: string) => id.includes(pattern))) {
                return chunk
              }
            }
          }

          return undefined
        }
      }
    })
    // Transform asset URLs
    if (options.transformAssetUrls) {
      await setupTransformAssetUrls(nuxt)
    }
    // Auto-import configuration
    if (options.autoImport) {
      await setupAutoImport(options.autoImport, logger)
    }

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
* Function - Add icon CSS based on icon set
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
* Function - Add Vuetify composables with optional prefix
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

// Export types
export type { ModuleOptions, VuetifyHooks, VuetifyHookContext } from './types'
