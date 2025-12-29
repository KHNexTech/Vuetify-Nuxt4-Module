# Composables Reference

Complete reference for all composables provided by Vuetify Nuxt 4 Module.

---

## Table of Contents

- [useVuetify](#usevuetify)
- [Vuetify Composables](#vuetify-composables)
  - [useTheme](#usetheme)
  - [useDisplay](#usedisplay)
  - [useLocale](#uselocale)
  - [useLayout](#uselayout)
  - [useRtl](#usertl)
  - [useDefaults](#usedefaults)
  - [useDate](#usedate)
  - [useGoTo](#usegoto)
- [Hook Functions](#hook-functions)

---

## useVuetify

A convenience composable that combines common Vuetify functionality.

### Import

```typescript
// Auto-imported, no import needed
const vuetify = useVuetify()
```

### Return Value

```typescript
interface UseVuetifyReturn {
  // Theme
  isDark: ComputedRef<boolean>
  currentTheme: ComputedRef<string>
  toggleTheme: () => void
  setTheme: (theme: string) => void
  
  // Display
  isMobile: ComputedRef<boolean>
  currentBreakpoint: ComputedRef<string>
  
  // Locale
  setLocale: (locale: string) => void
}
```

### Usage

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

// Check if dark mode
if (isDark.value) {
  console.log('Dark mode enabled')
}

// Check if mobile
if (isMobile.value) {
  console.log('Mobile device')
}

// Toggle theme
const handleToggle = () => toggleTheme()

// Set specific theme
const handleSetTheme = () => setTheme('corporate')

// Change locale
const handleLocale = () => setLocale('km')
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>
        Theme: {{ currentTheme }} | Breakpoint: {{ currentBreakpoint }}
      </v-app-bar-title>
      
      <v-btn
        :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'"
        @click="toggleTheme"
      />
    </v-app-bar>
    
    <v-main>
      <v-container>
        <v-row v-if="isMobile">
          <v-col>Mobile layout</v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="3">Sidebar</v-col>
          <v-col cols="9">Desktop layout</v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
```

---

## Vuetify Composables

All Vuetify composables are auto-imported.

### useTheme

Access and modify the current theme.

```vue
<script setup lang="ts">
const theme = useTheme()

// Current theme name
const themeName = computed(() => theme.global.name.value)

// Current theme object
const currentTheme = computed(() => theme.global.current.value)

// Is dark mode?
const isDark = computed(() => currentTheme.value.dark)

// Available themes
const themes = computed(() => Object.keys(theme.themes.value))

// Change theme
const setTheme = (name: string) => {
  theme.global.name.value = name
}

// Toggle dark mode
const toggleDark = () => {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}

// Access theme colors
const primaryColor = computed(() => currentTheme.value.colors.primary)
</script>
```

### useDisplay

Responsive breakpoint detection.

```vue
<script setup lang="ts">
const display = useDisplay()

// Current breakpoint name
const breakpoint = computed(() => display.name.value)
// 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

// Breakpoint booleans
const isXs = computed(() => display.xs.value)      // < 600px
const isSm = computed(() => display.sm.value)      // 600-960px
const isMd = computed(() => display.md.value)      // 960-1280px
const isLg = computed(() => display.lg.value)      // 1280-1920px
const isXl = computed(() => display.xl.value)      // 1920-2560px
const isXxl = computed(() => display.xxl.value)    // > 2560px

// Comparison helpers
const smAndDown = computed(() => display.smAndDown.value)
const smAndUp = computed(() => display.smAndUp.value)
const mdAndDown = computed(() => display.mdAndDown.value)
const mdAndUp = computed(() => display.mdAndUp.value)
const lgAndDown = computed(() => display.lgAndDown.value)
const lgAndUp = computed(() => display.lgAndUp.value)

// Screen dimensions
const width = computed(() => display.width.value)
const height = computed(() => display.height.value)

// Mobile detection
const mobile = computed(() => display.mobile.value)

// Platform detection
const platform = computed(() => display.platform.value)
// { android, ios, cordova, electron, chrome, edge, firefox, opera, win, mac, linux, touch, ssr }

// Thresholds
const thresholds = display.thresholds
// { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 }
</script>

<template>
  <v-container>
    <!-- Responsive layout -->
    <v-row>
      <v-col :cols="mobile ? 12 : 6">
        Content
      </v-col>
    </v-row>
    
    <!-- Conditional rendering -->
    <v-navigation-drawer v-if="lgAndUp" permanent />
    <v-bottom-navigation v-else />
    
    <!-- Dynamic props -->
    <v-card :elevation="smAndDown ? 0 : 4">
      <v-card-text>
        Screen: {{ width }}x{{ height }}
        Breakpoint: {{ breakpoint }}
      </v-card-text>
    </v-card>
  </v-container>
</template>
```

### useLocale

Access and modify locale settings.

```vue
<script setup lang="ts">
const locale = useLocale()

// Current locale
const current = computed(() => locale.current.value)

// Check if RTL
const isRtl = computed(() => locale.isRtl.value)

// Translate Vuetify strings
const closeText = locale.t('close')
const noDataText = locale.t('noDataText')

// Change locale
const setLocale = (code: string) => {
  locale.current.value = code
}
</script>
```

### useLayout

Access layout information.

```vue
<script setup lang="ts">
const layout = useLayout()

// Get item dimensions
const appBarHeight = computed(() => layout.getLayoutItem('app-bar')?.size ?? 0)
const navDrawerWidth = computed(() => layout.getLayoutItem('nav-drawer')?.size ?? 0)

// Main content rect
const mainRect = computed(() => layout.mainRect.value)
// { top, bottom, left, right }

// Main content styles
const mainStyles = computed(() => layout.mainStyles.value)
</script>
```

### useRtl

Right-to-left support.

```vue
<script setup lang="ts">
const rtl = useRtl()

// Is RTL enabled?
const isRtl = computed(() => rtl.isRtl.value)

// Toggle RTL
const toggleRtl = () => {
  rtl.isRtl.value = !rtl.isRtl.value
}
</script>

<template>
  <v-app :rtl="isRtl">
    <v-btn @click="toggleRtl">
      Toggle RTL
    </v-btn>
  </v-app>
</template>
```

### useDefaults

Access and modify component defaults.

```vue
<script setup lang="ts">
const defaults = useDefaults()

// Get defaults for a component
const btnDefaults = defaults.VBtn

// Provide local defaults
provideDefaults({
  VBtn: {
    variant: 'outlined',
    color: 'primary',
  },
  VCard: {
    elevation: 0,
    border: true,
  }
})
</script>
```

### useDate

Date utilities (when date adapter is configured).

```vue
<script setup lang="ts">
const date = useDate()

// Format date
const formatted = date.format(new Date(), 'fullDateWithWeekday')

// Parse date
const parsed = date.parseISO('2024-01-15')

// Date comparison
const isBefore = date.isBefore(date1, date2)
const isAfter = date.isAfter(date1, date2)
const isSame = date.isSame(date1, date2, 'day')

// Date manipulation
const nextWeek = date.addDays(new Date(), 7)
const nextMonth = date.addMonths(new Date(), 1)

// Get parts
const year = date.getYear(new Date())
const month = date.getMonth(new Date())
const day = date.getDate(new Date())
</script>
```

### useGoTo

Scroll to elements programmatically.

```vue
<script setup lang="ts">
const goTo = useGoTo()

// Scroll to element
const scrollToSection = () => {
  goTo('#section-id')
}

// Scroll to top
const scrollToTop = () => {
  goTo(0)
}

// With options
const scrollWithOptions = () => {
  goTo('#target', {
    duration: 500,
    easing: 'easeInOutCubic',
    offset: -64,  // Account for app bar
  })
}

// Scroll to element
const scrollToElement = (el: Element) => {
  goTo(el)
}
</script>

<template>
  <v-btn @click="scrollToTop">Back to Top</v-btn>
  <v-btn @click="scrollToSection">Go to Section</v-btn>
</template>
```

---

## Hook Functions

### onVuetifyHook

Register callbacks for Vuetify lifecycle events.

```typescript
// Auto-imported
onVuetifyHook(nuxtApp, hookName, callback)
```

### Available Hooks

| Hook | Payload | Description |
|------|---------|-------------|
| `vuetify:before-create` | `{ vuetifyOptions }` | Before Vuetify is created |
| `vuetify:configuration` | `{ vuetifyOptions }` | After configuration applied |
| `vuetify:ready` | `vuetify` | Vuetify instance is ready |

### Usage in Plugins

```typescript
// plugins/vuetify-custom.ts
export default defineNuxtPlugin((nuxtApp) => {
  // Modify options before creation
  onVuetifyHook(nuxtApp, 'vuetify:before-create', ({ vuetifyOptions }) => {
    // Add custom defaults
    vuetifyOptions.defaults = {
      ...vuetifyOptions.defaults,
      VBtn: {
        rounded: 'pill',
      }
    }
    
    // Add custom theme
    if (vuetifyOptions.theme?.themes) {
      vuetifyOptions.theme.themes.custom = {
        dark: false,
        colors: {
          primary: '#FF0000',
        }
      }
    }
  })
  
  // Access Vuetify when ready
  onVuetifyHook(nuxtApp, 'vuetify:ready', (vuetify) => {
    console.log('Theme:', vuetify.theme.global.name.value)
    console.log('Locale:', vuetify.locale.current.value)
  })
})
```

### offVuetifyHook

Unregister hook callbacks.

```typescript
// Register
const unsubscribe = onVuetifyHook(nuxtApp, 'vuetify:ready', callback)

// Unregister
unsubscribe()

// Or use offVuetifyHook
offVuetifyHook(nuxtApp, 'vuetify:ready', callback)
```

---

## Prefixed Composables

If you have naming conflicts, enable `prefixComposables`:

```typescript
// nuxt.config.ts
vuetify: {
  prefixComposables: true,
}
```

| Original | Prefixed |
|----------|----------|
| `useTheme` | `useVTheme` |
| `useDisplay` | `useVDisplay` |
| `useLocale` | `useVLocale` |
| `useLayout` | `useVLayout` |
| `useRtl` | `useVRtl` |
| `useDefaults` | `useVDefaults` |
| `useDate` | `useVDate` |
| `useGoTo` | `useVGoTo` |

---

## TypeScript

All composables are fully typed:

```typescript
import type { ThemeInstance } from 'vuetify'
import type { DisplayInstance } from 'vuetify'

const theme: ThemeInstance = useTheme()
const display: DisplayInstance = useDisplay()
```
