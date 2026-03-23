import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Провайдеры
import { router } from './providers/router'

// PrimeVue
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

// ИМПОРТИРУЕМ I18N
import { i18n } from '@/shared/config/i18n'

// Корневой компонент
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.my-app-dark'
    }
  }
})
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
