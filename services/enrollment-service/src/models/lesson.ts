import { Schema, model, Types } from 'mongoose'

export interface Lesson {
  title: string
  content?: string
  videoUrl?: string
  course: Types.ObjectId
  order?: number
  createdAt: Date
}

const lessonSchema = new Schema<Lesson>({
  title: { type: String, required: true },
  content: { type: String },
  videoUrl: { type: String },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  order: { type: Number },
  createdAt: { type: Date, default: Date.now },
})

export const LessonModel = model<Lesson>('Lesson', lessonSchema)
