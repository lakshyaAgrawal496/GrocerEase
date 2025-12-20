import { Router } from 'express'
import { assignDriver } from '../controllers/tracking.controller.js'

const trackingRouter = Router()

trackingRouter.post('/assign-driver', assignDriver)

export default trackingRouter
