import { Schema, model, Types } from 'mongoose'

export interface Enrollment {
  user: Types.ObjectId
  course: Types.ObjectId
  completedLessons: Types.ObjectId[]
  progress: number
  enrolledAt: Date
}

const enrollmentSchema = new Schema<Enrollment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  progress: { type: Number, default: 0, min: 0, max: 100 },
  enrolledAt: { type: Date, default: Date.now }
})

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true })

export const EnrollmentModel = model<Enrollment>('Enrollment', enrollmentSchema)