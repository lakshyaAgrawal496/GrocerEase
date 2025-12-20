import mongoose from 'mongoose'
import dotenv from 'dotenv'
import DriverModel from './models/driver.model.js'
import OrderModel from './models/order.model.js'
import connectDB from './config/connectDB.js'

dotenv.config()

const createDemo = async () => {
    try {
        await connectDB()

        // Create or find a driver
        let driver = await DriverModel.findOne({ name: "Demo Driver" })
        if (!driver) {
            driver = await DriverModel.create({
                name: "Demo Driver",
                phone: "9876543210",
                status: "Busy",
                currentLocation: {
                    lat: 28.6139,
                    lon: 77.2090,
                    lastUpdated: new Date()
                }
            })
            console.log("✓ Created driver:", driver._id)
        } else {
            console.log("✓ Using existing driver:", driver._id)
        }

        // Create a demo order
        const order = await OrderModel.create({
            orderId: "DEMO-" + Date.now(),
            driverId: driver._id,
            delivery_status: "Shipped",
            subTotalAmt: 250,
            totalAmt: 275,
            product_details: {
                name: "Fresh Groceries",
                image: []
            }
        })

        console.log("\n=== DEMO READY ===")
        console.log("Order ID:", order._id)
        console.log("Order Number:", order.orderId)
        console.log("\nOpen this URL in your browser:")
        console.log(`http://localhost:5173/order-tracking/${order._id}`)
        console.log("\nDriver location: New Delhi (28.6139, 77.2090)")

        process.exit(0)
    } catch (error) {
        console.error("Error:", error)
        process.exit(1)
    }
}

createDemo()
