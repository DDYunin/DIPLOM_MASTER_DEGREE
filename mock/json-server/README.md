# JSON Server — локальный mock API

Используется на этапе разработки frontend, когда микросервисы бэкенда недоступны или разрабатываются параллельно.

## Запуск

```bash
npm run mock:server
```

Сервер слушает `http://localhost:3001`.

## Подключение Vite

В `vite.config.ts` временно направьте все префиксы `/api` на mock-сервер:

```ts
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true
  }
}
```

Запуск в двух терминалах:

```bash
npm run mock:server
npm run dev
```

## Файлы

| Файл          | Назначение                                  |
| ------------- | ------------------------------------------- |
| `db.json`     | «База данных» — коллекции JSON              |
| `routes.json` | Сопоставление URL API проекта и ресурсов db |
| `server.cjs`  | Расширения: auth, PageResponse, задержка    |

Данные можно синхронизировать с `public/mock-data/` по мере развития API.
