import { Router } from 'express'
import { commentController } from '../controllers/commentController'
import { authenticateJWT } from '../middlewares/authMiddleware'

const router = Router();


router.get('/comments/lessons/:lessonId', commentController.getCommentsByLessonId)
router.post('/comments/lessons/:lessonId', authenticateJWT, commentController.createComment)
router.put('/comments/:id', authenticateJWT, commentController.updateComment)
router.delete('/comments/:id', authenticateJWT, commentController.deleteComment)

export const commentRoutes = router
