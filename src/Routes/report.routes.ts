import { Router } from 'express'
import {
  getUsersWithMostCourses,
  getCourseWithMostContents,
  getCoursesMetrics,
  getContentsWithCourseName,
  getUsersWhoWatchedContent
} from '../controllers/report.controller'

const reportRoutes = Router()

reportRoutes.get('/reports/users-most-courses', getUsersWithMostCourses)
reportRoutes.get('/reports/course-most-contents', getCourseWithMostContents)
reportRoutes.get('/reports/courses-metrics', getCoursesMetrics)
reportRoutes.get('/reports/contents-with-course', getContentsWithCourseName)
reportRoutes.get('/reports/watched-content/:contentId', getUsersWhoWatchedContent)

export { reportRoutes }