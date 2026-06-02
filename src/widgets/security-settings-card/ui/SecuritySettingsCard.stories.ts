import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { withAppSurface } from '@/shared/lib/storybook/decorators'
import { mockAdminUser } from '@/widgets/profile-info-card/lib/storybook-mocks'
import SecuritySettingsCard from './SecuritySettingsCard.vue'

const meta: Meta<typeof SecuritySettingsCard> = {
  title: 'Widgets/SecuritySettingsCard',
  component: SecuritySettingsCard,
  tags: ['autodocs'],
  decorators: [withAppSurface],
  parameters: {
    docs: {
      description: {
        component:
          'Карточка настроек безопасности: форма смены пароля и опциональный блок двухфакторной аутентификации. Режим `self` — пользователь меняет свой пароль; режим `manage` — администратор сбрасывает пароль другого пользователя.'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const SelfMode: Story = {
  name: 'Режим own-profile (смена своего пароля)',
  args: {
    modelValue: { ...mockAdminUser, twoFactorEnabled: false },
    mode: 'self',
    showMfa: true
  }
}

export const ManageMode: Story = {
  name: 'Режим manage (сброс пароля администратором)',
  args: {
    modelValue: mockAdminUser,
    mode: 'manage',
    showMfa: false
  }
}
