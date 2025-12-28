import {
  defineNuxtModule,
  addPlugin,
  addImports,
  createResolver,
  useLogger,
  extendViteConfig,
  addVitePlugin,
} from '@nuxt/kit'
import type { ModuleOptions } from './types'
import type { Nuxt } from '@nuxt/schema'
import defu from 'defu'
import { getIconCssPath } from './utils'

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
    i18n: true,
    lazyComponents: false,
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
      i18n: options.i18n,
      lazyComponents: options.lazyComponents,
    }

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
      { name: 'createLazyComponent',
        from: resolve('./utils/lazy') },
    ])

    // Setup Vuetify auto-import with vite-plugin-vuetify
    const useVitePlugin = options.autoImport !== false

    if (options.autoImport && useVitePlugin) {
      // vite-plugin-vuetify styles options:
      // - true: use precompiled CSS (default)
      // - 'none': no styles (you must import manually)
      // - 'sass': use SASS source files
      // - { configFile: string }: custom SASS config file
      let vitePluginStyles: true | 'none' | 'sass' | { configFile: string } = 'none'

      if (typeof options.styles === 'object' && options.styles.configFile) {
        vitePluginStyles = { configFile: options.styles.configFile }
      }
      else if (options.styles === 'sass') {
        vitePluginStyles = 'sass'
      }
      else if (options.styles === true || options.styles === undefined) {
        // Use 'none' and manually add styles to prevent duplicates
        // vite-plugin-vuetify with styles: true can cause duplicate CSS in SSR
        vitePluginStyles = 'none'
      }

      await setupAutoImport(options.autoImport, vitePluginStyles, logger)

      // Manually add Vuetify styles (prevents duplicates better than vite-plugin-vuetify)
      if (options.styles !== 'none') {
        addStyles(nuxt, options.styles)
      }
    }
    else {
      // Only add styles manually if NOT using vite-plugin-vuetify
      addStyles(nuxt, options.styles)
    }

    // Add icon CSS (only for font-based icons)
    addIconStyles(nuxt, options.vuetifyOptions.icons)

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
        const existingManualChunks = output.manualChunks
        output.manualChunks = (id, context) => {
          // Vuetify data components (heavy)
          if (
            id.includes('VDataTable')
            || id.includes('VDataIterator')
            || id.includes('VVirtualScroll')
          ) {
            return 'vuetify-data'
          }

          // Vuetify date/time components
          if (
            id.includes('VDatePicker')
            || id.includes('VTimePicker')
            || id.includes('VCalendar')
          ) {
            return 'vuetify-datetime'
          }

          // Vuetify form components
          if (
            id.includes('VTextField')
            || id.includes('VSelect')
            || id.includes('VAutocomplete')
            || id.includes('VCombobox')
            || id.includes('VTextarea')
            || id.includes('VCheckbox')
            || id.includes('VRadio')
            || id.includes('VSwitch')
            || id.includes('VSlider')
            || id.includes('VFileInput')
            || id.includes('VForm')
          ) {
            return 'vuetify-forms'
          }

          // Vuetify navigation components
          if (
            id.includes('VAppBar')
            || id.includes('VNavigationDrawer')
            || id.includes('VToolbar')
            || id.includes('VTabs')
            || id.includes('VBreadcrumbs')
            || id.includes('VPagination')
          ) {
            return 'vuetify-navigation'
          }

          // Vuetify feedback components
          if (
            id.includes('VAlert')
            || id.includes('VSnackbar')
            || id.includes('VDialog')
            || id.includes('VBottomSheet')
            || id.includes('VOverlay')
            || id.includes('VProgressLinear')
            || id.includes('VProgressCircular')
          ) {
            return 'vuetify-feedback'
          }

          // Vuetify layout components
          if (
            id.includes('VContainer')
            || id.includes('VRow')
            || id.includes('VCol')
            || id.includes('VGrid')
            || id.includes('VSpacer')
          ) {
            return 'vuetify-layout'
          }

          // Vuetify core utilities
          if (
            id.includes('vuetify/lib/composables')
            || id.includes('vuetify/lib/util')
          ) {
            return 'vuetify-core'
          }

          // Vuetify framework
          if (id.includes('vuetify/lib/framework')) {
            return 'vuetify-framework'
          }

          // Vuetify directives
          if (id.includes('vuetify/lib/directives')) {
            return 'vuetify-directives'
          }

          // Icons
          if (id.includes('@mdi') || id.includes('materialdesignicons')) {
            return 'icons'
          }

          // Vuetify styles
          if (id.includes('vuetify') && /\.(?:css|sass|scss)$/.test(id)) {
            return 'vuetify-styles'
          }
          // Remaining Vuetify components
          if (id.includes('vuetify/lib/components')) {
            return 'vuetify-components'
          }

          // Other vuetify
          if (id.includes('vuetify')) {
            return 'vuetify'
          }
          // Call existing manualChunks
          if (typeof existingManualChunks === 'function') {
            return existingManualChunks(id, context)
          }
        }
      }
      config.build.chunkSizeWarningLimit = 600

      // Minification settings
      config.build.minify = 'esbuild'
      config.build.cssMinify = 'lightningcss'
      config.build.cssCodeSplit = true
    })
    // Transform asset URLs
    if (options.transformAssetUrls) {
      await setupTransformAssetUrls(nuxt)
    }

    // SSR optimizations
    if (options.vuetifyOptions.ssr) {
      nuxt.options.vite.ssr ??= {}
      nuxt.options.vite.ssr.noExternal ??= []
      if (Array.isArray(nuxt.options.vite.ssr.noExternal)) {
        nuxt.options.vite.ssr.noExternal.push('vuetify')
      }
    }

    // Preload
    if (options.preload?.fonts) {
      nuxt.hook('nitro:config', (config) => {
        config.routeRules ??= {}
        config.routeRules['/_nuxt/*.woff2'] = {
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        }
      })
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

  const cssToAdd = typeof styles === 'object' && styles.configFile
    ? styles.configFile
    : styles === 'sass'
      ? 'vuetify/styles/main.sass'
      : 'vuetify/styles'

  // Prevent duplicates
  if (!nuxt.options.css.includes(cssToAdd)) {
    nuxt.options.css.unshift(cssToAdd)
  }
}
/*
* Function - Add icon CSS based on an icon set
*/
function addIconStyles(nuxt: Nuxt, icons?: ModuleOptions['vuetifyOptions']['icons']) {
  const defaultSet = icons?.defaultSet ?? 'mdi'

  const css = getIconCssPath(defaultSet)
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
  styles: true | 'none' | 'sass' | { configFile: string },
  logger: ReturnType<typeof useLogger>,
) {
  try {
    const vuetifyPlugin = await import('vite-plugin-vuetify').then(m => m.default)

    const autoImportConfig = typeof autoImport === 'boolean'
      ? autoImport
      : {
          labs: autoImport.labs ?? false,
          ignore: autoImport.ignore ?? [],
        }

    // vite-plugin-vuetify handles auto-import
    // styles: 'none' means we handle styles ourselves via nuxt.options.css
    addVitePlugin(vuetifyPlugin({
      autoImport: autoImportConfig,
      styles,
    }))
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
