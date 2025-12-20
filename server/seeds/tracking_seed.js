import mongoose from 'mongoose'
import dotenv from 'dotenv'
import DriverModel from '../models/driver.model.js'
import OrderModel from '../models/order.model.js'
import connectDB from '../config/connectDB.js'

dotenv.config()

const seedTracking = async () => {
    try {
        await connectDB()

        // Create Driver
        const driver = await DriverModel.create({
            name: "Test Driver",
            phone: "1234567890",
            status: "Available",
            currentLocation: {
                lat: 40.7128,
                lon: -74.0060,
                lastUpdated: new Date()
            }
        })
        console.log("Driver created:", driver._id)

        // Create Order
        const order = await OrderModel.create({
            orderId: "TRACK-" + Date.now(),
            driverId: driver._id,
            delivery_status: "Out for Delivery",
            subTotalAmt: 100,
            totalAmt: 110,
            product_details: {
                name: "Test Product",
                image: []
            }
        })
        console.log("Order created:", order.orderId)
        console.log("Order _id:", order._id)

        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

seedTracking()
