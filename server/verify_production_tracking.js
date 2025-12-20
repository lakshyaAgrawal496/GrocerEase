import io from 'socket.io-client';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

const ORDER_ID = 'demo123';
const DRIVER_ID = '673e5a1b2c3d4e5f6a7b8c9d'; // Use a valid ID from your DB or seed

async function runTest() {
    console.log('🚀 Starting Production Tracking Verification...');

    // 1. Setup Socket Clients
    const userSocket = io(SOCKET_URL);
    const driverSocket = io(SOCKET_URL);

    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. Join Rooms
    console.log('📡 Joining Rooms...');
    userSocket.emit('join_order', ORDER_ID);
    driverSocket.emit('join_driver', DRIVER_ID);

    // 3. Listen for Updates
    userSocket.on('tracking:update', (data) => {
        console.log('✅ User received tracking update:', data);
        if (data.type === 'driver' && data.lat === 28.6350) {
            console.log('🎉 Verification SUCCESS: Driver location propagated to User!');
            process.exit(0);
        }
    });

    // 4. Simulate Driver Location Update via Socket
    console.log('🚚 Sending Driver Location Update...');
    driverSocket.emit('driver:location:update', {
        driverId: DRIVER_ID,
        orderId: ORDER_ID,
        lat: 28.6350,
        lon: 77.3750,
        heading: 90,
        speed: 40
    });

    // Timeout fallback
    setTimeout(() => {
        console.error('❌ Verification FAILED: Timeout waiting for update.');
        process.exit(1);
    }, 5000);
}

runTest();
