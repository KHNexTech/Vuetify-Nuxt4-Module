<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title>Nuxt Vuetify Module</v-app-bar-title>
      <v-spacer />
      <v-btn
        :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'"
        @click="toggleTheme"
      />
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-card>
              <v-card-title>Welcome!</v-card-title>
              <v-card-text>
                <p><strong>Theme:</strong> {{ currentTheme }}</p>
                <p><strong>Breakpoint:</strong> {{ currentBreakpoint }}</p>
                <p><strong>Mobile:</strong> {{ isMobile ? 'Yes' : 'No' }}</p>
                <p><strong>Locale:</strong> {{ currentLocale }}</p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="primary"
                  @click="setTheme('light')"
                >
                  Light
                </v-btn>
                <v-btn
                  color="secondary"
                  @click="setTheme('dark')"
                >
                  Dark
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-card>
              <v-card-title>Form Example</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="form.name"
                  label="Name"
                />
                <v-text-field
                  v-model="form.email"
                  label="Email"
                  type="email"
                />
                <v-select
                  v-model="form.country"
                  label="Country"
                  :items="countries"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="primary"
                  block
                >
                  Submit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const {
  isDark,
  isMobile,
  currentBreakpoint,
  currentTheme,
  currentLocale,
  toggleTheme,
  setTheme,
} = useVuetify()

const form = reactive({
  name: '',
  email: '',
  country: '',
})

const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Japan']
</script>
