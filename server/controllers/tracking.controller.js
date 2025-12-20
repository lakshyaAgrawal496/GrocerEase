import OrderModel from '../models/order.model.js'
import DriverAssignmentModel from '../models/driverAssignment.model.js'
import DriverModel from '../models/driver.model.js'

export const assignDriver = async (req, res) => {
    try {
        const { orderId, driverId } = req.body

        const order = await OrderModel.findOne({ _id: orderId })
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            })
        }

        const driver = await DriverModel.findById(driverId)
        if (!driver) {
            return res.status(404).json({
                message: "Driver not found",
                error: true,
                success: false
            })
        }

        // Update Order with Driver ID
        order.driverId = driverId
        order.delivery_status = 'Shipped' // Or 'Assigned' if enum supported
        await order.save()

        // Create Assignment Record
        const assignment = new DriverAssignmentModel({
            driverId,
            orderId: order._id,
            status: 'active'
        })
        await assignment.save()

        // Notify User via Socket (if connected)
        const io = req.app.get('io')
        io.to(`order_${orderId}`).emit('driver_assigned', {
            driverId,
            driverName: driver.name,
            vehicle: driver.vehicle // Assuming vehicle field exists or will be added
        })

        return res.json({
            message: "Driver assigned successfully",
            data: assignment,
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
