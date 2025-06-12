import { Schema, model, Types } from 'mongoose'

export interface Comment {
  user: Types.ObjectId
  lesson: Types.ObjectId
  text: string
}

const commentSchema = new Schema<Comment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User ', required: true },
    lesson: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    text: { type: String, required: true, maxlength: 255 },
  },
  { timestamps: true }
)

export const CommentModel = model<Comment>('Comment', commentSchema)
