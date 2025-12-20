import mongoose from 'mongoose'
import dotenv from 'dotenv'
import OrderModel from './models/order.model.js'
import connectDB from './config/connectDB.js'

dotenv.config()

const checkOrders = async () => {
    try {
        await connectDB()
        const orders = await OrderModel.find({})
        console.log("Orders found:", orders.length)
        orders.forEach(o => console.log(o.orderId, o.driverId))
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

checkOrders()
