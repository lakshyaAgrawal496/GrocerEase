import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { FaLocationCrosshairs, FaMagnifyingGlass } from 'react-icons/fa6'

if (L?.Icon?.Default && L.Icon.Default.prototype) {
  delete L.Icon.Default.prototype._getIconUrl
}
if (L?.Icon?.Default) {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  })
}

const DEFAULT_POSITION = [28.6139, 77.209] // New Delhi as fallback

const MapUpdater = ({ position }) => {
  const map = useMap()

  useEffect(() => {
    if (position) {
      map.setView(position, 15)
    }
  }, [position, map])

  return null
}

const AddressMap = ({ selectedAddress, onResolved }) => {
  const [query, setQuery] = useState(selectedAddress || '')
  const [position, setPosition] = useState(DEFAULT_POSITION)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formattedAddress = useMemo(() => {
    return selectedAddress?.trim() ?? ''
  }, [selectedAddress])

  const handleSearch = useCallback(
    async (value) => {
      const address = (value ?? query)?.trim()
      if (!address) {
        setError('Enter an address to locate it on the map.')
        return
      }
      try {
        setLoading(true)
        setError('')
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address
          )}&limit=1`
        )

        const data = await response.json()
        if (Array.isArray(data) && data.length) {
          const { lat, lon, display_name } = data[0]
          setPosition([parseFloat(lat), parseFloat(lon)])
          setError('')
          if (!formattedAddress) {
            setQuery(display_name)
          }
          try {
            const r = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
            )
            const j = await r.json()
            const a = j?.address || {}
            const payload = {
              address_line: [a.road, a.neighbourhood, a.suburb, a.house_number].filter(Boolean).join(', '),
              city: a.city || a.town || a.village || '',
              state: a.state || '',
              country: a.country || '',
              pincode: a.postcode || ''
            }
            if (onResolved) onResolved(payload)
          } catch (_) {}
        } else {
          setError('No results found for this address.')
        }
      } catch (err) {
        setError('Unable to locate this address right now.')
      } finally {
        setLoading(false)
      }
    },
    [query, formattedAddress, onResolved]
  )

  useEffect(() => {
    if (formattedAddress) {
      setQuery(formattedAddress)
      handleSearch(formattedAddress)
    }
  }, [formattedAddress, handleSearch])

  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }
    setError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude]
        setPosition(coords)
        setQuery(`Lat: ${coords[0].toFixed(4)}, Lon: ${coords[1].toFixed(4)}`)
        ;(async ()=>{
          try{
            const r = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}&zoom=18&addressdetails=1`
            )
            const j = await r.json()
            const a = j?.address || {}
            const payload = {
              address_line: [a.road, a.neighbourhood, a.suburb, a.house_number].filter(Boolean).join(', '),
              city: a.city || a.town || a.village || '',
              state: a.state || '',
              country: a.country || '',
              pincode: a.postcode || ''
            }
            if (onResolved) onResolved(payload)
          }catch(_){}
        })()
      },
      (err) => setError(err?.message || 'Unable to fetch your current location.'),
      { enableHighAccuracy: true }
    )
  }

  return (
    <div className='bg-white rounded shadow-md border border-slate-100'>
      <div className='p-4 flex flex-col gap-3'>
        <div>
          <p className='font-semibold text-base'>Locate your delivery spot</p>
          <p className='text-sm text-neutral-500'>
            Type an address or use your current location to drop a precise pin for the
            rider.
          </p>
        </div>
        <div className='flex flex-col sm:flex-row gap-2'>
          <div className='flex-1 flex border border-slate-200 rounded-lg overflow-hidden focus-within:border-primary-200'>
            <input
              type='text'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
              placeholder='Search address, building, area'
              className='flex-1 px-3 py-2 outline-none text-sm'
            />
            <button
              type='button'
              onClick={() => handleSearch()}
              className='px-4 bg-primary-200 text-white text-sm flex items-center gap-2 hover:bg-primary-100'
              disabled={loading || !query.trim()}
            >
              <FaMagnifyingGlass />
              Locate
            </button>
          </div>
          <button
            type='button'
            onClick={handleCurrentLocation}
            className='px-4 py-2 border border-green-600 text-green-600 rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-green-600 hover:text-white'
          >
            <FaLocationCrosshairs />
            Use my location
          </button>
        </div>
        {error && <p className='text-red-500 text-sm'>{error}</p>}
      </div>
      <div className='h-72 w-full'>
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={false}
          className='h-full w-full'
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <Marker position={position} />
          <MapUpdater position={position} />
        </MapContainer>
      </div>
      {loading && (
        <p className='text-center text-sm py-2 text-neutral-500'>Finding address...</p>
      )}
    </div>
  )
}

export default AddressMap

