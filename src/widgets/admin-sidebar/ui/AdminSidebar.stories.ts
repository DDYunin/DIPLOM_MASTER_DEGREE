import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { Decorator } from '@storybook/vue3-vite'

import AdminSidebar from './AdminSidebar.vue'

/** Обёртка с фиксированной высотой — сайдбар использует height: 100%. */
const withSidebarHeight: Decorator = () => ({
  template: '<div style="height: 100vh; width: 260px; display: flex;"><story /></div>'
})

const meta: Meta<typeof AdminSidebar> = {
  title: 'Widgets/AdminSidebar',
  component: AdminSidebar,
  tags: ['autodocs'],
  decorators: [withSidebarHeight],
  parameters: {
    docs: {
      description: {
        component:
          'Боковая навигация административного портала: ссылки на разделы «Пользователи», «Организация», «Профиль» и кнопка выхода.'
      }
    },
    layout: 'fullscreen'
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Администраторский сайдбар'
}
