import mongoose from "mongoose";

const driverAssignmentSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.ObjectId,
        ref: 'driver',
        required: true
    },
    orderId: {
        type: String, // Using String to match orderId in Order model, or ObjectId if ref. Order model has orderId as String and _id as ObjectId. Let's use ref to _id for better linking.
        ref: 'order', // Assuming the model name is 'order'
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    assignedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for quick lookups of active assignments
driverAssignmentSchema.index({ driverId: 1, status: 1 });
driverAssignmentSchema.index({ orderId: 1 });

const DriverAssignmentModel = mongoose.model('driverAssignment', driverAssignmentSchema);

export default DriverAssignmentModel;
