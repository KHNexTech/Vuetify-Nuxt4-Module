# Vuetify Nuxt 4 Module

[![npm version](https://img.shields.io/npm/v/vuetify-nuxt4-module.svg)](https://npmjs.com/package/vuetify-nuxt4-module)
[![npm downloads](https://img.shields.io/npm/dm/vuetify-nuxt4-module.svg?style=flat&colorA=020420&colorB=00DC82)](https://npm.chart.dev/vuetify-nuxt4-module)
[![License](https://img.shields.io/npm/l/vuetify-nuxt4-module.svg)](https://npmjs.com/package/vuetify-nuxt4-module)
[![CI](https://github.com/KHNexTech/Vuetify-Nuxt4-Module/actions/workflows/ci.yml/badge.svg)](https://github.com/KHNexTech/Vuetify-Nuxt4-Module/actions/workflows/ci.yml)
[![Nuxt](https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js)](https://nuxt.com)

Zero-config Vuetify 3 module for Nuxt 4 with performance optimizations.

- [✨ Release Notes](/CHANGELOG.md)

## Features

- ⚡ **Auto-import** - Automatic tree-shaking with vite-plugin-vuetify
- 🎨 **Theme Persistence** - Cookie/localStorage/sessionStorage support
- 🔧 **Date Adapters** - Support for date-fns, dayjs, luxon, moment
- 🎯 **Icon Sets** – MDI, FontAwesome, and SVG variants
- 🌍 **Locale Support** – Multiple languages with RTL support
- 🎭 **Blueprints** - Material Design MD1/MD2/MD3 presets
- 🚀 **Performance** – Optimized chunking and tree-shaking
- 🔌 **Hooks** – Extend Vuetify configuration via hooks

## Quick Setup

Install the module:
```bash
# npm
npm install vuetify-nuxt4-module vuetify vite-plugin-vuetify

# pnpm
pnpm add vuetify-nuxt4-module vuetify vite-plugin-vuetify

# yarn
yarn add vuetify-nuxt4-module vuetify vite-plugin-vuetify
```

Add to your `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  modules: ['vuetify-nuxt4-module'],

  vuetify: {
    moduleOptions: {
      themePersistence: true,
      defaultTheme: 'light',
    },

    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              primary: '#1976D2',
              secondary: '#424242',
              background: '#FFFFFF',
            },
          },
          dark: {
            dark: true,
            colors: {
              primary: '#2196F3',
              background: '#121212',
            },
          },
        },
      },
    },
  },
})

```

## Configuration

### Full Example
```typescript
export default defineNuxtConfig({
  modules: ['vuetify-nuxt4-module'],

  vuetify: {
    vuetifyOptions: {
      ssr: true,
      blueprint: 'md3', // 'md1' | 'md2' | 'md3'
      dateAdapter: 'vuetify', // 'vuetify' | 'date-fns' | 'dayjs' | 'luxon' | 'moment'

      icons: {
        defaultSet: 'mdi', // 'mdi' | 'mdi-svg' | 'fa' | 'fa-svg'
        aliases: {
          // Custom icon aliases
        },
      },

      locale: {
        locale: 'en',
        fallback: 'en',
        rtl: {
          ar: true,
        },
      },

      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            colors: {
              primary: '#6200EE',
              secondary: '#03DAC6',
            },
          },
          dark: {
            colors: {
              primary: '#BB86FC',
              secondary: '#03DAC6',
            },
          },
        },
      },

      defaults: {
        VBtn: {
          variant: 'elevated',
          rounded: 'lg',
        },
        VCard: {
          elevation: 4,
        },
      },
    },

    // Module options
    importComposables: true,
    prefixComposables: false, // Set true to prefix: useVTheme, useVDisplay, etc.
    transformAssetUrls: true,
    autoImport: true, // or { labs: true, ignore: [] }
    styles: true, // true | 'sass' | 'none' | { configFile: 'path/to/settings.scss' }

    persistence: {
      enabled: true,
      key: 'nuxt-vuetify-theme',
      storage: 'cookie', // 'cookie' | 'localStorage' | 'sessionStorage'
      cookieOptions: {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        sameSite: 'lax',
      },
    },
  },
})
```

### Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `vuetifyOptions.ssr` | `boolean` | `true` | Enable SSR support |
| `vuetifyOptions.blueprint` | `'md1' \| 'md2' \| 'md3'` | `'md3'` | Material Design blueprint |
| `vuetifyOptions.dateAdapter` | `string` | `'vuetify'` | Date adapter to use |
| `vuetifyOptions.icons` | `object` | `{ defaultSet: 'mdi' }` | Icon configuration |
| `vuetifyOptions.locale` | `object` | - | Locale configuration |
| `vuetifyOptions.theme` | `object` | - | Theme configuration |
| `vuetifyOptions.defaults` | `object` | - | Component defaults |
| `importComposables` | `boolean` | `true` | Auto-import Vuetify composables |
| `prefixComposables` | `boolean` | `false` | Prefix composables with 'V' |
| `transformAssetUrls` | `boolean` | `true` | Transform asset URLs in templates |
| `autoImport` | `boolean \| object` | `true` | Enable auto-import via vite-plugin-vuetify |
| `styles` | `boolean \| string \| object` | `true` | Style configuration |
| `persistence` | `object` | `{ enabled: true, ... }` | Theme persistence |

## Usage

### Using the Composable
```vue
<script setup lang="ts">
const {
  isDark,
  isMobile,
  currentTheme,
  currentBreakpoint,
  toggleTheme,
  setTheme,
  setLocale,
} = useVuetify()
</script>

<template>
  <v-app>
    <v-btn @click="toggleTheme">
      {{ isDark ? 'Light' : 'Dark' }} Mode
    </v-btn>
  </v-app>
</template>
```

### Using Hooks

Create a plugin to hook into Vuetify lifecycle:
```typescript
// plugins/vuetify-custom.ts
export default defineNuxtPlugin((nuxtApp) => {
  // Modify options before Vuetify is created
  onVuetifyHook(nuxtApp, 'vuetify:before-create', ({ vuetifyOptions }) => {
    vuetifyOptions.defaults = {
      ...vuetifyOptions.defaults,
      VAlert: {
        variant: 'tonal',
      },
    }
  })

  // Access Vuetify instance when ready
  onVuetifyHook(nuxtApp, 'vuetify:ready', (vuetify) => {
    console.log('Vuetify ready:', vuetify.theme.global.name.value)
  })
})
```

### Available Hooks

| Hook | Payload | Description |
|------|---------|-------------|
| `vuetify:before-create` | `{ vuetifyOptions }` | Modify options before Vuetify is created |
| `vuetify:configuration` | `{ vuetifyOptions }` | After configuration is applied |
| `vuetify:ready` | `vuetify` | When Vuetify instance is ready |

## Date Adapters

To use a date adapter other than the built-in one, install the required packages:
```bash
# date-fns
npm install @date-io/date-fns date-fns

# dayjs
npm install @date-io/dayjs dayjs

# luxon
npm install @date-io/luxon luxon

# moment
npm install @date-io/moment moment
```

Then configure:
```typescript
vuetify: {
  vuetifyOptions: {
    dateAdapter: 'date-fns'
  }
}
```

## Custom SASS Variables

To customize Vuetify's SASS variables:

1. Create a settings file:
```scss
// assets/settings.scss
@use 'vuetify/settings' with (
  $body-font-family: 'Inter',
  $border-radius-root: 8px,
  $button-height: 44px,
);
```

2. Configure in nuxt.config.ts:
```typescript
vuetify: {
  styles: {
    configFile: 'assets/settings.scss'
  }
}
```

> **Note:** When using a custom config file with SSR, disable inline SSR styles:
> ```typescript
> experimental: {
>   inlineSSRStyles: false
> }
> ```

## Performance Tips

### 1. Use SVG Icons for Better Performance
```typescript
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi-svg' // SVG icons are tree-shaken
    }
  }
}
```

### 2. Import Only Needed Icons (with mdi-svg)
```typescript
// plugins/vuetify-icons.ts
import { mdiAccount, mdiHome, mdiMenu } from '@mdi/js'

export default defineNuxtPlugin((nuxtApp) => {
  onVuetifyHook(nuxtApp, 'vuetify:before-create', ({ vuetifyOptions }) => {
    vuetifyOptions.icons = {
      defaultSet: 'mdi-svg',
      aliases: {
        account: mdiAccount,
        home: mdiHome,
        menu: mdiMenu,
      },
    }
  })
})
```

### 3. Lazy Load Heavy Components
```vue
<script setup>
// Lazy load data tables, calendars, etc.
const VDataTable = defineAsyncComponent(() =>
  import('vuetify/components/VDataTable').then(m => m.VDataTable)
)
</script>
```

### 4. Use CSS Instead of JS for Themes
```typescript
// nuxt.config.ts
vuetify: {
  styles: {
    configFile: 'assets/vuetify.scss'
  }
}
```

### 5. Enable Compression
```typescript
// nuxt.config.ts
nitro: {
  compressPublicAssets: true
}
```

## TypeScript

The module provides full TypeScript support. Types are automatically generated.

## Local Development
```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

## License

[MIT License](LICENSE)
