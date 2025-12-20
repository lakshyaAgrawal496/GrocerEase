import DriverModel from '../models/driver.model.js'
import OrderModel from '../models/order.model.js'

export const updateDriverLocation = async (req, res) => {
    try {
        const { driverId, lat, lon } = req.body

        const driver = await DriverModel.findByIdAndUpdate(driverId, {
            currentLocation: {
                lat,
                lon,
                lastUpdated: new Date()
            }
        }, { new: true })

        if (!driver) {
            return res.status(404).json({
                message: "Driver not found",
                error: true,
                success: false
            })
        }

        // Find active orders for this driver and emit updates
        const activeOrders = await OrderModel.find({ driverId, delivery_status: { $in: ['Shipped', 'Out for Delivery'] } })

        const io = req.app.get('io')
        activeOrders.forEach(order => {
            io.to(`order_${order._id}`).emit('driver_location_update', {
                lat,
                lon,
                driverId,
                updatedAt: new Date()
            })
        })

        return res.json({
            message: "Location updated",
            data: driver,
            success: true,
            error: false
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const createDriver = async (req, res) => {
    try {
        const { name, phone } = req.body
        const driver = new DriverModel({ name, phone })
        await driver.save()
        return res.json({
            message: "Driver created",
            data: driver,
            success: true,
            error: false
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
