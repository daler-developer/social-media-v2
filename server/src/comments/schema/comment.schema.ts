import * as mongoose from 'mongoose'

export interface IComment {
  text: string
  creatorId: mongoose.Types.ObjectId
  postId: mongoose.Types.ObjectId
  createdAt: Date
}

export const CommentSchema = new mongoose.Schema<IComment>(
  {
    text: {
      type: String,
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  { versionKey: false }
)
