/**
 * Локальный mock API на базе JSON Server.
 * Запуск: npm run mock:server (порт 3001)
 */
const path = require('node:path')

const jsonServer = require('json-server')

const DB_PATH = path.join(__dirname, 'db.json')
const ROUTES_PATH = path.join(__dirname, 'routes.json')
const PORT = Number(process.env.MOCK_SERVER_PORT) || 3001

const server = jsonServer.create()
const router = jsonServer.router(DB_PATH)
const middlewares = jsonServer.defaults()
const rewriter = jsonServer.rewriter(require(ROUTES_PATH))

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Имитация сетевой задержки
server.use((_req, _res, next) => {
  setTimeout(next, 300)
})

// Авторизация (упрощённый mock JWT)
server.post('/api/us/api/v1/auth/login', (req, res) => {
  const role = req.body?.login?.includes('teacher') ? 'ROLE_TEACHER' : 'ROLE_STUDENT'
  const header = Buffer.from(JSON.stringify({ roles: [role] })).toString('base64url')
  const accessToken = `mock.${header}.signature`

  res.json({ accessToken })
})

server.post('/api/us/api/v1/auth/refresh', (_req, res) => {
  const header = Buffer.from(JSON.stringify({ roles: ['ROLE_STUDENT'] })).toString('base64url')
  res.json({ accessToken: `mock.${header}.signature` })
})

// Обёртка PageResponse для списка пользователей (как на реальном бэкенде)
server.get('/api/us/api/v1/admin/users', (req, res) => {
  const items = router.db.get('adminUsers').value()
  const page = Number(req.query.page ?? 0)
  const size = Number(req.query.size ?? items.length)

  res.json({
    items,
    page,
    size,
    totalElements: items.length,
    totalPages: 1,
    hasNext: false
  })
})

server.use(rewriter)
server.use(router)

server.listen(PORT, () => {
  console.log(`JSON Server mock API: http://localhost:${PORT}`)
})
