import { Document, model, Model as mModel, Mongoose, Schema as mSchema } from 'mongoose'
import { Point } from 'geojson'
import { logger } from '../../services'

const Schema: mSchema = new mSchema({
  password: { type: String, required: true },
  email: { type: String, required: true },
  pictureURL: { type: String, required: false },
  resetToken: { type: String },
  isVerified: { type: Boolean, default: false },
  location: {},
})

Schema.statics.createAsync = async (params: IAttributes): Promise<IUser> => {
  const point = new Model(params)

  try {
      await point.save()       // mongoose Document methods are available
  } catch (error) {
      logger.info(`CATCH CREATE POINT ==> ${error}`)
  }

  return point
}

Schema.statics.getOneAsync = async (id: string): Promise<IUser | null> => {
  const user = Model.findById(id)
  return user
}

Schema.statics.getManyAsync = async (where: object, sort: object, limit: number): Promise<IUser[]> => {
  let users = Model.find(where)
  if (sort) {
    users = users.sort(sort)
  }
  if (limit) {
    users = users.limit(limit)
  }
  return users
}

Schema.statics.deleteAsync = async (where: object): Promise<any> => {
  return Model.findOneAndRemove(where)
}

interface IUser extends Document {
  id: string
  password: string
  email: string
  pictureURL: string
  resetToken: string
  isVerified: boolean
  location: Point
}

interface IUserModel extends mModel<IUser> {
  createAsync: (params: IAttributes) => IUser
  getOneAsync: (id: string) => IUser
  getManyAsync: (where: object) => IUser[]
  deleteManyAsync: (where: object) => Promise<void>
}

let Model: IUserModel

function define(db: Mongoose) {
  Model = db.model<IUser, IUserModel>('User', Schema, 'users')
}

interface IAttributes {
  type: string
  serviceId: string
  userId: string
  title: string
  subtitle: string
  content: [{
      type: string,
      title?: string,
      data: [object],
  }]
}

export { IUser, Model, define, Schema }
