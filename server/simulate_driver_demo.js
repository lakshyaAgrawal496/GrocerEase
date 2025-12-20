import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');
const driverId = '673e5a1b2c3d4e5f6a7b8c9d';
const orderId = 'demo123';

socket.on('connect', () => {
    console.log('Driver connected:', socket.id);
    socket.emit('join_driver', driverId);

    // Go Online
    socket.emit('driver:status:update', { driverId, orderId, status: 'online' });

    console.log('Driver is online. Starting simulation...');

    let currentLat = 28.5455;
    let currentLon = 77.4010;
    let step = 0;

    setInterval(() => {
        // Move towards House (28.5355, 77.3910)
        step += 0.05;
        if (step > 1) step = 0;

        const targetLat = 28.5355;
        const targetLon = 77.3910;

        const newLat = currentLat + (targetLat - currentLat) * 0.05;
        const newLon = currentLon + (targetLon - currentLon) * 0.05;

        currentLat = newLat;
        currentLon = newLon;

        const speed = 30 + Math.random() * 10;
        const heading = 180;

        console.log(`Emitting location: ${currentLat.toFixed(4)}, ${currentLon.toFixed(4)}`);

        socket.emit('driver:location:update', {
            driverId,
            orderId,
            lat: currentLat,
            lon: currentLon,
            heading,
            speed: speed / 3.6,
            status: 'online'
        });

        if (step === 0) {
            console.log('Journey completed (looped).');
        }

    }, 1000);
});

socket.on('disconnect', () => {
    console.log('Driver disconnected');
});
