// Layouts
import AuthLayout from './layouts/AuthLayout.vue'
import AdminLayout from './layouts/AdminLayout.vue'
import EmptyLayout from './layouts/EmptyLayout.vue'

// Components
import WidgetCard from './widget-card/WidgetCard.vue'

export {
  AuthLayout,
  AdminLayout,
  /** Универсальная обёртка для прокидывания дочерних элементов в маршрутизации */
  EmptyLayout,
  WidgetCard
}
