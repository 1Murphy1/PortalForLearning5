import { Router } from 'express'
import { lessonController } from '../controllers/lessonController'
import { authenticateJWT } from '../middlewares/authMiddleware'
import { checkTeacherRole } from '../middlewares/roleMiddleware'

const router = Router()

router.get('/lessons', lessonController.getLessons)
router.get('/lessons/:id', lessonController.getLessonById)
router.get('/lessons/:id/comments', lessonController.getLessonWithComments)

// router.post('/lessons', authenticateJWT, lessonController.createLesson)
// router.put('/lessons/:id', authenticateJWT, lessonController.updateLesson)
// router.delete('/lessons/:id', authenticateJWT, lessonController.deleteLesson)

router.post('/lessons', authenticateJWT, checkTeacherRole, lessonController.createLesson)
router.put('/lessons/:id', authenticateJWT, checkTeacherRole, lessonController.updateLesson)
router.delete('/lessons/:id', authenticateJWT, checkTeacherRole, lessonController.deleteLesson)

export const lessonRoutes = router
