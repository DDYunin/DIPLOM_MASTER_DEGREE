import { useNotifications } from '@/shared/model'

// In-memory кэш для сохранения мутаций (POST/PATCH) во время работы SPA
const dbCache: Record<string, any> = {}

export const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const method = options.method || 'GET'

  try {
    // 1. Имитация задержки реальной сети
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Парсим URL, чтобы отделить путь от параметров (?facultyId=...)
    // Используем dummy-base 'http://mock', так как endpoint у нас относительный
    const urlObj = new URL(endpoint, 'http://mock')
    const path = urlObj.pathname
    const searchParams = urlObj.searchParams

    // ==============================================================
    // 🛑 MOCK-ПЕРЕХВАТЧИК (Удалить, когда появится реальный бэкенд)
    // ==============================================================
    if (endpoint.startsWith('/users')) {
      // GET: Запрашиваем реальный JSON-файл через HTTP!
      if (method === 'GET') {
        if (!dbCache.users) {
          const res = await fetch('/mock-data/users.json')
          if (!res.ok) throw new Error(`Failed to load mock data: ${res.status}`)
          dbCache.users = await res.json()
        }
        return dbCache.users as T
      }

      // POST: Имитация сохранения
      if (method === 'POST' && options.body) {
        const newUser = JSON.parse(options.body as string)
        dbCache.users = dbCache.users || []
        dbCache.users.unshift(newUser)
        return newUser as T // Возвращаем результат
      }

      // PATCH: Имитация обновления
      if (method === 'PATCH' && options.body) {
        const id = endpoint.split('/')[2]
        const updates = JSON.parse(options.body as string)
        const index = dbCache.users.findIndex((u: any) => u.id === id)

        if (index > -1) {
          dbCache.users[index] = { ...dbCache.users[index], ...updates }
          return dbCache.users[index] as T
        }
        throw new Error('User not found')
      }
    }
    // --- БЛОК HIERARCHY (НОВАЯ РЕЛЯЦИОННАЯ ЛОГИКА) ---
    if (path.startsWith('/hierarchy')) {
      // Вспомогательная функция для загрузки нужной таблицы в кэш
      const loadTable = async (tableName: string, fileName: string) => {
        if (!dbCache[tableName]) {
          const res = await fetch(`/mock-data/hierarchy/${fileName}`)
          if (!res.ok) throw new Error(`Failed to load ${fileName}`)
          dbCache[tableName] = await res.json()
        }
      }

      if (method === 'GET') {
        // 1. Факультеты (Корень)
        if (path === '/hierarchy/faculties') {
          await loadTable('faculties', 'faculties.json')
          return dbCache.faculties as T
        }

        // 2. Кафедры (С фильтром по facultyId)
        if (path === '/hierarchy/departments') {
          await loadTable('departments', 'departments.json')
          const facultyId = Number(searchParams.get('facultyId'))
          return dbCache.departments.filter((d: any) => d.facultyId === facultyId) as T
        }

        // 3. Направления (С фильтром по facultyId)
        if (path === '/hierarchy/fields-of-study') {
          await loadTable('fieldsOfStudy', 'fields-of-study.json')
          const facultyId = Number(searchParams.get('facultyId'))
          return dbCache.fieldsOfStudy.filter((f: any) => f.facultyId === facultyId) as T
        }

        // 4. Группы (С фильтром по fieldOfStudyId)
        if (path === '/hierarchy/student-groups') {
          await loadTable('studentGroups', 'student-groups.json')
          const fieldOfStudyId = Number(searchParams.get('fieldOfStudyId'))
          return dbCache.studentGroups.filter((g: any) => g.fieldOfStudyId === fieldOfStudyId) as T
        }
      }

      // Имитация сохранения нового узла (POST)
      // Чтобы дерево не падало, когда мы добавляем через модалку AddOrgUnitModal
      if (method === 'POST' && options.body) {
        const newItem = JSON.parse(options.body as string)
        newItem.id = Date.now() // Генерируем фейковый ID базы данных

        if (path === '/hierarchy/faculties') {
          dbCache.faculties = dbCache.faculties || []
          dbCache.faculties.push(newItem)
          return newItem as T
        }
        if (path === '/hierarchy/departments') {
          dbCache.departments = dbCache.departments || []
          dbCache.departments.push(newItem)
          return newItem as T
        }
        if (path === '/hierarchy/fields-of-study') {
          dbCache.fieldsOfStudy = dbCache.fieldsOfStudy || []
          dbCache.fieldsOfStudy.push(newItem)
          return newItem as T
        }
        if (path === '/hierarchy/student-groups') {
          dbCache.studentGroups = dbCache.studentGroups || []
          dbCache.studentGroups.push(newItem)
          return newItem as T
        }
      }

      // Имитация обновления существующего узла (PATCH)
      if (method === 'PATCH' && options.body) {
        // Достаем ID из конца URL (например, /hierarchy/faculties/1 -> 1)
        const id = Number(path.split('/').pop())
        const updates = JSON.parse(options.body as string)

        let targetTable: any[] = []
        if (path.includes('/faculties/')) targetTable = dbCache.faculties
        if (path.includes('/departments/')) targetTable = dbCache.departments
        if (path.includes('/fields-of-study/')) targetTable = dbCache.fieldsOfStudy
        if (path.includes('/student-groups/')) targetTable = dbCache.studentGroups

        if (targetTable) {
          const index = targetTable.findIndex((item: any) => item.id === id)
          if (index > -1) {
            targetTable[index] = { ...targetTable[index], ...updates }
            return targetTable[index] as T // Возвращаем обновленный объект
          }
        }
        throw new Error('Item not found in mock DB')
      }

      if (method === 'DELETE') {
        const id = Number(path.split('/').pop())

        let targetTable: any[] | null = null
        if (path.includes('/faculties/')) {
          targetTable = dbCache.faculties
        }
        if (path.includes('/departments/')) {
          targetTable = dbCache.departments
        }
        if (path.includes('/fields-of-study/')) {
          targetTable = dbCache.fieldsOfStudy
        }
        if (path.includes('/student-groups/')) {
          targetTable = dbCache.studentGroups
        }

        if (targetTable) {
          const index = targetTable.findIndex((item: any) => item.id === id)
          if (index > -1) {
            targetTable.splice(index, 1) // Удаляем из кэша
            return { success: true } as T
          }
        }
        throw new Error('Item not found for deletion')
      }
    }
    // ==============================================================

    // ==============================================================
    // 🛑 БЛОК TEACHER COURSES (MOCK)
    // ==============================================================
    if (path.startsWith('/teacher/courses')) {
      // GET: Получение списка курсов
      if (method === 'GET') {
        if (!dbCache.courses) {
          const res = await fetch('/mock-data/courses.json')
          if (!res.ok) {
            throw new Error(`Failed to load mock data: ${res.status}`)
          }
          dbCache.courses = await res.json()
        }
        return dbCache.courses as T
      }

      // POST: Создание нового курса
      if (method === 'POST' && options.body) {
        const newCourse = JSON.parse(options.body as string)
        newCourse.id = `course-${Date.now()}` // Фейковый ID
        dbCache.courses = dbCache.courses || []
        // Добавляем в начало списка
        dbCache.courses.unshift(newCourse)
        return newCourse as T
      }

      // PATCH: Обновление курса (например, перевод из Draft в Active)
      if (method === 'PATCH' && options.body) {
        const id = path.split('/').pop() // Достаем ID из /teacher/courses/course-1
        const updates = JSON.parse(options.body as string)

        if (dbCache.courses) {
          const index = dbCache.courses.findIndex((c: any) => c.id === id)
          if (index > -1) {
            dbCache.courses[index] = { ...dbCache.courses[index], ...updates }
            return dbCache.courses[index] as T
          }
        }
        throw new Error('Course not found in mock DB')
      }

      // DELETE: Удаление курса (на будущее)
      if (method === 'DELETE') {
        const id = path.split('/').pop()
        if (dbCache.courses) {
          const index = dbCache.courses.findIndex((c: any) => c.id === id)
          if (index > -1) {
            dbCache.courses.splice(index, 1)
            return { success: true } as T
          }
        }
        throw new Error('Course not found for deletion')
      }
    }

    // ==============================================================
    // 🛑 БЛОК QUESTION BANKS (MOCK)
    // ==============================================================
    if (path.startsWith('/teacher/question-banks')) {
      if (method === 'GET') {
        if (!dbCache.questionBanks) {
          const res = await fetch('/mock-data/question-banks.json')
          if (!res.ok) {
            throw new Error(`Failed to load mock data: ${res.status}`)
          }
          dbCache.questionBanks = await res.json()
        }
        return dbCache.questionBanks as T
      }

      // POST: Создание нового банка
      if (method === 'POST' && path === '/teacher/question-banks' && options.body) {
        const newBank = JSON.parse(options.body as string)
        newBank.id = `bank-${Date.now()}`
        newBank.questions = []
        newBank.questionsCount = 0
        dbCache.questionBanks = dbCache.questionBanks || []
        dbCache.questionBanks.unshift(newBank)
        return newBank as T
      }

      // PATCH: Обновление банка или добавление/редактирование вопроса
      if (method === 'PATCH' && options.body) {
        const urlParts = path.split('/')
        const bankId = urlParts[3] // /teacher/question-banks/:bankId
        const updates = JSON.parse(options.body as string)

        const bankIndex = dbCache.questionBanks.findIndex((b: any) => b.id === bankId)
        if (bankIndex > -1) {
          const bank = dbCache.questionBanks[bankIndex]
          
          // Если прилетел объект с вопросом (создание или апдейт)
          if (updates.question) {
            const qData = updates.question
            if (qData.id) {
              // Редактирование вопроса
              const qIndex = bank.questions.findIndex((q: any) => q.id === qData.id)
              if (qIndex > -1) bank.questions[qIndex] = { ...bank.questions[qIndex], ...qData }
            } else {
              // Создание нового вопроса
              qData.id = `q-${Date.now()}`
              bank.questions.push(qData)
              bank.questionsCount = bank.questions.length
            }
          } else {
            // Обновление самого банка (например title)
            dbCache.questionBanks[bankIndex] = { ...bank, ...updates }
          }
          return dbCache.questionBanks[bankIndex] as T
        }
        throw new Error('Bank not found')
      }
    }

    // ✅ БЛОК ДЛЯ РЕАЛЬНОГО БЭКЕНДА (Сейчас закомментирован)
    /*
    const baseUrl = 'https://api.university.com/v1';
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...options.headers,
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    // Читаем ответ как текст, чтобы безопасно распарсить
    const text = await response.text();
    if (!text) return {} as T; // Обработка пустых ответов (204 No Content)

    try {
      return JSON.parse(text) as T;
    } catch (e) {
      throw new Error('Некорректный формат ответа от сервера (Ожидался JSON)');
    }
    */

    throw new Error(`Endpoint not found or not mocked: ${endpoint}`)
  } catch (error: any) {
    const notifications = useNotifications()
    // ГЛОБАЛЬНАЯ ОБРАБОТКА ОШИБОК
    // Показываем красивый Toast пользователю
    notifications.showToast(
      'error',
      'Ошибка сети',
      error.message || 'Произошла непредвиденная ошибка'
    )
    // Пробрасываем ошибку дальше, чтобы стор (Pinia) мог остановить лоадер
    throw error
  }
}
