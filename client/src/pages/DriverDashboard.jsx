import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'

const DriverDashboard = () => {
    const [isOnline, setIsOnline] = useState(false)
    const [status, setStatus] = useState('Offline')
    const [socket, setSocket] = useState(null)
    const [location, setLocation] = useState(null)
    const [driverId, setDriverId] = useState('673e5a1b2c3d4e5f6a7b8c9d') // Hardcoded for demo
    const [activeOrderId, setActiveOrderId] = useState('demo123') // Default demo ID
    const watchIdRef = useRef(null)

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000')
        setSocket(newSocket)

        newSocket.emit('join_driver', driverId)

        return () => {
            newSocket.close()
            if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current)
        }
    }, [driverId])

    const toggleOnline = () => {
        if (isOnline) {
            // Go Offline
            setIsOnline(false)
            setStatus('Offline')
            if (watchIdRef.current) {
                clearInterval(watchIdRef.current) // Clear interval instead of watchPosition
                watchIdRef.current = null
            }
            // Notify server of offline status
            if (socket) {
                socket.emit('driver:status:update', {
                    driverId,
                    orderId: activeOrderId,
                    status: 'offline'
                })
            }
        } else {
            // Go Online (Simulated)
            setIsOnline(true)
            setStatus('Simulating GPS Signal...')

            // Start at Store
            let currentLat = 28.5455
            let currentLon = 77.4010
            let step = 0

            // Simulate movement every 2 seconds
            watchIdRef.current = setInterval(() => {
                // Move towards House (28.5355, 77.3910)
                // Simple linear interpolation for demo
                step += 0.05
                if (step > 1) step = 0 // Loop back

                const targetLat = 28.5355
                const targetLon = 77.3910

                // Lerp
                const newLat = currentLat + (targetLat - currentLat) * 0.05
                const newLon = currentLon + (targetLon - currentLon) * 0.05

                currentLat = newLat
                currentLon = newLon

                const speed = 30 + Math.random() * 10 // Random speed 30-40 km/h
                const heading = 180 // South-ish

                setLocation({ lat: currentLat, lon: currentLon, heading, speed: speed / 3.6 })
                setStatus('Online & Broadcasting (Simulated)')

                // Emit to server
                if (socket) {
                    socket.emit('driver:location:update', {
                        driverId,
                        orderId: activeOrderId,
                        lat: currentLat,
                        lon: currentLon,
                        heading,
                        speed: speed / 3.6,
                        status: 'online'
                    })
                }
            }, 2000)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-8 text-gray-800">Driver Dashboard</h1>

            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center border-4 ${isOnline ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
                    <i className={`ph-fill ${isOnline ? 'ph-broadcast text-green-600' : 'ph-power text-gray-500'} text-4xl`}></i>
                </div>

                <h2 className="text-xl font-bold mb-2">{isOnline ? 'You are Online' : 'You are Offline'}</h2>
                <p className={`text-sm font-mono mb-6 ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>{status}</p>

                {/* Order ID Input */}
                <div className="mb-6 text-left">
                    <label className="text-xs font-bold text-gray-500 uppercase">Active Order ID</label>
                    <input
                        type="text"
                        value={activeOrderId}
                        onChange={(e) => setActiveOrderId(e.target.value)}
                        disabled={isOnline}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg font-mono text-center focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Enter the Order ID you are delivering (e.g., demo123)</p>
                </div>

                <button
                    onClick={toggleOnline}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 ${isOnline
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200'
                        : 'bg-green-500 hover:bg-green-600 text-white shadow-green-200'
                        } shadow-lg`}
                >
                    {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
                </button>

                {location && (
                    <div className="mt-8 text-left bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-2">Live Telemetry</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Lat:</span> {location.lat.toFixed(6)}
                            </div>
                            <div>
                                <span className="text-gray-500">Lon:</span> {location.lon.toFixed(6)}
                            </div>
                            <div>
                                <span className="text-gray-500">Speed:</span> {location.speed ? (location.speed * 3.6).toFixed(1) + ' km/h' : '0 km/h'}
                            </div>
                            <div>
                                <span className="text-gray-500">Heading:</span> {location.heading || 0}°
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DriverDashboard
