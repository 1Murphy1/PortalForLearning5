import { Request, Response } from 'express'
import { CommentModel } from '../models/comment'

const getCommentsByLessonId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { lessonId } = req.params
    const comments = await CommentModel.find({ lesson: lessonId }).populate(
      'user'
    )
    res.status(200).json(comments)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.params
    const { text } = req.body
    const newComment = new CommentModel({
      user: req.userId,
      lesson: lessonId,
      text,
    })
    await newComment.save()
    res.status(201).json(newComment)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

const updateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const updatedComment = await CommentModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!updatedComment) {
      res.status(404).json({ message: 'Comment not found' })
      return
    }
    res.status(200).json(updatedComment)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const deletedComment = await CommentModel.findByIdAndDelete(id)
    if (!deletedComment) {
      res.status(404).json({ message: 'Comment not found' })
      return
    }
    res.status(200).json({ message: 'Comment deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export const commentController = {
  getCommentsByLessonId,
  createComment,
  updateComment,
  deleteComment,
}
