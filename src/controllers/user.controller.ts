import { NextFunction } from 'express'
import { Request, Response } from 'express'
import { ResponseHandler } from '../utils'
import { BadRequestError } from '../middlewares'
import { findUserById } from '../helpers/user.helper'

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = 'await prisma.user.findMany()'
    ResponseHandler.success(res, users, 200, 'Users fetched succesfully')
  } catch (error) {
    console.error('Error getting users:', error)
    next(error)
  }
}

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id
  try {
    const user = await findUserById(userId)

    if (!user) {
      throw new BadRequestError(`User with id ${userId} not found`)
    } else {
      ResponseHandler.success(res, user, 200, 'User fetched successfully')
    }
  } catch (error) {
    return next(error)
  }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body
    const userId = req.params.id

    if(!userId) {
      throw new BadRequestError(`No user id found`)
    }

    const user = await findUserById(userId)

    if (!user) {
      throw new BadRequestError(`User with id ${userId} not found`)
    }
    
    if (!req.body) {
      throw new BadRequestError('No data provided in body')
    }

    for (const key in userData) {
      if (userData.hasOwnProperty(key)) {
        user[key] = userData[key]
      }
    }

    const updatedUser = "await prisma.user.update({"
      // "where: { userID: userId },"
      // data: user,
    // })
    ResponseHandler.success(res, updatedUser, 200, 'User updated successfully')
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id

    const user = await findUserById(userId)
    if (!user) {
      throw new BadRequestError(`User with id ${userId} not found`)
    }

    const deletedUser = "await prisma.user.delete({ where: { userID: userId } })"

    ResponseHandler.success(res, deletedUser, 200, 'User successfully deleted' )
  } catch (error) {
    next(error)
  }
}

export { getAllUsers, getUser, updateUser, deleteUser }
