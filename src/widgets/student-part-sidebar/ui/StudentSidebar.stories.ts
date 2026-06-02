import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { Decorator } from '@storybook/vue3-vite'

import StudentSidebar from './StudentSidebar.vue'

const withSidebarHeight: Decorator = () => ({
  template: '<div style="height: 100vh; width: 260px; display: flex;"><story /></div>'
})

const meta: Meta<typeof StudentSidebar> = {
  title: 'Widgets/StudentSidebar',
  component: StudentSidebar,
  tags: ['autodocs'],
  decorators: [withSidebarHeight],
  argTypes: {
    collapsed: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Боковая навигация студенческого портала с поддержкой свёрнутого режима: ссылки на курсы, профиль и выход.'
      }
    },
    layout: 'fullscreen'
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Expanded: Story = {
  name: 'Развёрнутый',
  args: {
    collapsed: false
  }
}

export const Collapsed: Story = {
  name: 'Свёрнутый',
  args: {
    collapsed: true
  }
}
