# Icon Configuration Guide

Complete guide for configuring icons in Vuetify Nuxt 4 Module.

---

## Table of Contents

- [Overview](#overview)
- [Icon Sets](#icon-sets)
- [MDI Font Icons](#mdi-font-icons)
- [MDI SVG Icons](#mdi-svg-icons)
- [FontAwesome Icons](#fontawesome-icons)
- [Material Design Icons (Google)](#material-design-icons-google)
- [Custom Icons](#custom-icons)
- [Icon Aliases](#icon-aliases)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

---

## Overview

Vuetify supports multiple icon sets:

| Icon Set | Type | Tree-Shakeable | Package |
|----------|------|----------------|---------|
| `mdi` | Font | ❌ | `@mdi/font` |
| `mdi-svg` | SVG | ✅ | `@mdi/js` |
| `fa` | Font | ❌ | `@fortawesome/fontawesome-free` |
| `fa-svg` | SVG | ✅ | `@fortawesome/fontawesome-free` |
| `md` | Font | ❌ | `material-design-icons-iconfont` |

**Recommendation:** Use `mdi-svg` for production apps - it's tree-shakeable and only includes icons you actually use.

---

## Icon Sets

### Configuration

```typescript
// nuxt.config.ts
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi',  // 'mdi' | 'mdi-svg' | 'fa' | 'fa-svg' | 'md'
    }
  }
}
```

---

## MDI Font Icons

Material Design Icons as a web font. Easiest to set up but includes all 7000+ icons.

### Installation

```bash
npm install @mdi/font
```

### Configuration

```typescript
// nuxt.config.ts
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi',
    }
  }
}
```

The module automatically adds the CSS import.

### Usage

```vue
<template>
  <!-- Icon prop -->
  <v-icon icon="mdi-home" />
  <v-icon icon="mdi-account" />
  <v-icon icon="mdi-cog" />
  
  <!-- Slot content -->
  <v-icon>mdi-heart</v-icon>
  
  <!-- In buttons -->
  <v-btn icon="mdi-plus" />
  <v-btn prepend-icon="mdi-check">Save</v-btn>
  <v-btn append-icon="mdi-arrow-right">Next</v-btn>
  
  <!-- Size and color -->
  <v-icon icon="mdi-star" size="large" color="warning" />
  <v-icon icon="mdi-alert" size="x-large" color="error" />
</template>
```

### Finding Icons

Browse icons at: https://pictogrammers.com/library/mdi/

---

## MDI SVG Icons

Material Design Icons as SVG paths. **Recommended for production.**

### Installation

```bash
npm install @mdi/js
```

### Configuration

```typescript
// nuxt.config.ts
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi-svg',
      svg: {
        mdi: {
          aliases: {
            // Map friendly names to @mdi/js exports
            account: 'mdiAccount',
            home: 'mdiHome',
            menu: 'mdiMenu',
            close: 'mdiClose',
            settings: 'mdiCog',
            search: 'mdiMagnify',
            edit: 'mdiPencil',
            delete: 'mdiDelete',
            save: 'mdiContentSave',
            add: 'mdiPlus',
            remove: 'mdiMinus',
            check: 'mdiCheck',
            cancel: 'mdiCancel',
            info: 'mdiInformation',
            warning: 'mdiAlert',
            error: 'mdiAlertCircle',
            success: 'mdiCheckCircle',
            eye: 'mdiEye',
            eyeOff: 'mdiEyeOff',
            calendar: 'mdiCalendar',
            clock: 'mdiClock',
            email: 'mdiEmail',
            phone: 'mdiPhone',
            location: 'mdiMapMarker',
            link: 'mdiLink',
            download: 'mdiDownload',
            upload: 'mdiUpload',
            refresh: 'mdiRefresh',
            sort: 'mdiSort',
            filter: 'mdiFilter',
            more: 'mdiDotsVertical',
          }
        }
      }
    }
  }
}
```

### Usage

```vue
<script setup lang="ts">
// Import icons directly for those not in aliases
import { mdiHeart, mdiStar, mdiThumbUp } from '@mdi/js'
</script>

<template>
  <!-- Using aliases (prefixed with $) -->
  <v-icon icon="$account" />
  <v-icon icon="$home" />
  <v-icon icon="$settings" />
  
  <!-- Using direct imports -->
  <v-icon :icon="mdiHeart" />
  <v-icon :icon="mdiStar" />
  <v-icon :icon="mdiThumbUp" />
  
  <!-- In buttons -->
  <v-btn icon="$add" />
  <v-btn :icon="mdiHeart" color="error" />
</template>
```

### Benefits

- **Tree-shaking**: Only imported icons are bundled
- **Type-safe**: TypeScript autocomplete for icon names
- **Smaller bundle**: No 600KB+ icon font

---

## FontAwesome Icons

### Installation

```bash
# Free version
npm install @fortawesome/fontawesome-free

# Pro version (requires license)
npm install @fortawesome/fontawesome-pro
```

### Font Configuration

```typescript
// nuxt.config.ts
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'fa',
    }
  }
}
```

### SVG Configuration

```typescript
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'fa-svg',
    }
  }
}
```

### Usage

```vue
<template>
  <!-- Solid icons -->
  <v-icon icon="fas fa-home" />
  <v-icon icon="fas fa-user" />
  
  <!-- Regular icons -->
  <v-icon icon="far fa-heart" />
  
  <!-- Brand icons -->
  <v-icon icon="fab fa-github" />
  <v-icon icon="fab fa-twitter" />
</template>
```

### Custom Aliases

```typescript
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'fa',
      aliases: {
        home: 'fas fa-home',
        account: 'fas fa-user',
        menu: 'fas fa-bars',
        close: 'fas fa-times',
      }
    }
  }
}
```

---

## Material Design Icons (Google)

Google's Material Design icons.

### Installation

```bash
npm install material-design-icons-iconfont
```

### Configuration

```typescript
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'md',
    }
  }
}
```

### Usage

```vue
<template>
  <v-icon icon="home" />
  <v-icon icon="account_circle" />
  <v-icon icon="settings" />
</template>
```

---

## Custom Icons

### Custom SVG Component

```typescript
// plugins/vuetify-icons.ts
import { h } from 'vue'
import type { IconSet, IconProps } from 'vuetify'

// Custom SVG icon component
const CustomIcon = (props: IconProps) => {
  return h('svg', {
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    ...props,
  }, [
    h('path', { d: 'M12 2L2 22h20L12 2z' })
  ])
}

// Custom icon set
const customIconSet: IconSet = {
  component: (props: IconProps) => {
    const iconName = props.icon as string
    
    // Map icon names to components
    const icons: Record<string, any> = {
      custom: CustomIcon,
      // Add more custom icons
    }
    
    return h(icons[iconName] || icons.custom, props)
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  onVuetifyHook(nuxtApp, 'vuetify:before-create', ({ vuetifyOptions }) => {
    vuetifyOptions.icons = {
      defaultSet: 'mdi',
      sets: {
        custom: customIconSet,
      }
    }
  })
})
```

### Usage

```vue
<template>
  <!-- Use custom icon set -->
  <v-icon icon="custom:myicon" />
</template>
```

### SVG File Icons

```typescript
// plugins/vuetify-svg-icons.ts
import { h } from 'vue'
import type { IconSet, IconProps } from 'vuetify'

// Import SVG files
import LogoIcon from '~/assets/icons/logo.svg?raw'
import CustomIcon from '~/assets/icons/custom.svg?raw'

const svgIcons: Record<string, string> = {
  logo: LogoIcon,
  custom: CustomIcon,
}

const svgIconSet: IconSet = {
  component: (props: IconProps) => {
    const iconName = props.icon as string
    const svg = svgIcons[iconName]
    
    if (!svg) return null
    
    return h('span', {
      innerHTML: svg,
      class: 'v-icon__svg',
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    })
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  onVuetifyHook(nuxtApp, 'vuetify:before-create', ({ vuetifyOptions }) => {
    vuetifyOptions.icons = {
      ...vuetifyOptions.icons,
      sets: {
        ...vuetifyOptions.icons?.sets,
        svg: svgIconSet,
      }
    }
  })
})
```

---

## Icon Aliases

Aliases let you use friendly names for icons.

### Default Aliases

Vuetify uses these aliases internally:

| Alias | Used By |
|-------|---------|
| `$cancel` | Close buttons |
| `$close` | Dialog close |
| `$delete` | Delete actions |
| `$clear` | Input clear |
| `$success` | Success alerts |
| `$info` | Info alerts |
| `$warning` | Warning alerts |
| `$error` | Error alerts |
| `$prev` | Navigation prev |
| `$next` | Navigation next |
| `$checkboxOn` | Checkbox checked |
| `$checkboxOff` | Checkbox unchecked |
| `$dropdown` | Dropdown arrow |
| `$expand` | Expand icon |
| `$collapse` | Collapse icon |
| `$sort` | Sort icon |
| `$menu` | Menu icon |

### Override Default Aliases

```typescript
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi',
      aliases: {
        // Override defaults
        close: 'mdi-close-circle',
        delete: 'mdi-trash-can',
        success: 'mdi-check-bold',
        warning: 'mdi-alert-outline',
        
        // Add custom aliases
        dashboard: 'mdi-view-dashboard',
        profile: 'mdi-account-circle',
      }
    }
  }
}
```

### Usage with Aliases

```vue
<template>
  <!-- Default aliases work everywhere -->
  <v-text-field clearable />  <!-- Uses $clear -->
  <v-checkbox />              <!-- Uses $checkboxOn/$checkboxOff -->
  <v-select />                <!-- Uses $dropdown -->
  
  <!-- Custom aliases -->
  <v-icon icon="$dashboard" />
  <v-icon icon="$profile" />
</template>
```

---

## Performance Optimization

### 1. Use SVG Icons

```typescript
// Best for production
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi-svg',
    }
  }
}
```

### 2. Import Only Needed Icons

```vue
<script setup lang="ts">
// Import only what you need
import { 
  mdiHome, 
  mdiAccount, 
  mdiCog 
} from '@mdi/js'
</script>
```

### 3. Create Icon Barrel File

```typescript
// utils/icons.ts
export { 
  mdiHome,
  mdiAccount,
  mdiCog,
  mdiMenu,
  mdiClose,
  mdiCheck,
  mdiAlert,
  // ... other commonly used icons
} from '@mdi/js'
```

```vue
<script setup lang="ts">
import { mdiHome, mdiAccount } from '~/utils/icons'
</script>
```

### 4. Analyze Bundle

```bash
npm run analyze
```

Check icon bundle sizes and remove unused icons.

---

## Troubleshooting

### Icons Not Showing

**Problem:** Icons appear as empty boxes or missing.

**Solutions:**

1. Install the icon package:
```bash
npm install @mdi/font
# or
npm install @mdi/js
```

2. Check configuration:
```typescript
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi',  // Must match installed package
    }
  }
}
```

### SVG Icons Not Resolved

**Problem:** SVG icon aliases show as text.

**Solution:** Ensure alias values match `@mdi/js` export names exactly:

```typescript
svg: {
  mdi: {
    aliases: {
      // ✅ Correct
      account: 'mdiAccount',
      
      // ❌ Wrong
      account: 'mdi-account',
      account: 'account',
    }
  }
}
```

### Icons Wrong Size

**Problem:** Icons appear too big or small.

**Solution:** Use the `size` prop:

```vue
<v-icon icon="mdi-home" size="small" />
<v-icon icon="mdi-home" size="default" />
<v-icon icon="mdi-home" size="large" />
<v-icon icon="mdi-home" size="x-large" />
<v-icon icon="mdi-home" size="24" />  <!-- Pixels -->
```

### FontAwesome Not Working

**Problem:** FA icons don't display.

**Solution:** 

1. Install package:
```bash
npm install @fortawesome/fontawesome-free
```

2. Use correct prefix:
```vue
<!-- Must include style prefix -->
<v-icon icon="fas fa-home" />  <!-- Solid -->
<v-icon icon="far fa-heart" /> <!-- Regular -->
<v-icon icon="fab fa-github" /> <!-- Brands -->
```

### Icon Color Not Changing

**Problem:** Icon stays same color despite `color` prop.

**Solution:** Ensure parent doesn't override:

```vue
<!-- Color prop -->
<v-icon icon="mdi-heart" color="error" />

<!-- Or use CSS -->
<v-icon icon="mdi-heart" class="text-error" />

<!-- In button -->
<v-btn icon="mdi-heart" color="error" />
```

---

## Complete Example

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['vuetify-nuxt4-module'],
  
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi-svg',
        svg: {
          mdi: {
            aliases: {
              // Navigation
              home: 'mdiHome',
              menu: 'mdiMenu',
              back: 'mdiArrowLeft',
              forward: 'mdiArrowRight',
              
              // Actions
              add: 'mdiPlus',
              edit: 'mdiPencil',
              delete: 'mdiDelete',
              save: 'mdiContentSave',
              cancel: 'mdiClose',
              search: 'mdiMagnify',
              filter: 'mdiFilter',
              refresh: 'mdiRefresh',
              
              // Status
              success: 'mdiCheckCircle',
              error: 'mdiAlertCircle',
              warning: 'mdiAlert',
              info: 'mdiInformation',
              
              // User
              account: 'mdiAccount',
              login: 'mdiLogin',
              logout: 'mdiLogout',
              settings: 'mdiCog',
              
              // Media
              image: 'mdiImage',
              video: 'mdiVideo',
              file: 'mdiFile',
              folder: 'mdiFolder',
              download: 'mdiDownload',
              upload: 'mdiUpload',
              
              // Communication
              email: 'mdiEmail',
              phone: 'mdiPhone',
              chat: 'mdiChat',
              notification: 'mdiBell',
              
              // Theme
              lightMode: 'mdiWhiteBalanceSunny',
              darkMode: 'mdiMoonWaningCrescent',
            }
          }
        }
      }
    }
  }
})
```

```vue
<!-- Usage -->
<template>
  <v-app>
    <v-app-bar>
      <v-btn icon="$menu" />
      <v-app-bar-title>App</v-app-bar-title>
      <v-btn icon="$search" />
      <v-btn :icon="isDark ? '$lightMode' : '$darkMode'" @click="toggleTheme" />
      <v-btn icon="$account" />
    </v-app-bar>
    
    <v-main>
      <v-btn prepend-icon="$add">Add Item</v-btn>
      <v-btn prepend-icon="$save" color="primary">Save</v-btn>
      <v-btn prepend-icon="$cancel" color="error">Cancel</v-btn>
    </v-main>
  </v-app>
</template>
```
