import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from 'primevue/button'

import WidgetCard from './WidgetCard.vue'

const meta: Meta<typeof WidgetCard> = {
  title: 'Shared/UI/WidgetCard',
  component: WidgetCard,
  tags: ['autodocs'],
  argTypes: {
    iconColorToken: {
      control: 'text',
      description: 'CSS-значение цвета иконки, например var(--color-primary)'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'С заголовком и иконкой',
  args: {
    title: 'Assigned Courses',
    subtitle: 'Courses you are teaching this semester',
    icon: 'pi-book',
    iconColorToken: 'var(--color-primary)'
  },
  render: (args) => ({
    components: { WidgetCard },
    setup: () => ({ args }),
    template: `
      <WidgetCard v-bind="args">
        <p style="margin: 0; color: var(--text-color-muted); font-size: 0.875rem;">
          Здесь размещается контент виджета: таблица, список или форма.
        </p>
      </WidgetCard>
    `
  })
}

export const WithHeaderActions: Story = {
  name: 'С кнопкой в шапке',
  args: {
    title: 'Permissions',
    icon: 'pi-shield',
    iconColorToken: 'var(--color-accent-purple)'
  },
  render: (args) => ({
    components: { WidgetCard, Button },
    setup: () => ({ args }),
    template: `
      <WidgetCard v-bind="args">
        <template #header-actions>
          <Button label="Add" icon="pi pi-plus" size="small" />
        </template>
        <p style="margin: 0; color: var(--text-color-secondary); font-size: 0.875rem;">
          Список прав доступа.
        </p>
      </WidgetCard>
    `
  })
}

export const Minimal: Story = {
  name: 'Только контент (без шапки)',
  render: () => ({
    components: { WidgetCard },
    template: `
      <WidgetCard>
        <p style="margin: 0;">Карточка без заголовка — только слот по умолчанию.</p>
      </WidgetCard>
    `
  })
}
