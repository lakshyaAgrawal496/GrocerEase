import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const OrderTracking = () => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const driverMarkerRef = useRef(null);
    const pathLineRef = useRef(null);
    const watchIdRef = useRef(null);
    const animationFrameRef = useRef(null);

    const [eta, setEta] = useState('-- min');
    const [speed, setSpeed] = useState('0 km/h');
    const [status, setStatus] = useState('On the way');
    const [loading, setLoading] = useState(true);

    const MAPTILER_KEY = '8LNrPmuNGrFCa8iEbS5y';
    const FALLBACK_LOC = [28.5355, 77.3910];

    useEffect(() => {
        // Load Phosphor Icons
        const script = document.createElement('script');
        script.src = "https://unpkg.com/@phosphor-icons/web";
        script.async = true;
        document.body.appendChild(script);

        // Initialize App
        initApp();

        return () => {
            if (mapInstanceRef.current) mapInstanceRef.current.remove();
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            document.body.removeChild(script);
        };
    }, []);

    const initApp = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = [position.coords.latitude, position.coords.longitude];
                    startGame(userLocation);
                },
                (error) => {
                    console.warn("Geolocation denied/failed, using fallback.");
                    startGame(FALLBACK_LOC);
                },
                { enableHighAccuracy: true }
            );
        } else {
            startGame(FALLBACK_LOC);
        }
    };

    const startGame = (userLocation) => {
        setLoading(false);
        setupMap(userLocation);
        const storeLocation = generateStoreLocation(userLocation);
        fetchRouteAndSimulate(storeLocation, userLocation);
    };

    const setupMap = (userLocation) => {
        const map = L.map(mapRef.current, {
            zoomControl: false,
            attributionControl: false
        }).setView(userLocation, 15);

        L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`, {
            tileSize: 512, zoomOffset: -1, minZoom: 1, crossOrigin: true
        }).addTo(map);

        L.tileLayer('https://mt0.google.com/vt?lyrs=h,traffic&x={x}&y={y}&z={z}', {
            maxZoom: 20, opacity: 0.6
        }).addTo(map);

        const createIcon = (iconName, color) => L.divIcon({
            html: `<div class="w-10 h-10 ${color} rounded-full flex items-center justify-center text-white shadow-xl border-4 border-white z-10">
                     <i class="ph-fill ${iconName} text-lg"></i>
                   </div>`,
            className: 'bg-transparent',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        L.marker(userLocation, { icon: createIcon('ph-house', 'bg-green-600') })
            .addTo(map)
            .bindPopup("<b>You are here</b>").openPopup();

        const driverIcon = L.divIcon({
            html: `<div class="driver-icon-container relative w-14 h-14 flex items-center justify-center">
                     <div class="pulse-ring bg-blue-500 opacity-30"></div>
                     <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full shadow-2xl border-2 border-white flex items-center justify-center z-10 transform transition-transform">
                        <i class="ph-fill ph-navigation-arrow text-white text-xl transform -rotate-45"></i>
                     </div>
                   </div>`,
            className: 'bg-transparent',
            iconSize: [56, 56],
            iconAnchor: [28, 28]
        });

        driverMarkerRef.current = L.marker(userLocation, { icon: driverIcon, zIndexOffset: 1000 }).addTo(map);
        mapInstanceRef.current = map;
    };

    const generateStoreLocation = (userLocation) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.015;
        const dx = Math.cos(angle) * radius;
        const dy = Math.sin(angle) * radius;
        const storeLocation = [userLocation[0] + dy, userLocation[1] + dx];

        const storeIcon = L.divIcon({
            html: `<div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                     <i class="ph-fill ph-storefront text-sm"></i>
                   </div>`,
            className: 'bg-transparent',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        L.marker(storeLocation, { icon: storeIcon }).addTo(mapInstanceRef.current);
        return storeLocation;
    };

    const fetchRouteAndSimulate = async (storeLocation, userLocation) => {
        try {
            const startStr = `${storeLocation[1]},${storeLocation[0]}`;
            const endStr = `${userLocation[1]},${userLocation[0]}`;
            const url = `https://router.project-osrm.org/route/v1/driving/${startStr};${endStr}?overview=full&geometries=geojson`;

            const res = await fetch(url);
            const data = await res.json();

            if (!data.routes || data.routes.length === 0) throw new Error("No route");

            const coordinates = data.routes[0].geometry.coordinates;
            const routePath = coordinates.map(c => [c[1], c[0]]);

            drawRoute(routePath);
            simulateDriverMovement(routePath);
        } catch (e) {
            console.error(e);
            const routePath = [storeLocation, userLocation];
            drawRoute(routePath);
            simulateDriverMovement(routePath);
        }
    };

    const drawRoute = (path) => {
        if (pathLineRef.current) mapInstanceRef.current.removeLayer(pathLineRef.current);

        L.polyline(path, { color: '#60A5FA', weight: 8, opacity: 0.4 }).addTo(mapInstanceRef.current);
        pathLineRef.current = L.polyline(path, { color: '#2563EB', weight: 4, opacity: 1 }).addTo(mapInstanceRef.current);

        mapInstanceRef.current.fitBounds(pathLineRef.current.getBounds(), { padding: [100, 50, 300, 50] });
    };

    const simulateDriverMovement = (path) => {
        const TOTAL_TIME_MS = 45000;
        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / TOTAL_TIME_MS, 1);

            const point = getPointAtProgress(path, progress);

            if (driverMarkerRef.current) {
                driverMarkerRef.current.setLatLng(point.coords);

                if (point.bearing !== null) {
                    const iconEl = document.querySelector('.driver-icon-container .w-10');
                    if (iconEl) {
                        iconEl.style.transform = `rotate(${point.bearing}deg)`;
                    }
                }
            }

            const randomFlux = (Math.random() * 10) - 5;
            const currentSpeed = Math.max(0, Math.floor(40 + randomFlux));

            if (progress < 1) {
                if (Math.floor(elapsed) % 20 === 0) {
                    const minsLeft = Math.ceil((1 - progress) * 15);
                    setEta(`${minsLeft} min`);
                    setSpeed(`${currentSpeed} km/h`);
                }
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                finishDelivery();
            }
        };

        animationFrameRef.current = requestAnimationFrame(animate);
    };

    const finishDelivery = () => {
        setEta("Arrived");
        setSpeed("0 km/h");
        setStatus("Arrived");
        alert("Ding Dong! Your order is here.");
    };

    const getPointAtProgress = (path, progress) => {
        const totalPoints = path.length - 1;
        const exactIndex = progress * totalPoints;
        const index = Math.floor(exactIndex);
        const segmentProgress = exactIndex - index;

        if (index >= totalPoints) return { coords: path[totalPoints], bearing: null };

        const p1 = path[index];
        const p2 = path[index + 1];

        const lat = p1[0] + (p2[0] - p1[0]) * segmentProgress;
        const lng = p1[1] + (p2[1] - p1[1]) * segmentProgress;
        const bearing = getBearing(p1[0], p1[1], p2[0], p2[1]);

        return { coords: [lat, lng], bearing };
    };

    const getBearing = (startLat, startLng, destLat, destLng) => {
        const toRadians = (d) => d * Math.PI / 180;
        const toDegrees = (r) => r * 180 / Math.PI;

        const y = Math.sin(toRadians(destLng - startLng)) * Math.cos(toRadians(destLat));
        const x = Math.cos(toRadians(startLat)) * Math.sin(toRadians(destLat)) -
            Math.sin(toRadians(startLat)) * Math.cos(toRadians(destLat)) * Math.cos(toRadians(destLng - startLng));
        let brng = toDegrees(Math.atan2(y, x));
        return (brng + 360) % 360;
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-gray-100 font-sans">
            <style>{`
                .driver-icon-container { transition: transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1); filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); }
                .pulse-ring { position: absolute; width: 100%; height: 100%; border-radius: 50%; animation: pulsate 2s ease-out infinite; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3); }
                @keyframes pulsate { 0% { transform: scale(0.1, 0.1); opacity: 0; } 50% { opacity: 1; } 100% { transform: scale(1.5, 1.5); opacity: 0; } }
                .bottom-sheet { animation: slideUp 0.4s ease-out; transition: transform 0.3s ease; }
                @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
            `}</style>

            {loading && (
                <div className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center p-4 transition-opacity duration-500">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <h2 className="text-xl font-bold text-gray-800">Locating You...</h2>
                    <p className="text-gray-600 text-sm text-center mt-2">Please allow location access to track delivery to your doorstep.</p>
                </div>
            )}

            <div className="fixed top-0 left-0 right-0 z-[500] p-4 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-4 flex justify-between items-center pointer-events-auto max-w-md mx-auto ring-1 ring-gray-200">
                    <div>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Estimated Arrival</p>
                        <h1 className="text-2xl font-bold text-gray-900">{eta}</h1>
                    </div>
                    <div className="text-right">
                        <div className="flex flex-col items-end">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold tracking-wide">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                                LIVE GPS
                            </span>
                            <span className="text-xs text-gray-500 font-mono mt-1">{speed}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={mapRef} className="w-full h-full z-0" />

            <div className="fixed bottom-0 left-0 right-0 z-[500] pointer-events-none">
                <div className="max-w-md mx-auto pointer-events-auto bottom-sheet">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-t-xl flex items-center justify-between shadow-lg mx-2 translate-y-2 relative z-0">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                            <i className="ph-fill ph-package"></i> Order #29384
                        </span>
                        <span className="text-xs font-bold text-white bg-white/20 px-2 py-0.5 rounded">{status}</span>
                    </div>

                    <div className="bg-white rounded-t-3xl shadow-[0_-5px_30px_rgba(0,0,0,0.15)] p-6 pb-8 relative z-10">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-16 h-16 rounded-full bg-gray-50 border-2 border-white shadow-md" alt="Driver" />
                                <div className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                                    4.9 <i className="ph-fill ph-star text-yellow-400"></i>
                                </div>
                            </div>

                            <div className="flex-1">
                                <h2 className="text-lg font-bold text-gray-900">Michael R.</h2>
                                <p className="text-sm text-gray-600 font-medium">Yamaha NMAX • Electric Blue</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600 font-bold border border-gray-200">XY 992</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition border border-gray-200">
                                    <i className="ph-fill ph-chat-circle-text text-xl"></i>
                                </button>
                                <button onClick={() => alert('Calling Driver...')} className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-200 hover:bg-green-600 transition transform active:scale-95">
                                    <i className="ph-fill ph-phone text-xl"></i>
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 flex items-start gap-4 relative pl-1">
                            <div className="absolute left-[15px] top-2 bottom-0 w-0.5 bg-gray-100"></div>

                            <div className="flex items-center gap-4 relative z-10 w-full opacity-40">
                                <div className="w-8 h-8 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center shadow-sm">
                                    <i className="ph-bold ph-storefront text-xs text-gray-600"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">Restaurant</p>
                                    <p className="text-xs text-gray-600">Order picked up at 12:45 PM</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-start gap-4 relative z-10 w-full pl-1">
                            <div className={`w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center relative ${status === 'Arrived' ? 'bg-gray-800' : 'bg-green-500'}`}>
                                {status !== 'Arrived' && <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>}
                                <i className={`ph-bold ph-moped text-xs ${status === 'Arrived' ? 'text-gray-400' : 'text-white'}`}></i>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{status === 'Arrived' ? 'Order Delivered' : 'Arriving Soon'}</p>
                                <p className="text-xs text-gray-600 mt-0.5">{status === 'Arrived' ? 'Enjoy your meal!' : 'Heading towards your location'}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
