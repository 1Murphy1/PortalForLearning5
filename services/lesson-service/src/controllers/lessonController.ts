import { Request, Response } from 'express'
import { LessonModel } from '../models/lesson'

const getLessons = async (req: Request, res: Response): Promise<void> => {
  try {
    const lessons = await LessonModel.find().populate('course')
    res.status(200).json(lessons)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

const getLessonById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const lesson = await LessonModel.findById(id).populate('course')
    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' })
      return
    }
    res.status(200).json(lesson)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

const createLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, videoUrl, course, order } = req.body
    const newLesson = new LessonModel({
      title,
      content,
      videoUrl,
      course,
      order,
    })
    await newLesson.save()
    res.status(201).json(newLesson)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

const updateLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const updatedLesson = await LessonModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!updatedLesson) {
      res.status(404).json({ message: 'Lesson not found' })
      return
    }
    res.status(200).json(updatedLesson)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

const deleteLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const deletedLesson = await LessonModel.findByIdAndDelete(id)
    if (!deletedLesson) {
      res.status(404).json({ message: 'Lesson not found' })
      return
    }
    res.status(200).json({ message: 'Lesson deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

const getLessonWithComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const lesson = await LessonModel.findById(id)
      .populate('course')
      .populate('comments')

    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' })
      return
    }
    res.status(200).json(lesson)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export const lessonController = {
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonWithComments,
}
