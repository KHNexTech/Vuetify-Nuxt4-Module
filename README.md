# Vuetify Nuxt 4 Module

[![npm version](https://img.shields.io/npm/v/vuetify-nuxt4-module.svg)](https://npmjs.com/package/vuetify-nuxt4-module)
[![npm downloads](https://img.shields.io/npm/dm/vuetify-nuxt4-module.svg?style=flat&colorA=020420&colorB=00DC82)](https://npm.chart.dev/vuetify-nuxt4-module)
[![License](https://img.shields.io/npm/l/vuetify-nuxt4-module.svg)](https://npmjs.com/package/vuetify-nuxt4-module)
[![Nuxt](https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js)](https://nuxt.com)

Zero-config Vuetify 3 module for Nuxt 4 with performance optimizations, SSR support, and full TypeScript integration.

- [✨ Release Notes](/CHANGELOG.md)
- [📖 Documentation](#documentation)

## Features

- ⚡ **Auto-import** - Automatic tree-shaking with vite-plugin-vuetify
- 🎨 **Theme Persistence** - SSR-safe cookie/localStorage/sessionStorage support
- 🌍 **i18n Integration** - Seamless @nuxtjs/i18n support with vue-i18n adapter
- 🔧 **Date Adapters** - Support for date-fns, dayjs, luxon, moment
- 🎯 **Icon Sets** – MDI, FontAwesome, Material Design (font & SVG variants)
- 🌐 **Locale Support** – Multiple languages with RTL support
- 🎭 **Blueprints** - Material Design MD1/MD2/MD3 presets
- 🚀 **Performance** – Optimized chunking, tree-shaking, no duplicate CSS
- 🔌 **Hooks** – Extend Vuetify configuration via lifecycle hooks
- 📦 **SSR Ready** – No hydration mismatches

---

## Table of Contents

- [Quick Setup](#quick-setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [i18n Integration](#i18n-integration)
- [Icon Configuration](#icon-configuration)
- [Theme Persistence](#theme-persistence)
- [Date Adapters](#date-adapters)
- [Custom SASS Variables](#custom-sass-variables)
- [Hooks](#hooks)
- [Performance Tips](#performance-tips)
- [TypeScript](#typescript)
- [Troubleshooting](#troubleshooting)
- [Local Development](#local-development)

---

## Quick Setup

### Installation

```bash
# npm
npm install vuetify-nuxt4-module vuetify vite-plugin-vuetify

# pnpm
pnpm add vuetify-nuxt4-module vuetify vite-plugin-vuetify

# yarn
yarn add vuetify-nuxt4-module vuetify vite-plugin-vuetify
```

### Optional Dependencies

```bash
# Icons (choose one)
npm install @mdi/font          # MDI font icons
npm install @mdi/js            # MDI SVG icons (tree-shakeable)

# i18n support
npm install @nuxtjs/i18n vue-i18n

# Date adapters (choose one if needed)
npm install @date-io/date-fns date-fns
npm install @date-io/dayjs dayjs
npm install @date-io/luxon luxon
npm install @date-io/moment moment
```

### Minimal Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['vuetify-nuxt4-module'],
})
```

That's it! Vuetify is now ready to use with sensible defaults.

---

## Configuration

### Full Configuration Example

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',        // Optional: for i18n integration
    'vuetify-nuxt4-module',
  ],

  vuetify: {
    // Vuetify instance options
    vuetifyOptions: {
      ssr: true,
      blueprint: 'md3',           // 'md1' | 'md2' | 'md3'
      dateAdapter: 'vuetify',     // 'vuetify' | 'date-fns' | 'dayjs' | 'luxon' | 'moment'

      icons: {
        defaultSet: 'mdi',        // 'mdi' | 'mdi-svg' | 'fa' | 'fa-svg' | 'md'
        aliases: {
          // Custom aliases for font icons
        },
        svg: {
          mdi: {
            aliases: {
              // Custom aliases for SVG icons (maps to @mdi/js exports)
              account: 'mdiAccount',
              home: 'mdiHome',
            },
          },
        },
      },

      locale: {
        locale: 'en',
        fallback: 'en',
        rtl: {
          ar: true,
          he: true,
        },
      },

      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              primary: '#1976D2',
              secondary: '#424242',
              accent: '#82B1FF',
              error: '#FF5252',
              info: '#2196F3',
              success: '#4CAF50',
              warning: '#FFC107',
              background: '#FFFFFF',
              surface: '#FFFFFF',
            },
          },
          dark: {
            dark: true,
            colors: {
              primary: '#2196F3',
              secondary: '#424242',
              background: '#121212',
              surface: '#212121',
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
          rounded: 'lg',
        },
        VTextField: {
          variant: 'outlined',
          density: 'comfortable',
        },
      },
    },

    // Module options
    importComposables: true,      // Auto-import Vuetify composables
    prefixComposables: false,     // Prefix with 'V': useVTheme, useVDisplay
    transformAssetUrls: true,     // Transform asset URLs in templates
    autoImport: true,             // Auto-import components via vite-plugin-vuetify
    styles: true,                 // true | 'sass' | 'none' | { configFile: string }
    i18n: true,                   // Enable vue-i18n integration

    // Theme persistence
    persistence: {
      enabled: true,
      key: 'nuxt-vuetify-theme',
      storage: 'cookie',          // 'cookie' | 'localStorage' | 'sessionStorage'
      cookieOptions: {
        maxAge: 60 * 60 * 24 * 365,  // 1 year
        path: '/',
        sameSite: 'lax',
      },
    },

    // Lazy loading (optional)
    lazyComponents: false,        // or { components: ['VDataTable'], delay: 200 }

    // Preload options (optional)
    preload: {
      fonts: false,
      criticalCSS: true,
    },
  },
})
```

### Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `vuetifyOptions.ssr` | `boolean` | `true` | Enable SSR support |
| `vuetifyOptions.blueprint` | `'md1' \| 'md2' \| 'md3'` | `'md3'` | Material Design blueprint |
| `vuetifyOptions.dateAdapter` | `string` | `'vuetify'` | Date adapter for date pickers |
| `vuetifyOptions.icons` | `object` | `{ defaultSet: 'mdi' }` | Icon configuration |
| `vuetifyOptions.locale` | `object` | - | Locale and RTL configuration |
| `vuetifyOptions.theme` | `object` | - | Theme configuration |
| `vuetifyOptions.defaults` | `object` | - | Component default props |
| `importComposables` | `boolean` | `true` | Auto-import Vuetify composables |
| `prefixComposables` | `boolean` | `false` | Prefix composables with 'V' |
| `transformAssetUrls` | `boolean` | `true` | Transform asset URLs |
| `autoImport` | `boolean \| object` | `true` | Enable vite-plugin-vuetify |
| `styles` | `true \| 'sass' \| 'none' \| object` | `true` | Style configuration |
| `i18n` | `boolean \| object` | `true` | Enable vue-i18n integration |
| `persistence` | `object` | `{ enabled: true, storage: 'cookie' }` | Theme persistence |
| `lazyComponents` | `boolean \| object` | `false` | Lazy load heavy components |

---

## Usage

### Using the `useVuetify` Composable

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
    <v-app-bar>
      <v-app-bar-title>My App</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'" 
             @click="toggleTheme"></v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <p>Current theme: {{ currentTheme }}</p>
        <p>Breakpoint: {{ currentBreakpoint }}</p>
        <p>Mobile: {{ isMobile }}</p>
      </v-container>
    </v-main>
  </v-app>
</template>
```

### Using Vuetify Composables Directly

The module auto-imports all Vuetify composables:

```vue
<script setup lang="ts">
// These are auto-imported
const theme = useTheme()
const display = useDisplay()
const locale = useLocale()

// Toggle theme
const toggleDark = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>
```

If you have naming conflicts, enable `prefixComposables: true`:

```typescript
// nuxt.config.ts
vuetify: {
  prefixComposables: true,  // useTheme -> useVTheme
}
```

---

## i18n Integration

The module seamlessly integrates with `@nuxtjs/i18n` for Vuetify's locale system.

### Setup

```bash
npm install @nuxtjs/i18n vue-i18n
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
    'vuetify-nuxt4-module',
  ],

  i18n: {
    locales: [
      { code: 'en', file: 'en.js', name: 'English' },
      { code: 'km', file: 'km.json', name: 'ខ្មែរ' },
      { code: 'ar', file: 'ar.json', name: 'العربية', dir: 'rtl' },
    ],
    defaultLocale: 'en',
    langDir: 'locales/',
  },

  vuetify: {
    i18n: true,  // Enable vue-i18n adapter
  },
})
```

### Locale Files

Create locale files with Vuetify translations under `$vuetify` key:

```json
// locales/en.js
{
  "welcome": "Welcome",
  "$vuetify": {
    "badge": "Badge",
    "open": "Open",
    "close": "Close",
    "dataIterator": {
      "noResultsText": "No matching records found",
      "loadingText": "Loading items..."
    },
    "dataTable": {
      "itemsPerPageText": "Rows per page:",
      "ariaLabel": {
        "sortDescending": "Sorted descending.",
        "sortAscending": "Sorted ascending.",
        "sortNone": "Not sorted."
      }
    },
    "pagination": {
      "ariaLabel": {
        "root": "Pagination Navigation",
        "next": "Next page",
        "previous": "Previous page",
        "page": "Go to page {0}",
        "currentPage": "Page {0}, Current page"
      }
    }
  }
}
```

```json
// locales/km.json
{
  "welcome": "សូមស្វាគមន៍",
  "$vuetify": {
    "badge": "ផ្លាកសញ្ញា",
    "open": "បើក",
    "close": "បិទ",
    "dataIterator": {
      "noResultsText": "រកមិនឃើញទិន្នន័យ",
      "loadingText": "កំពុងផ្ទុក..."
    },
    "dataTable": {
      "itemsPerPageText": "ជួរក្នុងមួយទំព័រ:"
    }
  }
}
```

### Switching Locales

```vue
<script setup lang="ts">
const { locale, setLocale } = useI18n()

const switchLocale = (code: string) => {
  setLocale(code)
  // Vuetify locale updates automatically via the adapter
}
</script>

<template>
  <v-btn-toggle v-model="locale">
    <v-btn value="en">EN</v-btn>
    <v-btn value="km">KM</v-btn>
    <v-btn value="ar">AR</v-btn>
  </v-btn-toggle>
</template>
```

---

## Icon Configuration

### Font Icons (MDI)

```bash
npm install @mdi/font
```

```typescript
// nuxt.config.ts
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi',
    },
  },
}
```

```vue
<template>
  <v-icon icon="mdi-home" />
  <v-icon>mdi-account</v-icon>
  <v-btn icon="mdi-menu" />
</template>
```

### SVG Icons (MDI-SVG) - Recommended for Performance

```bash
npm install @mdi/js
```

```typescript
// nuxt.config.ts
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi-svg',
      svg: {
        mdi: {
          aliases: {
            // Map alias names to @mdi/js export names
            account: 'mdiAccount',
            home: 'mdiHome',
            menu: 'mdiMenu',
            settings: 'mdiCog',
            search: 'mdiMagnify',
          },
        },
      },
    },
  },
}
```

Usage in templates:

```vue
<script setup lang="ts">
// Direct import for icons not in aliases
import { mdiHeart, mdiStar } from '@mdi/js'
</script>

<template>
  <!-- Using aliases (resolved at build time) -->
  <v-icon icon="$account" />
  <v-icon icon="$home" />

  <!-- Using direct imports -->
  <v-icon :icon="mdiHeart" />
  <v-icon :icon="mdiStar" />
</template>
```

### FontAwesome Icons

```bash
npm install @fortawesome/fontawesome-free
```

```typescript
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'fa',  // or 'fa-svg' for SVG version
    },
  },
}
```

---

## Theme Persistence

The module provides SSR-safe theme persistence using cookies (recommended) or client-side storage.

### Cookie Storage (SSR-Safe) - Recommended

```typescript
vuetify: {
  persistence: {
    enabled: true,
    storage: 'cookie',
    key: 'nuxt-vuetify-theme',
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 365,  // 1 year
      path: '/',
      sameSite: 'lax',
    },
  },
}
```

This prevents hydration mismatches because:
1. Server reads theme from cookie in request headers
2. Client reads theme from `document.cookie`
3. Both render with the same theme

### LocalStorage (Client-Only)

```typescript
vuetify: {
  persistence: {
    enabled: true,
    storage: 'localStorage',
    key: 'my-app-theme',
  },
}
```

> ⚠️ **Note:** LocalStorage may cause hydration mismatches on first load since the server doesn't have access to localStorage.

### Disable Persistence

```typescript
vuetify: {
  persistence: {
    enabled: false,
  },
}
```

---

## Date Adapters

### Using date-fns

```bash
npm install @date-io/date-fns date-fns
```

```typescript
vuetify: {
  vuetifyOptions: {
    dateAdapter: 'date-fns',
  },
}
```

### Using dayjs

```bash
npm install @date-io/dayjs dayjs
```

```typescript
vuetify: {
  vuetifyOptions: {
    dateAdapter: 'dayjs',
  },
}
```

### Using luxon

```bash
npm install @date-io/luxon luxon
```

```typescript
vuetify: {
  vuetifyOptions: {
    dateAdapter: 'luxon',
  },
}
```

---

## Custom SASS Variables

### Setup

1. Create a settings file:

```scss
// assets/vuetify-settings.scss
@use 'vuetify/settings' with (
  $body-font-family: 'Inter, sans-serif',
  $border-radius-root: 8px,
  $button-height: 44px,
  $card-border-radius: 12px,
);
```

2. Configure in nuxt.config.ts:

```typescript
vuetify: {
  styles: {
    configFile: 'assets/vuetify-settings.scss',
  },
}
```

3. **Important for SSR:** Disable inline SSR styles:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  experimental: {
    inlineSSRStyles: false,
  },
  vuetify: {
    styles: {
      configFile: 'assets/vuetify-settings.scss',
    },
  },
})
```

---

## Hooks

Use hooks to customize Vuetify at different lifecycle stages.

### Available Hooks

| Hook | Payload | Description |
|------|---------|-------------|
| `vuetify:before-create` | `{ vuetifyOptions }` | Modify options before Vuetify is created |
| `vuetify:configuration` | `{ vuetifyOptions }` | After configuration is applied |
| `vuetify:ready` | `vuetify` | When Vuetify instance is ready |

### Example: Custom Plugin

```typescript
// plugins/vuetify-custom.ts
export default defineNuxtPlugin((nuxtApp) => {
  // Modify options before Vuetify is created
  onVuetifyHook(nuxtApp, 'vuetify:before-create', ({ vuetifyOptions }) => {
    // Add custom defaults
    vuetifyOptions.defaults = {
      ...vuetifyOptions.defaults,
      VAlert: {
        variant: 'tonal',
        rounded: 'lg',
      },
      VChip: {
        rounded: 'pill',
      },
    }

    // Add custom theme
    if (vuetifyOptions.theme?.themes) {
      vuetifyOptions.theme.themes.corporate = {
        dark: false,
        colors: {
          primary: '#0066CC',
          secondary: '#6C757D',
        },
      }
    }
  })

  // Access Vuetify instance when ready
  onVuetifyHook(nuxtApp, 'vuetify:ready', (vuetify) => {
    console.log('Current theme:', vuetify.theme.global.name.value)
  })
})
```

---

## Performance Tips

### 1. Use SVG Icons (Tree-Shakeable)

```typescript
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi-svg',
    },
  },
}
```

### 2. Enable Labs Components Only When Needed

```typescript
vuetify: {
  autoImport: {
    labs: true,  // Only if using lab components
  },
}
```

### 3. Lazy Load Heavy Components

```vue
<script setup>
const VDataTable = defineAsyncComponent(() =>
  import('vuetify/components/VDataTable').then(m => m.VDataTable)
)
</script>
```

Or use the built-in lazy loading:

```typescript
vuetify: {
  lazyComponents: {
    components: ['VDataTable', 'VDatePicker', 'VCalendar'],
    delay: 200,
  },
}
```

### 4. Enable Compression

```typescript
// nuxt.config.ts
nitro: {
  compressPublicAssets: true,
}
```

### 5. Analyze Bundle Size

```bash
npm run analyze
```

---

## TypeScript

The module provides full TypeScript support with auto-generated types.

### Type Augmentation

```typescript
// types/node.d.ts
declare module 'vuetify' {
  interface ThemeDefinition {
    // Add custom theme properties
  }
}
```

### Typed Composable

```typescript
const { isDark, toggleTheme } = useVuetify()
// isDark: ComputedRef<boolean>
// toggleTheme: () => void
```

---

## Troubleshooting

### Hydration Mismatch with Theme

**Problem:** Server renders light theme, client shows dark theme briefly.

**Solution:** Use cookie storage (default):

```typescript
vuetify: {
  persistence: {
    storage: 'cookie',  // Not 'localStorage'
  },
}
```

### Duplicate CSS Loading

**Problem:** Vuetify CSS is loaded twice.

**Solution:** The module handles this automatically. Make sure you don't manually import Vuetify styles in your nuxt.config.ts:

```typescript
// ❌ Don't do this
css: ['vuetify/styles'],

// ✅ Let the module handle it
vuetify: {
  styles: true,
}
```

### i18n Not Working

**Problem:** Vuetify doesn't use vue-i18n translations.

**Solution:**
1. Ensure `@nuxtjs/i18n` is listed **before** `vuetify-nuxt4-module` in modules
2. Add translations under `$vuetify` key in locale files

### Icons Not Showing

**Problem:** Icons appear as empty boxes.

**Solution:** Install the icon package:

```bash
# For font icons
npm install @mdi/font

# For SVG icons
npm install @mdi/js
```

---

## Local Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with playground
npm run dev

# Build playground
npm run dev:build

# Run linter
npm run lint

# Run tests
npm run test
npm run test:watch

# Type check
npm run test:types

# Analyze bundle
npm run analyze

# Release new version
npm run release
```

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a Pull Request.

---

## License

[MIT License](LICENSE)

---

## Credits

- [Vuetify](https://vuetifyjs.com/) - The Vue UI Library
- [Nuxt](https://nuxt.com/) - The Intuitive Vue Framework
- [@nuxtjs/i18n](https://i18n.nuxtjs.org/) - Internationalization for Nuxt
