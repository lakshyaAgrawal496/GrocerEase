import mongoose from 'mongoose'
import dotenv from 'dotenv'
import DriverModel from './models/driver.model.js'
import OrderModel from './models/order.model.js'
import connectDB from './config/connectDB.js'

dotenv.config()

const simulateMovement = async () => {
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
        }

        console.log("Simulating driver movement...")
        console.log("Driver ID:", driver._id)

        // Simulate movement from point A to point B
        const start = [28.6139, 77.2090]
        const end = [28.6300, 77.2200]
        const steps = 20

        for (let i = 0; i <= steps; i++) {
            const lat = start[0] + (end[0] - start[0]) * (i / steps)
            const lon = start[1] + (end[1] - start[1]) * (i / steps)

            // Update driver location via API (simulated by direct DB update for simplicity in this script, 
            // but normally would call the API. Here we just update DB to trigger potential watchers if implemented, 
            // but since we need to trigger Socket.IO, we should ideally call the API. 
            // However, calling the API requires a running server. 
            // Let's just print the curl command for the user to run or use fetch if we were in a browser/node environment with fetch polyfill)

            console.log(`Step ${i}/${steps}: Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`)

            // We can't easily trigger the socket event from here without connecting to the socket server or calling the API.
            // So we will just output the curl command.

            // await new Promise(r => setTimeout(r, 2000))
        }

        console.log("\nTo see movement, run this in a separate terminal while the server is running:")
        console.log(`
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function run() {
    const driverId = "${driver._id}";
    const start = [28.6139, 77.2090];
    const end = [28.6300, 77.2200];
    const steps = 20;

    for (let i = 0; i <= steps; i++) {
        const lat = start[0] + (end[0] - start[0]) * (i / steps);
        const lon = start[1] + (end[1] - start[1]) * (i / steps);
        
        try {
            await fetch('http://localhost:5000/api/driver/update-location', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ driverId, lat, lon })
            });
            console.log(\`Updated: \${lat}, \${lon}\`);
        } catch (e) {
            console.error(e);
        }
        await sleep(2000);
    }
}
run();
        `)

        process.exit(0)
    } catch (error) {
        console.error("Error:", error)
        process.exit(1)
    }
}

simulateMovement()
