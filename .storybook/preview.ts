import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import 'modern-normalize/modern-normalize.css'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import { setup, type Preview } from '@storybook/vue3-vite'
import { createRouter, createMemoryHistory } from 'vue-router'
import { VueQueryPlugin } from '@tanstack/vue-query'

import { i18n } from '@/shared/config/i18n'
import { withAppSurface } from '@/shared/lib/storybook/decorators'

// Дизайн-токены приложения — единственный источник цветов, теней и радиусов
import '@/app/styles/tokens.css'

const storybookRouter = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }]
})

setup((app) => {
  app.use(createPinia())
  app.use(storybookRouter)
  app.use(i18n)
  app.use(VueQueryPlugin)
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: 'html.my-app-dark, .my-app-dark'
      }
    }
  })
  app.use(ToastService)
  app.use(ConfirmationService)
})

const preview: Preview = {
  decorators: [withAppSurface],

  parameters: {
    layout: 'fullscreen',

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },

    a11y: {
      test: 'todo'
    }
  }
}

export default preview
