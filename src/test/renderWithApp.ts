import { mount, type MountingOptions, type VueWrapper } from '@vue/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import type { Component } from 'vue'

import { i18n } from '@/shared/config/i18n'

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0
      },
      mutations: {
        retry: false
      }
    }
  })

export const renderWithApp = <C extends Component>(
  component: C,
  options: MountingOptions<InstanceType<C>> = {}
): VueWrapper<InstanceType<C>> => {
  const queryClient = createTestQueryClient()

  return mount(component, {
    ...options,
    global: {
      ...options.global,
      plugins: [
        i18n,
        [VueQueryPlugin, { queryClient }],
        [
          PrimeVue,
          {
            theme: {
              preset: Aura,
              options: {
                darkModeSelector: 'html.my-app-dark'
              }
            }
          }
        ],
        ...(options.global?.plugins ?? [])
      ]
    }
  })
}
