import {
  defineNuxtModule,
  addPlugin,
  addImports,
  createResolver,
  useLogger, extendViteConfig, addVitePlugin,
} from '@nuxt/kit'
import type { ModuleOptions } from './types'
import type { Nuxt } from '@nuxt/schema'

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
      config.build ||= {}
      config.build.rollupOptions ||= {}
      config.build.rollupOptions.output ||= {}
      if ('manualChunks' in config.build.rollupOptions.output) {
        config.build.rollupOptions.output.manualChunks = (id) => {
          if (id.includes('vuetify')) return 'vuetify'
          // if (id.includes('node_modules')) return 'vendor'
        }
      }
    })
    // Transform asset URLs
    if (options.transformAssetUrls) {
      nuxt.options.vue.transformAssetUrls ??= {}
      Object.assign(nuxt.options.vue.transformAssetUrls, {
        'v-img': ['src'],
        'v-card': ['image'],
        'v-card-item': ['image'],
        'v-carousel-item': ['src'],
        'v-navigation-drawer': ['image'],
        'v-parallax': ['src'],
        'v-avatar': ['image'],
      })
    }
    // Auto-import configuration
    if (options.autoImport) {
      await setupAutoImport(nuxt, options.autoImport)
    }

    logger.success('Vuetify module setup complete')
  },
})
/*
* Function - Add Style
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
* Function - Add Icon Style
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
* Function - Add Vuetify Composables
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
/*
* Function - Setup Vuetify tree-shaking + auto-import
* components and directives with vite-plugin-vuetify
*/
async function setupAutoImport(
  nuxt: Nuxt,
  autoImport: NonNullable<ModuleOptions['autoImport']>,
) {
  const isObject = typeof autoImport === 'object'
  const includeLabs = isObject && autoImport.labs
  const ignore = isObject ? autoImport.ignore ?? [] : []

  try {
    const vuetify = await import('vite-plugin-vuetify').then(m => m.default)

    addVitePlugin(vuetify({
      autoImport: typeof autoImport === 'boolean'
        ? autoImport
        : {
            labs: includeLabs,
            ignore,
          },

    }))
  }
  catch {
    const logger = useLogger(MODULE_NAME)
    logger.warn('vite-plugin-vuetify not found. Auto-import disabled.')
  }
}

// Export types
export type { ModuleOptions, VuetifyHooks, VuetifyHookContext } from './types'
