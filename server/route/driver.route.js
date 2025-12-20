import { Router } from 'express'
import { updateDriverLocation, createDriver } from '../controllers/driver.controller.js'
const driverRouter = Router()

driverRouter.post('/update-location', updateDriverLocation)
driverRouter.post('/create', createDriver)

export default driverRouter
