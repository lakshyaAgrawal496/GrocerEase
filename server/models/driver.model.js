import mongoose from 'mongoose'

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Provide driver name']
    },
    phone: {
        type: String,
        required: [true, 'Provide driver phone']
    },
    avatar: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Available', 'Busy', 'Offline'],
        default: 'Offline'
    },
    currentLocation: {
        lat: Number,
        lon: Number,
        lastUpdated: Date
    }
}, {
    timestamps: true
})

const DriverModel = mongoose.model('driver', driverSchema)
export default DriverModel
