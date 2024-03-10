import express from "express"
import { createNewWorkout, deleteWorkout, getWorkouts, updateWorkout, getWorkout } from "./workout.controller.js"
import { protect } from "../middleware/auth.middleware.js"


const router = express.Router()

router.route('/').post(protect, createNewWorkout).get(protect, getWorkouts)
router
  .route('/:id')
  .get(protect, getWorkout)
  .put(protect, updateWorkout)
  .delete(protect, deleteWorkout)

export default router