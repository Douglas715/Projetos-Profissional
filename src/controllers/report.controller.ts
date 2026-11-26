import { Request, Response } from 'express'
import { prisma } from '../db'

// SQL 01: Users ordered by the number of courses.
export const getUsersWithMostCourses = async (req: Request, res: Response) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        COUNT(c.id)::int AS total_courses
      FROM users u
      LEFT JOIN courses c ON c.user_id = u.id
      GROUP BY u.id, u.name, u.email
      ORDER BY total_courses DESC, u.name, u.id;
    `
    return res.json(result)
  } catch (error) {
    return res.status(500).json({ error: 'Could not load report.' })
  }
}

// SQL 02: Course with the most contents.
export const getCourseWithMostContents = async (req: Request, res: Response) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        c.id, 
        c.title, 
        COUNT(cnt.id)::int AS total_contents
      FROM courses c
      LEFT JOIN modules m ON m.course_id = c.id
      LEFT JOIN contents cnt ON cnt.module_id = m.id
      GROUP BY c.id, c.title
      ORDER BY total_contents DESC, c.title, c.id
      LIMIT 1;
    `
    return res.json(result)
  } catch (error) {
    return res.status(500).json({ error: 'Could not load report.' })
  }
}

// SQL 03: Module and content totals for every course.
export const getCoursesMetrics = async (req: Request, res: Response) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        c.id AS course_id,
        c.title AS course_title,
        COUNT(DISTINCT m.id)::int AS total_modules,
        COUNT(DISTINCT cnt.id)::int AS total_contents
      FROM courses c
      LEFT JOIN modules m ON m.course_id = c.id
      LEFT JOIN contents cnt ON cnt.module_id = m.id
      GROUP BY c.id, c.title
      ORDER BY c.title ASC;
    `
    return res.json(result)
  } catch (error) {
    return res.status(500).json({ error: 'Could not load report.' })
  }
}

// SQL 04: Contents with their course names.
export const getContentsWithCourseName = async (req: Request, res: Response) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        cnt.id AS content_id,
        cnt.title AS content_title,
        c.title AS course_title
      FROM contents cnt
      INNER JOIN modules m ON m.id = cnt.module_id
      INNER JOIN courses c ON c.id = m.course_id
      ORDER BY c.title, cnt.title;
    `
    return res.json(result)
  } catch (error) {
    return res.status(500).json({ error: 'Could not load report.' })
  }
}

// SQL 05: Users who watched the selected content.
export const getUsersWhoWatchedContent = async (req: Request, res: Response) => {
  const { contentId } = req.params

  try {
    const result = await prisma.$queryRaw`
      SELECT 
        u.id AS user_id,
        u.name,
        u.email,
        cnt.title AS content_title,
        uwc.watched_at
      FROM users u
      INNER JOIN user_watched_contents uwc ON uwc.user_id = u.id
      INNER JOIN contents cnt ON cnt.id = uwc.content_id
      WHERE cnt.id = ${contentId};
    `
    return res.json(result)
  } catch (error) {
    return res.status(500).json({ error: 'Could not load report.' })
  }
}