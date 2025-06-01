import { Request, Response } from 'express'
import { EnrollmentModel } from '../models/enrollment'
import { CourseModel } from '../models/course'
import { LessonModel } from '../models/lesson'
import mongoose from 'mongoose'
import { UserModel } from '../models/user'

const enrollInCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.body
    const userId = req.userId

    if (!courseId) {
      res.status(400).json({ message: 'Course ID is required' })
      return
    }

    const course = await CourseModel.findById(courseId)
    if (!course) {
      res.status(404).json({ message: 'Course not found' })
      return
    }

    const existingEnrollment = await EnrollmentModel.findOne({ user: userId, course: courseId })
    if (existingEnrollment) {
      res.status(400).json({ message: 'Already enrolled in this course' })
      return
    }

    const enrollment = new EnrollmentModel({
      user: userId,
      course: courseId,
      completedLessons: [],
      progress: 0
    })

    await UserModel.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId }
    })

    await enrollment.save()

    res.status(201).json(enrollment)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

const completeLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.body
    const userId = req.userId

    if (!lessonId) {
      res.status(400).json({ message: 'Lesson ID is required' })
      return
    }

    const lesson = await LessonModel.findById(lessonId)
    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' })
      return
    }

    const enrollment = await EnrollmentModel.findOne({
      user: userId,
      course: lesson.course
    })

    if (!enrollment) {
      res.status(404).json({ message: 'Not enrolled in this course' })
      return
    }

    if (enrollment.completedLessons.includes(lesson._id)) {
      res.status(400).json({ message: 'Lesson already completed' })
      return
    }

    enrollment.completedLessons.push(lesson._id)

    const totalLessons = await LessonModel.countDocuments({ course: lesson.course })
    const newProgress = Math.round((enrollment.completedLessons.length / totalLessons) * 100)
    enrollment.progress = newProgress

    await enrollment.save()

    res.status(200).json(enrollment)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

const uncompleteLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.body
    const userId = req.userId

    if (!lessonId) {
      res.status(400).json({ message: 'Lesson ID is required' })
      return
    }

    const lesson = await LessonModel.findById(lessonId)
    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' })
      return
    }

    const enrollment = await EnrollmentModel.findOne({
      user: userId,
      course: lesson.course
    })

    if (!enrollment) {
      res.status(404).json({ message: 'Not enrolled in this course' })
      return
    }

    const lessonIndex = enrollment.completedLessons.indexOf(lesson._id)
    if (lessonIndex === -1) {
      res.status(400).json({ message: 'Lesson not completed yet' })
      return
    }

    enrollment.completedLessons.splice(lessonIndex, 1)

    const totalLessons = await LessonModel.countDocuments({ course: lesson.course })
    const newProgress = totalLessons > 0 
      ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
      : 0
    enrollment.progress = newProgress

    await enrollment.save()

    res.status(200).json(enrollment)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

const getEnrollmentProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params
    const userId = req.userId

    if (!courseId) {
      res.status(400).json({ message: 'Course ID is required' })
      return
    }

    const enrollment = await EnrollmentModel.findOne({
      user: userId,
      course: courseId
    }).populate('completedLessons')

    if (!enrollment) {
      res.status(404).json({ message: 'Not enrolled in this course' })
      return
    }

    res.status(200).json(enrollment)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

const getCourseEnrollments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      res.status(400).json({ message: 'Invalid course ID' })
      return
    }

    const enrollments = await EnrollmentModel.find({ course: courseId })
      .populate('user', 'firstName lastName username')
      .select('user progress enrolledAt')

    const count = await EnrollmentModel.countDocuments({ course: courseId })

    res.status(200).json({ count, enrollments })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export const enrollmentController = {
  enrollInCourse,
  completeLesson,
  uncompleteLesson,
  getEnrollmentProgress,
  getCourseEnrollments
}