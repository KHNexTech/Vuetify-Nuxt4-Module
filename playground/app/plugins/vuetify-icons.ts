import {
  mdiAccount,
  mdiHome,
  mdiMenu,
  mdiClose,
  mdiChevronDown,
  mdiChevronUp,
  mdiCheck,
  mdiAlert,
  mdiInformation,
  // Add only icons you use
} from '@mdi/js'
import type { NuxtApp } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  onVuetifyHook(nuxtApp as NuxtApp, 'vuetify:before-create', ({ vuetifyOptions }) => {
    vuetifyOptions.icons = {
      defaultSet: 'mdi-svg',
      aliases: {
        account: mdiAccount,
        home: mdiHome,
        menu: mdiMenu,
        close: mdiClose,
        chevronDown: mdiChevronDown,
        chevronUp: mdiChevronUp,
        check: mdiCheck,
        alert: mdiAlert,
        info: mdiInformation,
      },
    }
  })
})
