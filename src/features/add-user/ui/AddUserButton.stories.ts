import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { withAppSurface } from '@/shared/lib/storybook/decorators'
import AddUserButton from './AddUserButton.vue'

const meta: Meta<typeof AddUserButton> = {
  title: 'Features/AddUser/AddUserButton',
  component: AddUserButton,
  tags: ['autodocs'],
  decorators: [withAppSurface],
  parameters: {
    docs: {
      description: {
        component:
          'Кнопка вызова формы создания пользователя. При клике генерирует событие click, которое открывает модальное окно AddUserModal.'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Кнопка добавления'
}
