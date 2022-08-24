import * as mongoose from 'mongoose'

export interface IUser {
  _id: mongoose.Types.ObjectId
  username: string
  firstName: string
  lastName: string
  password: string
  followers_ids: mongoose.Schema.Types.ObjectId[]
  bio?: string
  avatarUrl?: string
}

export const UserSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: false,
      default: () => '',
    },
    avatarUrl: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    followers_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      default: () => [],
    },
  },
  { versionKey: false }
)

const User = mongoose.model<IUser>('user', UserSchema)
