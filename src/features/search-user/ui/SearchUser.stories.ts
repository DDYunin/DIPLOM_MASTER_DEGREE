import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { withAppSurface } from '@/shared/lib/storybook/decorators'
import SearchUser from './SearchUser.vue'

const meta: Meta<typeof SearchUser> = {
  title: 'Features/SearchUser/SearchUser',
  component: SearchUser,
  tags: ['autodocs'],
  decorators: [withAppSurface],
  parameters: {
    docs: {
      description: {
        component:
          'Поле поиска пользователей с иконкой-лупой. Использует v-model для привязки строки запроса.'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  name: 'Пустой поиск',
  args: {
    modelValue: ''
  }
}

export const WithQuery: Story = {
  name: 'С поисковым запросом',
  args: {
    modelValue: 'Иванов'
  }
}
