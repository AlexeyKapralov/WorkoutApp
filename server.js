import 'colors'
import express from "express"
import authRoutes from './app/auth/auth.routes.js'
import userRoutes from './app/user/user.routes.js'
import exerciseRoutes from './app/exercise/exercise.routes.js'
import workoutRoutes from './app/workout/workout.routes.js'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import { prisma } from './app/prisma.js'
import asyncHandler from 'express-async-handler'
import { NotFound, errorHandler } from './app/middleware/error.middleware.js'

dotenv.config()

const app = express()

async function main(){
  if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
  
  app.use(express.json())

  const __dirname = path.resolve()

  app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

  app.use('/api/auth', authRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/exercises', exerciseRoutes)
  app.use('/api/workouts', workoutRoutes)

  app.use(NotFound)
  app.use(errorHandler)

  const PORT = process.env.PORT || 5000

  app.listen(
    PORT, 
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold
    )
  )
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })