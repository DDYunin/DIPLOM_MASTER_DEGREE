import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { Decorator } from '@storybook/vue3-vite'

import TeacherSidebar from './TeacherSidebar.vue'

const withSidebarHeight: Decorator = () => ({
  template: '<div style="height: 100vh; width: 260px; display: flex;"><story /></div>'
})

const meta: Meta<typeof TeacherSidebar> = {
  title: 'Widgets/TeacherSidebar',
  component: TeacherSidebar,
  tags: ['autodocs'],
  decorators: [withSidebarHeight],
  argTypes: {
    collapsed: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Боковая навигация портала преподавателя с поддержкой свёрнутого режима. В свёрнутом состоянии отображаются только иконки без подписей.'
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
