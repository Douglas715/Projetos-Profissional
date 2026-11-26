import { prisma } from '../src/db'

async function seed() {
  await prisma.$transaction(async (db) => {
    const names = ['Alan Turing', 'Ada Lovelace', 'Grace Hopper', 'Linus Torvalds', 'Margaret Hamilton']
    const users = []
    for (const name of names) {
      const email = name.toLowerCase().replaceAll(' ', '.') + '@example.com'
      const legacyEmail = name.split(' ')[0]!.toLowerCase() + '@test.com'
      const existing = await db.user.findUnique({ where: { email: legacyEmail } })
      users.push(existing ?? await db.user.upsert({ where: { email }, update: {}, create: { name, email } }))
    }

    const courses = [
      { code: 'NODE-101', title: 'Node.js Basics', modules: 5, lessons: 3, author: users[0]! },
      { code: 'REACT-202', title: 'React Basics', modules: 3, lessons: 5, author: users[0]! },
      { code: 'SQL-303', title: 'PostgreSQL Basics', modules: 2, lessons: 4, author: users[1]! },
      { code: 'GIT-404', title: 'Git Basics', modules: 1, lessons: 2, author: users[2]! },
      { code: 'WEB-505', title: 'Web Basics', modules: 1, lessons: 1, author: users[3]! }
    ]

    for (const course of courses) {
      const saved = await db.course.upsert({
        where: { code: course.code },
        update: {},
        create: { code: course.code, title: course.title, userId: course.author.id }
      })

      const existingModules = await db.module.findMany({
        where: { courseId: saved.id },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }]
      })

      for (let number = 1; number <= course.modules; number++) {
        const moduleId = existingModules[number - 1]?.id ?? course.code + '-module-' + number
        await db.module.upsert({
          where: { id: moduleId },
          update: {},
          create: { id: moduleId, courseId: saved.id, userId: course.author.id, title: 'Module ' + number }
        })
        const existingContents = await db.content.findMany({
          where: { moduleId },
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }]
        })
        for (let lesson = existingContents.length + 1; lesson <= course.lessons; lesson++) {
          const lessonNumber = (number - 1) * course.lessons + lesson
          const id = course.code === 'NODE-101' ? String(lessonNumber) : course.code + '-lesson-' + lessonNumber
          await db.content.upsert({
            where: { id },
            update: {},
            create: { id, moduleId, title: 'Lesson ' + lessonNumber, content: 'Practice for ' + course.title }
          })
        }
      }
    }

    const demoLesson = await db.content.findUnique({ where: { id: '2' } })
    if (!demoLesson) {
      const module = await db.module.findFirst({ where: { course: { code: 'NODE-101' } } })
      if (!module) throw new Error('Demo module was not found.')
      await db.content.create({
        data: { id: '2', moduleId: module.id, title: 'Demo lesson', content: 'Practice for Node.js Basics' }
      })
    }

    for (const [index, user] of users.entries()) {
      const lesson = await db.content.findFirst({
        where: index < 3 ? { id: '2' } : { id: { not: '2' } },
        orderBy: { id: 'asc' }
      })
      if (!lesson) throw new Error('Demo lesson was not found.')
      const contentId = lesson.id
      await db.userWatchedContent.upsert({
        where: { userId_contentId: { userId: user.id, contentId } },
        update: {},
        create: { userId: user.id, contentId }
      })
    }
  }, { timeout: 60000 })
}

seed()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
