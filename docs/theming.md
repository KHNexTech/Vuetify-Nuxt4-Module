# Theming Guide

Complete guide for configuring themes and theme persistence in Vuetify Nuxt 4 Module.

---

## Table of Contents

- [Overview](#overview)
- [Basic Theme Configuration](#basic-theme-configuration)
- [Theme Colors](#theme-colors)
- [Multiple Themes](#multiple-themes)
- [Theme Persistence](#theme-persistence)
- [Dynamic Theme Switching](#dynamic-theme-switching)
- [Dark Mode](#dark-mode)
- [Best Practices](#best-practices)

---

## Overview

Vuetify provides a powerful theming system that supports:

- Light and dark themes
- Custom color palettes
- CSS variable-based styling
- Theme persistence across sessions
- SSR-safe theme loading

---

## Basic Theme Configuration

```typescript
// nuxt.config.ts
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
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
            background: '#FFFFFF',
            surface: '#FFFFFF',
          }
        },
        dark: {
          dark: true,
          colors: {
            primary: '#2196F3',
            secondary: '#424242',
            background: '#121212',
            surface: '#212121',
          }
        }
      }
    }
  }
}
```

---

## Theme Colors

| Color | Description |
|-------|-------------|
| `primary` | Primary brand color |
| `secondary` | Secondary brand color |
| `accent` | Accent color |
| `error` | Error states |
| `info` | Information |
| `success` | Success states |
| `warning` | Warning states |
| `background` | Page background |
| `surface` | Component background |

---

## Multiple Themes

```typescript
vuetify: {
  vuetifyOptions: {
    theme: {
      defaultTheme: 'light',
      themes: {
        light: { /* ... */ },
        dark: { /* ... */ },
        corporate: {
          dark: false,
          colors: {
            primary: '#0066CC',
            secondary: '#6C757D',
          }
        },
        nature: {
          dark: false,
          colors: {
            primary: '#2E7D32',
            secondary: '#558B2F',
          }
        }
      }
    }
  }
}
```

---

## Theme Persistence

### Cookie Storage (Recommended for SSR)

```typescript
vuetify: {
  persistence: {
    enabled: true,
    storage: 'cookie',
    key: 'nuxt-vuetify-theme',
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    }
  }
}
```

### LocalStorage

```typescript
vuetify: {
  persistence: {
    enabled: true,
    storage: 'localStorage',
    key: 'my-app-theme',
  }
}
```

---

## Dynamic Theme Switching

```vue
<script setup lang="ts">
const { isDark, currentTheme, toggleTheme, setTheme } = useVuetify()
</script>

<template>
  <v-btn 
    :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'"
    @click="toggleTheme"
  />
</template>
```

---

## Dark Mode

### Using useTheme

```vue
<script setup lang="ts">
const theme = useTheme()

const isDark = computed(() => theme.global.current.value.dark)

const toggleTheme = () => {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}
</script>
```

---

## Best Practices

1. **Use Cookie Persistence for SSR** - Prevents hydration mismatch
2. **Define Both Light and Dark** - Provide good experience for all users
3. **Test Accessibility** - Ensure sufficient color contrast
4. **Use Semantic Colors** - primary, error, success instead of blue, red, green
