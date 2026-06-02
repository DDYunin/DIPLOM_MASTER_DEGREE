# Рисунки к главе 3 — программный стек

> Формат: Mermaid. Экспорт в PNG/SVG: [mermaid.live](https://mermaid.live) или расширение _Markdown Preview Mermaid Support_ в VS Code / Cursor.

---

## Рисунок 3.1 — Pipeline сборки Vite (п. 3.1)

**Подпись:** Схема процесса сборки клиентского приложения: исходные файлы Vue/TypeScript обрабатываются Vite и преобразуются в статический бандл `dist` для развёртывания

```mermaid
flowchart LR
  subgraph sources [Исходники]
    A1[".vue SFC"]
    A2[".ts / .tsx"]
    A3["assets / CSS"]
  end

  subgraph vite [Vite]
    B1["Dev: ES modules + HMR"]
    B2["Build: Rollup bundle"]
  end

  subgraph output [Результат]
    C1["dist/index.html"]
    C2["dist/assets/*"]
  end

  A1 --> vite
  A2 --> vite
  A3 --> vite
  B1 -.->|npm run dev| D[Браузер разработчика]
  B2 -->|npm run build| output
  output --> E[Nginx / Docker]
```

---

## Рисунок 3.2 — Composition API и композиция UI (п. 3.2)

**Подпись:** Иерархическая композиция интерфейса платформы: страницы агрегируют виджеты, виджеты — features и entity-компоненты

```mermaid
flowchart TB
  Page["Page\n(teacher-courses, admin-users…)"]
  Widget["Widget\n(CourseContentEditor, UsersTable…)"]
  Feature["Feature\n(AddUserModal, ThemeToggler…)"]
  EntityUI["Entity UI\n(CourseCard, StudentCourseCard)"]
  Shared["Shared UI\n(WidgetCard, layouts)"]

  Page --> Widget
  Widget --> Feature
  Widget --> EntityUI
  Feature --> EntityUI
  Feature --> Shared
  EntityUI --> Shared

  subgraph logic [Логика Composition API]
    Composable["composables / use*"]
    Store["Pinia stores"]
  end

  Page --> logic
  Feature --> logic
```

---

## Рисунок 3.3 — Поток типизации данных TypeScript (п. 3.3)

**Подпись:** Цепочка преобразования данных от ответа API к типизированным props компонента пользовательского интерфейса

```mermaid
flowchart LR
  API["HTTP JSON\n(DTO от backend)"]
  Mapper["Mapper\nentities/*/lib"]
  Domain["Domain type\nentities/*/model"]
  Store["Pinia / Vue Query"]
  Props["Component props\n&lt;script setup lang='ts'&gt;"]

  API --> Mapper
  Mapper --> Domain
  Domain --> Store
  Domain --> Props
  Store --> Props
```

---

## Рисунок 3.4 — Разделение client state и server state (п. 3.4, 3.8)

**Подпись:** Разделение клиентского состояния (Pinia) и серверного состояния (TanStack Vue Query) в архитектуре приложения

```mermaid
flowchart TB
  subgraph ui [Компоненты Vue]
    C[Page / Widget / Feature]
  end

  subgraph client [Client state — Pinia]
    S1["useSessionStore\n(auth, role)"]
    S2["useThemeStore\n(light / dark)"]
    S3["UI flags, preferences"]
  end

  subgraph server [Server state — TanStack Query]
    Q1["useQuery\n(lists, details)"]
    Q2["useMutation\n(create, update)"]
    Cache["Query cache"]
  end

  subgraph transport [Транспорт]
    API["apiClient + fetch"]
  end

  C --> client
  C --> server
  Q1 --> Cache
  Q2 --> Cache
  Q1 --> API
  Q2 --> API
  API --> Backend["Backend / JSON Server"]
```

---

## Рисунок 3.5 — Дерево маршрутов Vue Router (п. 3.5)

**Подпись:** Дерево маршрутов клиентского приложения платформы обучения: корневые порталы `/admin`, `/teacher` и `/student` с вложенными маршрутами

```mermaid
flowchart TB
  Root["/ → redirect login"]
  Login["/login\nrequiresGuest"]

  subgraph admin ["/admin — ROLE_ADMIN"]
    A0["/admin → users"]
    A1["/admin/users"]
    A2["/admin/users/student/:id"]
    A3["/admin/users/teacher/:id"]
    A4["/admin/profile"]
    A5["/admin/organization"]
  end

  subgraph teacher ["/teacher — ROLE_TEACHER"]
    T0["/teacher → courses"]
    T1["/teacher/courses"]
    T2["/teacher/courses/new"]
    T3["/teacher/courses/:id"]
    T3a["↳ info | content | participants | grades"]
    T4["/teacher/courses/:id/quiz-builder"]
    T5["/teacher/question-banks"]
    T6["/teacher/question-banks/:bankId"]
    T7["/teacher/profile"]
  end

  subgraph student ["/student — ROLE_STUDENT"]
    S0["/student → courses"]
    S1["/student/courses"]
    S2["/student/courses/:id"]
    S3["/student/courses/:id/assessment/:assessmentId"]
    S4["…/assessment/:id/take"]
    S5["/student/profile"]
  end

  Root --> Login
  Login --> admin
  Login --> teacher
  Login --> student
  T3 --> T3a
```

---

## Рисунок 3.6 — Алгоритм navigation guard (п. 3.5)

**Подпись:** Блок-схема алгоритма глобального navigation guard Vue Router: проверка авторизации, гостевых страниц и ролевого доступа

```mermaid
flowchart TD
  Start([router.beforeEach]) --> Auth{requiresAuth\nи не авторизован?}
  Auth -->|да| LoginRedirect["redirect → /login\n+ query.redirect"]
  Auth -->|нет| Guest{requiresGuest\nи авторизован?}

  Guest -->|да| HomeByRole["redirect → домашний портал\nпо userRole"]
  Guest -->|нет| RBAC{allowedRoles\nзаданы?}

  RBAC -->|нет| Allow([next — доступ разрешён])
  RBAC -->|да| RoleOk{роль пользователя\nв allowedRoles?}

  RoleOk -->|да| Allow
  RoleOk -->|нет| PortalRedirect["redirect → портал роли\nadmin / teacher / student"]
  RoleOk -->|роль неизвестна| LoginRedirect2["redirect → /login"]

  HomeByRole --> AdminP["/admin"]
  HomeByRole --> TeacherP["/teacher"]
  HomeByRole --> StudentP["/student"]
```

---

## Рисунок 3.7 — Интеграция PrimeVue в приложение (п. 3.6)

**Подпись:** Схема подключения библиотеки PrimeVue: глобальная регистрация, тема Aura и design tokens приложения

```mermaid
flowchart TB
  Main["main.ts"]
  Prime["PrimeVue\n(Aura preset)"]
  Toast["ToastService"]
  Confirm["ConfirmationService"]
  Tokens["tokens.css\n--text-color, --surface-card…"]
  Theme["useThemeStore\n.my-app-dark"]
  Components["Features / Widgets\nButton, DataTable, Dialog…"]

  Main --> Prime
  Main --> Toast
  Main --> Confirm
  Tokens --> Components
  Theme --> Prime
  Prime --> Components
```

---

## Рисунок 3.8 — Локализация Vue I18n (п. 3.7)

**Подпись:** Схема работы Vue I18n: файлы локалей, переключение языка и синхронизация с компонентами PrimeVue

```mermaid
flowchart LR
  Files["locales/\nen.json, ru.json"]
  I18n["vue-i18n\nuseI18n()"]
  Switch["LanguageSwitcher"]
  LS["localStorage\napp-locale"]
  UI["Vue components\nt('key')"]
  Prime["PrimeVue locale\n(calendars, filters)"]

  Files --> I18n
  Switch --> I18n
  Switch --> LS
  I18n --> UI
  I18n --> Prime
```

---

## Рисунок 3.9 — Жизненный цикл запроса TanStack Vue Query (п. 3.8)

**Подпись:** Жизненный цикл серверного запроса в TanStack Vue Query: загрузка, кэширование, устаревание и повторный запрос

```mermaid
stateDiagram-v2
  [*] --> idle: компонент смонтирован
  idle --> fetching: useQuery / refetch
  fetching --> success: HTTP 200
  fetching --> error: HTTP 4xx/5xx
  success --> cached: данные в cache
  cached --> stale: истёк staleTime
  stale --> fetching: refetchOnMount / invalidate
  error --> fetching: retry
  cached --> idle: unmount (gc)
```

---

## Рисунок 3.10 — Валидация формы Vee-Validate и Zod (п. 3.9)

**Подпись:** Поток валидации данных формы: поля ввода, Zod-схема, отображение ошибок и формирование payload для API

```mermaid
flowchart LR
  Form["Form fields\n(AddUserModal)"]
  VV["Vee-Validate"]
  Zod["Zod schema\ncreateAddUserFormSchema"]
  Errors["Ошибки полей\n(role-specific rules)"]
  Payload["buildPayload"]
  API["POST /admin/users"]

  Form --> VV
  VV --> Zod
  Zod -->|fail| Errors
  Zod -->|success| Payload
  Payload --> API
  Errors --> Form
```

---

## Рисунок 3.11 — Unit-тестирование Vitest (п. 3.10)

**Подпись:** Структура unit-тестирования в проекте: Vitest, окружение happy-dom и colocated spec-файлы в слоях FSD

```mermaid
flowchart TB
  Vitest["Vitest\nvitest.config.ts"]
  Unit["project: unit\nhappy-dom"]
  SB["project: storybook\nPlaywright browser"]

  subgraph tests [Unit-тесты]
    M["mappers.spec.ts"]
    S["schema.spec.ts"]
    P["buildPayload.spec.ts"]
    T["token.service.spec.ts"]
  end

  Cmd["npm run test:run"]
  Vitest --> Unit
  Vitest --> SB
  Unit --> tests
  Cmd --> Unit
```

---

## Рисунок 3.12 — Storybook в процессе разработки UI (п. 3.11)

**Подпись:** Схема использования Storybook: изолированный рендер компонентов с провайдерами приложения и design tokens

```mermaid
flowchart TB
  SB["Storybook :6006"]
  Preview["preview.ts\nPinia, i18n, PrimeVue"]
  Tokens["tokens.css"]
  Stories["*.stories.ts\nShared / Entities / Features"]
  Addons["addon-docs\naddon-a11y\naddon-vitest"]

  Stories --> SB
  Preview --> SB
  Tokens --> Preview
  Addons --> SB
  SB --> Dev["Разработка UI\nбез полного приложения"]
  Addons --> Tests["Interaction / a11y tests"]
```

---

## Рисунок 3.13 — Контроль качества кода ESLint, Oxlint, Prettier (п. 3.12)

**Подпись:** Схема инструментов статического анализа и форматирования исходного кода frontend-приложения

```mermaid
flowchart LR
  Code["Исходный код\n.vue, .ts"]
  Ox["Oxlint\nбыстрые правила"]
  ES["ESLint\nvue + typescript"]
  Pr["Prettier\nединый стиль"]
  OK["Код к commit / CI"]

  Code --> Ox
  Ox --> ES
  ES --> Pr
  Pr --> OK
```

---

## Рисунок 3.14 — Git hooks Husky и lint-staged (п. 3.13)

**Подпись:** Схема цепочки контроля качества: изменение кода, pre-commit проверки lint-staged и pre-push unit-тесты Vitest

```mermaid
flowchart LR
  Dev["Изменение кода"] --> Commit["git commit"]
  Commit --> PreC["Husky pre-commit"]
  PreC --> LS["lint-staged\nstaged files only"]
  LS --> Ox2["oxlint"]
  LS --> Es2["eslint"]
  LS --> Pr2["prettier"]
  Ox2 --> Push["git push"]
  Es2 --> Push
  Pr2 --> Push
  Push --> PreP["Husky pre-push"]
  PreP --> Vitest["npm run test:run"]
```

---

## Рисунок 3.15 — JSON Server в режиме разработки (п. 3.14)

**Подпись:** Схема взаимодействия в режиме разработки с JSON Server: Vue SPA, proxy Vite и файл db.json

```mermaid
flowchart LR
  SPA["Vue SPA\napiClient"]
  Vite["Vite dev server"]
  Mock["JSON Server :3001\nserver.cjs"]
  DB["db.json\n+ routes.json"]
  Real["Микросервисы backend\n(production)"]

  SPA --> Vite
  Vite -->|proxy /api\ndev + mock| Mock
  Mock --> DB
  Vite -.->|proxy /api\nproduction| Real
```

---

## Рисунок 3.16 — Multi-stage сборка Docker (п. 3.15)

**Подпись:** Схема multi-stage Dockerfile: этап сборки frontend на Node.js и этап раздачи статики через nginx

```mermaid
flowchart TB
  subgraph stage1 [Stage: build — node:22-alpine]
    B1["npm ci"]
    B2["npm run build-only"]
    B3["dist/"]
    B1 --> B2 --> B3
  end

  subgraph stage2 [Stage: production — nginx:alpine]
    N1["nginx.conf.template"]
    N2["/usr/share/nginx/html"]
    N1 --> N2
  end

  Src["Исходники + package.json"] --> stage1
  B3 -->|COPY --from=build| stage2
  stage2 --> Image["Docker image\nEXPOSE 80"]
```

---

## Рисунок 3.17 — Production-развёртывание Docker и Nginx (п. 3.15)

**Подпись:** Схема production-развёртывания: браузер пользователя, контейнер nginx со статикой SPA и проксирование запросов `/api` на backend

```mermaid
flowchart LR
  Browser["Браузер пользователя"]
  Nginx["Nginx :80\nDocker container"]
  Static["dist/\nindex.html + assets"]
  API["Backend\nusers / course / files"]

  Browser -->|GET /courses…| Nginx
  Nginx -->|try_files → index.html| Static
  Nginx -->|GET /assets/*| Static
  Browser -->|XHR /api/*| Nginx
  Nginx -->|proxy_pass| API
```

---

## Рисунок 3.18 — Сравнение frontend-фреймворков (введение, табл. 3.2)

**Подпись:** Схематичное сравнение рассмотренных frontend-фреймворков: Vue 3 выбран как баланс между полнотой экосистемы и сложностью интеграции для SPA учебной платформы

```mermaid
flowchart TB
  subgraph criteria [Критерии выбора]
    C1["Единая экосистема\n(Router, Pinia, I18n)"]
    C2["Порог входа"]
    C3["Масштаб SPA без SSR"]
  end

  Vue["Vue 3 ✓ выбран\nумеренная сложность\nофициальный стек"]
  React["React\nмаксимальная экосистема\nнужна сборка стека вручную"]
  Angular["Angular\nenterprise-платформа\nизбыточен для проекта"]

  criteria --> Vue
  criteria --> React
  criteria --> Angular

  Vue --> Decision["Решение:\nVue 3 + Composition API"]
```

> Детальное сравнение — **таблица 3.2** в тексте главы.

---

## Сводная таблица рисунков

| Рисунок | Пункт главы                     | Тема                        |
| ------- | ------------------------------- | --------------------------- |
| 3.1     | 3.1 Vite                        | Pipeline сборки             |
| 3.2     | 3.2 Vue 3                       | Композиция UI               |
| 3.3     | 3.3 TypeScript                  | Поток типизации             |
| 3.4     | 3.4 / 3.8                       | Pinia vs Vue Query          |
| 3.5     | 3.5 Vue Router                  | Дерево маршрутов            |
| 3.6     | 3.5 Vue Router                  | Navigation guard            |
| 3.7     | 3.6 PrimeVue                    | Интеграция UI-kit           |
| 3.8     | 3.7 Vue I18n                    | Локализация                 |
| 3.9     | 3.8 TanStack Query              | Жизненный цикл query        |
| 3.10    | 3.9 Vee-Validate + Zod          | Валидация формы             |
| 3.11    | 3.10 Vitest                     | Unit-тесты                  |
| 3.12    | 3.11 Storybook                  | Изолированная разработка UI |
| 3.13    | 3.12 ESLint / Oxlint / Prettier | Lint и format               |
| 3.14    | 3.13 Husky                      | Git hooks                   |
| 3.15    | 3.14 JSON Server                | Mock API                    |
| 3.16    | 3.15 Docker                     | Multi-stage build           |
| 3.17    | 3.15 Docker + Nginx             | Production deploy           |
| 3.18    | Введение                        | Сравнение фреймворков       |
