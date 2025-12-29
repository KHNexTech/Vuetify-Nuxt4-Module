# Migration Guide

This guide helps you migrate between major versions of Vuetify Nuxt 4 Module.

---

## Table of Contents

- [Migrating to v2.x](#migrating-to-v2x)
- [Migrating from vuetify-nuxt-module](#migrating-from-vuetify-nuxt-module)
- [Migrating from Manual Vuetify Setup](#migrating-from-manual-vuetify-setup)

---

## Migrating to v2.x

### Breaking Changes

#### 1. Configuration Structure

The configuration structure has been simplified.

**Before (v1.x):**
```typescript
export default defineNuxtConfig({
  vuetify: {
    moduleOptions: {
      themePersistence: true,
      defaultTheme: 'light',
    },
    vuetifyOptions: {
      theme: { ... }
    }
  }
})
```

**After (v2.x):**
```typescript
export default defineNuxtConfig({
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        themes: { ... }
      }
    },
    persistence: {
      enabled: true,
      storage: 'cookie',
    }
  }
})
```

#### 2. Theme Persistence

Theme persistence is now configured separately with more options.

**Before:**
```typescript
vuetify: {
  moduleOptions: {
    themePersistence: true,
  }
}
```

**After:**
```typescript
vuetify: {
  persistence: {
    enabled: true,
    key: 'nuxt-vuetify-theme',
    storage: 'cookie',  // 'cookie' | 'localStorage' | 'sessionStorage'
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    }
  }
}
```

#### 3. Icon Configuration

SVG icon aliases are now configured under `svg.mdi.aliases`.

**Before:**
```typescript
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi-svg',
      aliases: {
        account: mdiAccount,
      }
    }
  }
}
```

**After:**
```typescript
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi-svg',
      svg: {
        mdi: {
          aliases: {
            account: 'mdiAccount',  // String reference to @mdi/js export
          }
        }
      }
    }
  }
}
```

#### 4. i18n Configuration

i18n is now enabled by default and auto-detects `@nuxtjs/i18n`.

**Before:**
```typescript
vuetify: {
  moduleOptions: {
    useVueI18n: true,
  }
}
```

**After:**
```typescript
vuetify: {
  i18n: true,  // Default, can be omitted
  // or
  i18n: {
    useVueI18nAdapter: true,
  }
}
```

### New Features in v2.x

#### 1. SSR-Safe Theme Persistence

Cookie-based persistence now works correctly with SSR:

```typescript
vuetify: {
  persistence: {
    storage: 'cookie',  // Recommended for SSR
  }
}
```

#### 2. Lazy Component Loading

```typescript
vuetify: {
  lazyComponents: {
    components: ['VDataTable', 'VDatePicker'],
    delay: 200,
  }
}
```

#### 3. Hooks System

```typescript
// plugins/vuetify-custom.ts
export default defineNuxtPlugin((nuxtApp) => {
  onVuetifyHook(nuxtApp, 'vuetify:before-create', ({ vuetifyOptions }) => {
    // Modify options
  })
})
```

#### 4. Improved useVuetify Composable

```typescript
const {
  isDark,
  isMobile,
  currentTheme,
  currentBreakpoint,
  toggleTheme,
  setTheme,
  setLocale,
} = useVuetify()
```

---

## Migrating from vuetify-nuxt-module

If you're migrating from the community `vuetify-nuxt-module`, follow these steps:

### 1. Update Dependencies

```bash
# Remove old module
npm uninstall vuetify-nuxt-module

# Install new module
npm install vuetify-nuxt4-module vuetify vite-plugin-vuetify
```

### 2. Update nuxt.config.ts

**Before (vuetify-nuxt-module):**
```typescript
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: './vuetify.config.ts',
    moduleOptions: {
      styles: true,
      autoImport: true,
      ssrClientHints: {
        reloadOnFirstRequest: false,
      }
    }
  }
})
```

**After (vuetify-nuxt4-module):**
```typescript
export default defineNuxtConfig({
  modules: ['vuetify-nuxt4-module'],
  vuetify: {
    vuetifyOptions: {
      // Inline configuration (recommended)
      theme: {
        defaultTheme: 'light',
        themes: { ... }
      }
    },
    // Module options at root level
    styles: true,
    autoImport: true,
    persistence: {
      enabled: true,
      storage: 'cookie',
    }
  }
})
```

### 3. Update External Config File (if used)

If you used an external `vuetify.config.ts`, migrate to inline configuration or use hooks:

```typescript
// plugins/vuetify-config.ts
export default defineNuxtPlugin((nuxtApp) => {
  onVuetifyHook(nuxtApp, 'vuetify:before-create', ({ vuetifyOptions }) => {
    // Apply your custom configuration
    vuetifyOptions.theme = {
      defaultTheme: 'light',
      themes: {
        light: { ... },
        dark: { ... }
      }
    }
  })
})
```

### 4. Key Differences

| Feature | vuetify-nuxt-module | vuetify-nuxt4-module |
|---------|---------------------|----------------------|
| Nuxt Version | Nuxt 3 | Nuxt 4+ |
| External Config | `vuetifyOptions: './file.ts'` | Inline or hooks |
| SSR Client Hints | Built-in | Cookie persistence |
| Icon Fonts | Auto-detected | Explicit configuration |
| Styles | `moduleOptions.styles` | `styles` (root level) |

---

## Migrating from Manual Vuetify Setup

If you have a manual Vuetify setup, here's how to migrate:

### 1. Remove Manual Setup

Remove your manual Vuetify plugin:

```bash
# Delete these files
rm plugins/vuetify.ts
rm plugins/vuetify.client.ts
```

Remove manual CSS imports from `nuxt.config.ts`:

```typescript
// Remove these
css: [
  'vuetify/styles',
  '@mdi/font/css/materialdesignicons.css',
],
```

Remove manual build configuration:

```typescript
// Remove these
build: {
  transpile: ['vuetify'],
},
vite: {
  ssr: {
    noExternal: ['vuetify'],
  },
},
```

### 2. Install the Module

```bash
npm install vuetify-nuxt4-module vite-plugin-vuetify
```

### 3. Configure the Module

**Before (manual setup):**
```typescript
// plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#1976D2',
          }
        }
      }
    }
  })
  nuxtApp.vueApp.use(vuetify)
})
```

**After (module):**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['vuetify-nuxt4-module'],
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            colors: {
              primary: '#1976D2',
            }
          }
        }
      }
    }
  }
})
```

### 4. Benefits of Using the Module

| Manual Setup | Module |
|--------------|--------|
| Manual tree-shaking | Automatic tree-shaking |
| Manual CSS imports | Automatic CSS handling |
| No theme persistence | Built-in persistence |
| Manual SSR config | Automatic SSR optimization |
| No composable auto-imports | Auto-imported composables |

---

## Common Migration Issues

### Issue: Hydration Mismatch After Migration

**Problem:** Theme flickers on page load.

**Solution:** Use cookie persistence:

```typescript
vuetify: {
  persistence: {
    storage: 'cookie',
  }
}
```

### Issue: Icons Not Showing

**Problem:** Icons appear as empty boxes after migration.

**Solution:** Install icon package explicitly:

```bash
npm install @mdi/font
# or for SVG
npm install @mdi/js
```

### Issue: Styles Not Applied

**Problem:** Vuetify components have no styling.

**Solution:** Ensure `styles` is not set to `'none'`:

```typescript
vuetify: {
  styles: true,  // Default
}
```

### Issue: Composables Not Auto-Imported

**Problem:** `useTheme`, `useDisplay` not found.

**Solution:** Ensure `importComposables` is enabled:

```typescript
vuetify: {
  importComposables: true,  // Default
}
```

### Issue: i18n Not Working

**Problem:** Vuetify doesn't use vue-i18n translations.

**Solution:**
1. Install `@nuxtjs/i18n` and `vue-i18n`
2. List `@nuxtjs/i18n` before the vuetify module
3. Add `$vuetify` key in locale files

```typescript
modules: [
  '@nuxtjs/i18n',  // Must be before
  'vuetify-nuxt4-module',
],
```

---

## Need Help?

If you encounter issues during migration:

1. Check the [Troubleshooting](README.md#troubleshooting) section
2. Search [existing issues](https://github.com/KHNexTech/Vuetify-Nuxt4-Module/issues)
3. Open a new issue with your migration details
