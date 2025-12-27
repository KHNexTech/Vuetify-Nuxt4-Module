<script setup lang="ts">
const {
  isDark,
  toggleTheme,
  currentTheme,
  colors,
  isRtl,
} = useVuetify()
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>Theme Example</v-card-title>
      <v-card-text>
        <p>Current theme: {{ currentTheme }}</p>
        <p>Is dark: {{ isDark }}</p>
        <p>Is RTL: {{ isRtl }}</p>
        <p>Primary color: {{ colors.primary }}</p>

        <v-btn @click="toggleTheme">
          Toggle Theme
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>
