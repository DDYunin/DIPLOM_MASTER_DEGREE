import type { Meta, StoryObj } from '@storybook/vue3-vite'

import LanguageSwitcher from './LanguageSwitcher.vue'

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'Features/ChangeLanguage/LanguageSwitcher',
  component: LanguageSwitcher,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Переключатель локали. Синхронизирует vue-i18n и локаль компонентов PrimeVue. Выбор сохраняется в localStorage.'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'По умолчанию (EN)'
}
