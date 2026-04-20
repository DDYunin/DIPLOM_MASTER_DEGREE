// Layouts
import AuthLayout from './layouts/AuthLayout.vue'
import AdminLayout from './layouts/AdminLayout.vue'
import EmptyLayout from './layouts/EmptyLayout.vue'
import TeacherLayout from './layouts/TeacherLayout.vue'

// Components
import WidgetCard from './widget-card/WidgetCard.vue'
import SettingsCard from './settings-card/SettingsCard.vue'

export {
  AuthLayout,
  AdminLayout,
  /** Основной layout для интефрейса преподавателя */
  TeacherLayout,
  /** Универсальная обёртка для прокидывания дочерних элементов в маршрутизации */
  EmptyLayout,
  WidgetCard,
  /** Карточки на странице профиля (преподаватель и студент) */
  SettingsCard
}
