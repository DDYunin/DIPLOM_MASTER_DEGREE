import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

import SettingsCard from './SettingsCard.vue'

const meta: Meta<typeof SettingsCard> = {
  title: 'Shared/UI/SettingsCard',
  component: SettingsCard,
  tags: ['autodocs'],
  args: {
    title: 'Profile Information',
    icon: 'pi pi-user'
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Без футера',
  render: (args) => ({
    components: { SettingsCard, InputText },
    setup: () => ({ args }),
    template: `
      <SettingsCard v-bind="args">
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.75rem; color: var(--text-color-muted); margin-bottom: 0.25rem;">Email</label>
            <InputText model-value="student@university.edu" style="width: 100%;" />
          </div>
          <div>
            <label style="display: block; font-size: 0.75rem; color: var(--text-color-muted); margin-bottom: 0.25rem;">Full name</label>
            <InputText model-value="Ivan Ivanov" style="width: 100%;" />
          </div>
        </div>
      </SettingsCard>
    `
  })
}

export const WithFooter: Story = {
  name: 'С футером',
  render: (args) => ({
    components: { SettingsCard, Button, InputText },
    setup: () => ({ args }),
    template: `
      <SettingsCard v-bind="args">
        <InputText model-value="New secure password" type="password" style="width: 100%;" />
        <template #footer>
          <Button label="Cancel" severity="secondary" text />
          <Button label="Save changes" />
        </template>
      </SettingsCard>
    `
  })
}
