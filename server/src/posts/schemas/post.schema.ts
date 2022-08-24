import * as mongoose from 'mongoose'

export interface IPost {
  imageUrl: string
  text: string
  creatorId: mongoose.Types.ObjectId
  createdAt: Date
  likes_ids: mongoose.Types.ObjectId[]
}

export const PostSchema = new mongoose.Schema<IPost>({
  imageUrl: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  likes_ids: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    default: () => [],
  },
})
