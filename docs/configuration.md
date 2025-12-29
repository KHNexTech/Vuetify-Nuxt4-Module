# Configuration Guide

Complete reference for all configuration options in Vuetify Nuxt 4 Module.

---

## Table of Contents

- [Basic Configuration](#basic-configuration)
- [Vuetify Options](#vuetify-options)
- [Module Options](#module-options)
- [Theme Configuration](#theme-configuration)
- [Icon Configuration](#icon-configuration)
- [Locale Configuration](#locale-configuration)
- [Persistence Configuration](#persistence-configuration)
- [Style Configuration](#style-configuration)
- [Auto-Import Configuration](#auto-import-configuration)
- [Environment-Specific Configuration](#environment-specific-configuration)

---

## Basic Configuration

### Minimal Setup

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['vuetify-nuxt4-module'],
})
```

### With Custom Options

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['vuetify-nuxt4-module'],
  
  vuetify: {
    vuetifyOptions: {
      // Vuetify instance options
    },
    // Module options
  },
})
```

---

## Vuetify Options

Options passed directly to `createVuetify()`.

### `vuetifyOptions.ssr`

Enable/disable SSR support.

```typescript
vuetify: {
  vuetifyOptions: {
    ssr: true,  // Default: true
  }
}
```

### `vuetifyOptions.blueprint`

Material Design blueprint preset.

```typescript
vuetify: {
  vuetifyOptions: {
    blueprint: 'md3',  // 'md1' | 'md2' | 'md3'
  }
}
```

| Blueprint | Description |
|-----------|-------------|
| `md1` | Material Design 1 (classic) |
| `md2` | Material Design 2 |
| `md3` | Material Design 3 (default, modern) |

### `vuetifyOptions.dateAdapter`

Date adapter for date pickers.

```typescript
vuetify: {
  vuetifyOptions: {
    dateAdapter: 'vuetify',  // Default
  }
}
```

| Adapter | Package Required |
|---------|------------------|
| `vuetify` | None (built-in) |
| `date-fns` | `@date-io/date-fns`, `date-fns` |
| `dayjs` | `@date-io/dayjs`, `dayjs` |
| `luxon` | `@date-io/luxon`, `luxon` |
| `moment` | `@date-io/moment`, `moment` |

### `vuetifyOptions.defaults`

Default props for Vuetify components.

```typescript
vuetify: {
  vuetifyOptions: {
    defaults: {
      // Global defaults
      global: {
        ripple: true,
      },
      
      // Per-component defaults
      VBtn: {
        variant: 'elevated',
        rounded: 'lg',
        color: 'primary',
      },
      VCard: {
        elevation: 4,
        rounded: 'lg',
      },
      VTextField: {
        variant: 'outlined',
        density: 'comfortable',
        hideDetails: 'auto',
      },
      VSelect: {
        variant: 'outlined',
        density: 'comfortable',
      },
      VSwitch: {
        color: 'primary',
        inset: true,
      },
      VChip: {
        rounded: 'pill',
      },
      VAlert: {
        variant: 'tonal',
        rounded: 'lg',
      },
    }
  }
}
```

### `vuetifyOptions.aliases`

Component aliases.

```typescript
vuetify: {
  vuetifyOptions: {
    aliases: {
      MyButton: 'VBtn',
      MyCard: 'VCard',
    }
  }
}
```

Usage:
```vue
<template>
  <MyButton>Click me</MyButton>
  <MyCard>Content</MyCard>
</template>
```

---

## Module Options

Options specific to the Nuxt module.

### `importComposables`

Auto-import Vuetify composables.

```typescript
vuetify: {
  importComposables: true,  // Default: true
}
```

Auto-imported composables:
- `useTheme`
- `useDisplay`
- `useLocale`
- `useLayout`
- `useRtl`
- `useDefaults`
- `useDate`
- `useGoTo`

### `prefixComposables`

Prefix composables with 'V' to avoid naming conflicts.

```typescript
vuetify: {
  prefixComposables: true,  // Default: false
}
```

| Original | Prefixed |
|----------|----------|
| `useTheme` | `useVTheme` |
| `useDisplay` | `useVDisplay` |
| `useLocale` | `useVLocale` |

### `transformAssetUrls`

Transform asset URLs in Vuetify component templates.

```typescript
vuetify: {
  transformAssetUrls: true,  // Default: true
}
```

Enables using relative paths:
```vue
<v-img src="~/assets/image.png" />
<v-card image="~/assets/card-bg.jpg" />
```

### `lazyComponents`

Lazy load heavy Vuetify components.

```typescript
vuetify: {
  lazyComponents: false,  // Default: false
  
  // Or with options
  lazyComponents: {
    components: [
      'VDataTable',
      'VDataTableServer',
      'VDataTableVirtual',
      'VCalendar',
      'VDatePicker',
      'VTimePicker',
      'VColorPicker',
      'VVirtualScroll',
      'VInfiniteScroll',
      'VSparkline',
    ],
    delay: 200,  // ms before showing loading state
  }
}
```

### `preload`

Preload critical assets.

```typescript
vuetify: {
  preload: {
    fonts: false,       // Preload font files
    criticalCSS: true,  // Inline critical CSS
  }
}
```

---

## Theme Configuration

### Basic Theme

```typescript
vuetify: {
  vuetifyOptions: {
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#1976D2',
            secondary: '#424242',
          }
        }
      }
    }
  }
}
```

### Full Theme Configuration

```typescript
vuetify: {
  vuetifyOptions: {
    theme: {
      defaultTheme: 'light',
      
      // Theme variations
      variations: {
        colors: ['primary', 'secondary'],
        lighten: 5,
        darken: 5,
      },
      
      themes: {
        light: {
          dark: false,
          colors: {
            // Brand colors
            primary: '#1976D2',
            'primary-darken-1': '#1565C0',
            secondary: '#424242',
            'secondary-darken-1': '#212121',
            
            // Semantic colors
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
            
            // Surface colors
            background: '#FFFFFF',
            surface: '#FFFFFF',
            'surface-bright': '#FFFFFF',
            'surface-light': '#EEEEEE',
            'surface-variant': '#424242',
            
            // Text colors
            'on-background': '#000000',
            'on-surface': '#000000',
            'on-primary': '#FFFFFF',
            'on-secondary': '#FFFFFF',
          },
          variables: {
            'border-color': '#000000',
            'border-opacity': 0.12,
            'high-emphasis-opacity': 0.87,
            'medium-emphasis-opacity': 0.60,
            'disabled-opacity': 0.38,
            'idle-opacity': 0.04,
            'hover-opacity': 0.04,
            'focus-opacity': 0.12,
            'selected-opacity': 0.08,
            'activated-opacity': 0.12,
            'pressed-opacity': 0.12,
            'dragged-opacity': 0.08,
            'theme-kbd': '#212529',
            'theme-on-kbd': '#FFFFFF',
            'theme-code': '#F5F5F5',
            'theme-on-code': '#000000',
          }
        },
        
        dark: {
          dark: true,
          colors: {
            primary: '#2196F3',
            'primary-darken-1': '#1E88E5',
            secondary: '#424242',
            
            background: '#121212',
            surface: '#212121',
            'surface-bright': '#ccbfd6',
            'surface-light': '#424242',
            'surface-variant': '#a3a3a3',
            
            error: '#CF6679',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FB8C00',
            
            'on-background': '#FFFFFF',
            'on-surface': '#FFFFFF',
            'on-primary': '#FFFFFF',
            'on-secondary': '#FFFFFF',
          }
        },
        
        // Custom themes
        corporate: {
          dark: false,
          colors: {
            primary: '#0066CC',
            secondary: '#6C757D',
            background: '#F8F9FA',
          }
        }
      }
    }
  }
}
```

---

## Icon Configuration

### Font Icons (MDI)

```typescript
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi',
      aliases: {
        // Override default aliases
        close: 'mdi-close-circle',
      }
    }
  }
}
```

### SVG Icons (MDI-SVG)

```typescript
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi-svg',
      svg: {
        mdi: {
          aliases: {
            // Map to @mdi/js export names
            account: 'mdiAccount',
            home: 'mdiHome',
            menu: 'mdiMenu',
            close: 'mdiClose',
            settings: 'mdiCog',
            search: 'mdiMagnify',
            edit: 'mdiPencil',
            delete: 'mdiDelete',
            save: 'mdiContentSave',
            cancel: 'mdiCancel',
          }
        }
      }
    }
  }
}
```

### FontAwesome

```typescript
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'fa',  // or 'fa-svg'
    }
  }
}
```

### Material Design Icons (Google)

```typescript
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'md',
    }
  }
}
```

---

## Locale Configuration

### Basic Locale

```typescript
vuetify: {
  vuetifyOptions: {
    locale: {
      locale: 'en',
      fallback: 'en',
    }
  }
}
```

### With RTL Support

```typescript
vuetify: {
  vuetifyOptions: {
    locale: {
      locale: 'en',
      fallback: 'en',
      rtl: {
        ar: true,    // Arabic
        he: true,    // Hebrew
        fa: true,    // Persian
        ur: true,    // Urdu
      }
    }
  }
}
```

### With Custom Messages

```typescript
vuetify: {
  vuetifyOptions: {
    locale: {
      locale: 'en',
      messages: {
        en: {
          badge: 'Badge',
          open: 'Open',
          close: 'Close',
          dataIterator: {
            noResultsText: 'No matching records found',
          },
          dataTable: {
            itemsPerPageText: 'Rows per page:',
          },
        },
        km: {
          badge: 'ផ្លាកសញ្ញា',
          open: 'បើក',
          close: 'បិទ',
        }
      }
    }
  }
}
```

---

## Persistence Configuration

### Cookie Storage (Recommended for SSR)

```typescript
vuetify: {
  persistence: {
    enabled: true,
    key: 'nuxt-vuetify-theme',
    storage: 'cookie',
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 365,  // 1 year in seconds
      path: '/',
      sameSite: 'lax',  // 'strict' | 'lax' | 'none'
    }
  }
}
```

### LocalStorage

```typescript
vuetify: {
  persistence: {
    enabled: true,
    key: 'my-app-theme',
    storage: 'localStorage',
  }
}
```

### SessionStorage

```typescript
vuetify: {
  persistence: {
    enabled: true,
    storage: 'sessionStorage',
  }
}
```

### Disabled

```typescript
vuetify: {
  persistence: {
    enabled: false,
  }
}
```

---

## Style Configuration

### Default (Precompiled CSS)

```typescript
vuetify: {
  styles: true,  // Default
}
```

### SASS Source Files

```typescript
vuetify: {
  styles: 'sass',
}
```

### Custom SASS Config

```typescript
vuetify: {
  styles: {
    configFile: 'assets/vuetify-settings.scss',
  }
}
```

```scss
// assets/vuetify-settings.scss
@use 'vuetify/settings' with (
  $body-font-family: 'Inter, sans-serif',
  $border-radius-root: 8px,
  $button-height: 44px,
);
```

### No Styles (Manual Import)

```typescript
vuetify: {
  styles: 'none',
}

// Then manually import in your CSS
css: ['~/assets/custom-vuetify.scss'],
```

---

## Auto-Import Configuration

### Default (Enabled)

```typescript
vuetify: {
  autoImport: true,  // Default
}
```

### With Labs Components

```typescript
vuetify: {
  autoImport: {
    labs: true,
  }
}
```

### Ignore Specific Components

```typescript
vuetify: {
  autoImport: {
    labs: false,
    ignore: [
      'VDataTable',  // Don't auto-import VDataTable
      'Ripple',      // Don't auto-import Ripple directive
    ]
  }
}
```

### Disabled

```typescript
vuetify: {
  autoImport: false,
}

// Then manually import components
import { VBtn, VCard } from 'vuetify/components'
import { Ripple } from 'vuetify/directives'
```

---

## Environment-Specific Configuration

### Development vs Production

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['vuetify-nuxt4-module'],
  
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: process.env.NODE_ENV === 'development' ? 'light' : 'dark',
      }
    }
  }
})
```

### Using Runtime Config

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      defaultTheme: 'light',
    }
  },
  
  modules: ['vuetify-nuxt4-module'],
})
```

```typescript
// plugins/vuetify-config.ts
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  onVuetifyHook(nuxtApp, 'vuetify:before-create', ({ vuetifyOptions }) => {
    vuetifyOptions.theme = {
      defaultTheme: config.public.defaultTheme,
    }
  })
})
```

---

## TypeScript Configuration

### Type Checking

The module provides full TypeScript support. Types are auto-generated in `.nuxt/types/`.

### Extending Types

```typescript
// types/vuetify.d.ts
import 'vuetify'

declare module 'vuetify' {
  interface ThemeDefinition {
    // Add custom theme properties
  }
}
```

---

## Full Example

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
    'vuetify-nuxt4-module',
  ],

  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'km', file: 'km.json' },
    ],
    defaultLocale: 'en',
    langDir: 'locales/',
  },

  vuetify: {
    vuetifyOptions: {
      ssr: true,
      blueprint: 'md3',
      dateAdapter: 'date-fns',
      
      icons: {
        defaultSet: 'mdi-svg',
        svg: {
          mdi: {
            aliases: {
              account: 'mdiAccount',
              home: 'mdiHome',
            }
          }
        }
      },
      
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            colors: {
              primary: '#1976D2',
              secondary: '#424242',
            }
          },
          dark: {
            colors: {
              primary: '#2196F3',
              secondary: '#616161',
            }
          }
        }
      },
      
      defaults: {
        VBtn: { variant: 'elevated' },
        VCard: { elevation: 4 },
      }
    },
    
    importComposables: true,
    prefixComposables: false,
    transformAssetUrls: true,
    autoImport: { labs: true },
    styles: true,
    i18n: true,
    
    persistence: {
      enabled: true,
      storage: 'cookie',
      key: 'my-app-theme',
      cookieOptions: {
        maxAge: 31536000,
        path: '/',
        sameSite: 'lax',
      }
    },
    
    lazyComponents: {
      components: ['VDataTable', 'VDatePicker'],
      delay: 200,
    },
    
    preload: {
      fonts: true,
      criticalCSS: true,
    }
  },
})
```
