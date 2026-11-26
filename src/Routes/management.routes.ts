import { Router } from 'express'
import { prisma } from '../db'

export const managementRoutes = Router()

function readFields(body: unknown, fields: string[], creating: boolean) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new TypeError('Send a JSON object.')
  }

  const data: Record<string, string | null> = {}
  for (const field of fields) {
    const value = (body as Record<string, unknown>)[field]
    const optional = field === 'description' || field === 'status'
    if (value === undefined && (!creating || optional)) continue
    if (field === 'description' && value === null) {
      data[field] = null
      continue
    }
    if (typeof value !== 'string' || !value.trim()) {
      throw new TypeError(field + ' must be a non-empty string.')
    }
    data[field] = value.trim()
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new TypeError('Enter a valid email.')
  }
  if (data.status && !['active', 'inactive'].includes(data.status)) {
    throw new TypeError('Status must be active or inactive.')
  }
  if (!Object.keys(data).length) throw new TypeError('Send at least one field.')
  return data
}

const userFields = ["name","email","status"]

managementRoutes.get('/users', async (_req, res) => {
  res.json(await prisma.user.findMany({ orderBy: { createdAt: 'asc' } }))
})

managementRoutes.get('/users/:id', async (req, res) => {
  const item = await prisma.user.findUnique({ where: { id: req.params.id } })
  if (!item) return res.status(404).json({ error: 'Record not found.' })
  return res.json(item)
})

managementRoutes.post('/users', async (req, res) => {
  const data = readFields(req.body, userFields, true)
  const item = await prisma.user.create({
    data: {
      name: data.name!,
      email: data.email!,
      status: data.status ?? 'active',
    }
  })
  return res.status(201).json(item)
})

managementRoutes.patch('/users/:id', async (req, res) => {
  const data = readFields(req.body, userFields, false)
  const item = await prisma.user.update({ where: { id: req.params.id }, data })
  return res.json(item)
})

managementRoutes.delete('/users/:id', async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } })
  return res.sendStatus(204)
})

const courseFields = ["code","title","description","userId"]

managementRoutes.get('/courses', async (_req, res) => {
  res.json(await prisma.course.findMany({ orderBy: { createdAt: 'asc' } }))
})

managementRoutes.get('/courses/:id', async (req, res) => {
  const item = await prisma.course.findUnique({ where: { id: req.params.id } })
  if (!item) return res.status(404).json({ error: 'Record not found.' })
  return res.json(item)
})

managementRoutes.post('/courses', async (req, res) => {
  const data = readFields(req.body, courseFields, true)
  const item = await prisma.course.create({
    data: {
      code: data.code!,
      title: data.title!,
      userId: data.userId!,
      description: data.description ?? null,
    }
  })
  return res.status(201).json(item)
})

managementRoutes.patch('/courses/:id', async (req, res) => {
  const data = readFields(req.body, courseFields, false)
  const item = await prisma.course.update({ where: { id: req.params.id }, data })
  return res.json(item)
})

managementRoutes.delete('/courses/:id', async (req, res) => {
  await prisma.course.delete({ where: { id: req.params.id } })
  return res.sendStatus(204)
})

const moduleFields = ["courseId","title","description","userId"]

managementRoutes.get('/modules', async (_req, res) => {
  res.json(await prisma.module.findMany({ orderBy: { createdAt: 'asc' } }))
})

managementRoutes.get('/modules/:id', async (req, res) => {
  const item = await prisma.module.findUnique({ where: { id: req.params.id } })
  if (!item) return res.status(404).json({ error: 'Record not found.' })
  return res.json(item)
})

managementRoutes.post('/modules', async (req, res) => {
  const data = readFields(req.body, moduleFields, true)
  const item = await prisma.module.create({
    data: {
      courseId: data.courseId!,
      title: data.title!,
      userId: data.userId!,
      description: data.description ?? null,
    }
  })
  return res.status(201).json(item)
})

managementRoutes.patch('/modules/:id', async (req, res) => {
  const data = readFields(req.body, moduleFields, false)
  const item = await prisma.module.update({ where: { id: req.params.id }, data })
  return res.json(item)
})

managementRoutes.delete('/modules/:id', async (req, res) => {
  await prisma.module.delete({ where: { id: req.params.id } })
  return res.sendStatus(204)
})

const contentFields = ["moduleId","title","content"]

managementRoutes.get('/contents', async (_req, res) => {
  res.json(await prisma.content.findMany({ orderBy: { createdAt: 'asc' } }))
})

managementRoutes.get('/contents/:id', async (req, res) => {
  const item = await prisma.content.findUnique({ where: { id: req.params.id } })
  if (!item) return res.status(404).json({ error: 'Record not found.' })
  return res.json(item)
})

managementRoutes.post('/contents', async (req, res) => {
  const data = readFields(req.body, contentFields, true)
  const item = await prisma.content.create({
    data: {
      moduleId: data.moduleId!,
      title: data.title!,
      content: data.content!,
    }
  })
  return res.status(201).json(item)
})

managementRoutes.patch('/contents/:id', async (req, res) => {
  const data = readFields(req.body, contentFields, false)
  const item = await prisma.content.update({ where: { id: req.params.id }, data })
  return res.json(item)
})

managementRoutes.delete('/contents/:id', async (req, res) => {
  await prisma.content.delete({ where: { id: req.params.id } })
  return res.sendStatus(204)
})

managementRoutes.put('/users/:userId/watched/:contentId', async (req, res) => {
  const { userId, contentId } = req.params
  const entry = await prisma.userWatchedContent.upsert({
    where: { userId_contentId: { userId, contentId } },
    create: { userId, contentId },
    update: {}
  })
  return res.json(entry)
})
