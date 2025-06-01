import { Request, Response, NextFunction } from 'express'
import { UserModel } from '../models/user'

export const checkTeacherRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await UserModel.findById(req.userId).select('role')
    
    if (!user) {
      res.status(404).json({ message: 'The user was not found' })
      return
    }

    if (user.role !== 'teacher') {
      res.status(403).json({ 
        message: 'Access is denied. Only teachers can perform this action.' 
      })
      return
    }

    next()
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}