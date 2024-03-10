
import asyncHandler from "express-async-handler"
import { prisma } from "../prisma.js"
import { UserFields } from "../utils/user.utils.js"

// @desc create new workout
//@route POST /api/workout
//@access Private
export const createNewWorkout = asyncHandler(async (req, res) => {

  const {name, exerciseIds} = req.body

  const workout  = await prisma.workout.create({
    data: {
      name, 
      exercises: {
        connect: exerciseIds.map(id => ({id: +id}))
      }
    }
  })

  res.json({workout})

})


// @desc get workouts
//@route GET /api/workout
//@access Private
export const getWorkouts = asyncHandler(async (req, res) => {

  const workouts  = await prisma.workout.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      exercises: true
    }
  })

  res.json(workouts)

})

// @desc get workout
//@route GET /api/workout
//@access Private
export const getWorkout = asyncHandler(async (req, res) => {

  const workout  = await prisma.workout.findUnique({
    where: { id : +req.params.id },
    include: {
      exercises: true
    }
  })

  if (!workout) {
    res.status(404)
    throw new Error('Workout not found!')
  }

  const minutes = Math.ceil(workout.exercises.length * 3.7)

  res.json({...workout, minutes})

})

// @desc update workout
//@route PUT /api/workout/:id
//@access Private
export const updateWorkout = asyncHandler(async (req, res) => {

  const {name, exerciseIds} = req.body

  try {
      
    const workout  = await prisma.workout.update({
      where: {
        id: +req.params.id
      },
      data: {
        name, 
        exercises:{
          set: exerciseIds.map(id => ({id: +id}))
        }
      }
    })

    res.json({workout})
  } catch (error) {
    res.status(404)
    throw new Error('Workout not found!')
  }
})

// @desc delete workout
//@route DELETE /api/workout/:id
//@access Private
export const deleteWorkout = asyncHandler(async (req, res) => {


  try {
      
    const workout  = await prisma.workout.delete({
      where: {
        id: +req.params.id
      }
    })

    res.json({message: 'Workout deleted!'})
  } catch (error) {
    res.status(404)
    throw new Error('Workout not found!')
  }
})