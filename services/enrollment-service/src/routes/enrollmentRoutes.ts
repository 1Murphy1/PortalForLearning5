import { Router } from 'express'
import { enrollmentController } from '../controllers/enrollmentController'
import { authenticateJWT } from '../middlewares/authMiddleware'

const router = Router()

router.post('/enrollments', authenticateJWT, enrollmentController.enrollInCourse)
router.post('/enrollments/complete', authenticateJWT, enrollmentController.completeLesson)
router.post('/enrollments/uncomplete', authenticateJWT, enrollmentController.uncompleteLesson)
router.get('/enrollments/:courseId', authenticateJWT, enrollmentController.getEnrollmentProgress)
router.get('/courses/:courseId/enrollments', authenticateJWT, enrollmentController.getCourseEnrollments)

export const enrollmentRoutes = router