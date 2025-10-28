'use client'
import { useState, useEffect } from "react"
import MapStart from "./components/MapStart"
import LocationModal from "./components/LocationModal"

export interface Location {
  latitude: number,
  longitude: number
}

export interface PickleLocation {
  id: string
  name: string
  rentalRate: number
  image: string
  latitude: number
  longitude: number
  miles: number
}

export default function Home() {

  const [userLocation, setUserLocation] = useState<Location>()
  const [mapCenter, setMapCenter] = useState<Location>()
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const [pickleLocations, setPickleLocations] = useState<PickleLocation[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPickleLocationsByCity = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT! + "/RentalsData?cityId=nyc")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: PickleLocation[] = await response.json()
      setPickleLocations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pickle locations')
      console.error('Error fetching pickle locations:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPickleLocationsByCoordinates = async (latitude: number, longitude: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT! + "/RentalsData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude,
          longitude,
          limit: 10
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: PickleLocation[] = await response.json()
      setPickleLocations(data)
      if (data.length > 0) {
        setMapCenter({
          latitude: data[0].latitude,
          longitude: data[0].longitude
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch nearby pickle locations')
      console.error('Error fetching nearby pickle locations:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPickleLocationsByCity()
  }, [])

  useEffect(() => {
    if (userLocation) {
      fetchPickleLocationsByCoordinates(userLocation.latitude, userLocation.longitude)
    }
  }, [userLocation])

  const onLocationGranted = (latitude: number, longitude: number) => {
    setUserLocation({ latitude, longitude })
    setIsOpen(false)
  }

  const onLocationDenied = () => {
    setIsOpen(false)
  }

  const onSkip = () => {
    setIsOpen(false)
  }

  if (isLoading) {
    return (
      <main className="w-screen h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading pickle locations...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="w-screen h-screen flex items-center justify-center">
        <div className="text-center bg-red-50 p-6 rounded-lg max-w-md">
          <div className="text-red-600 text-xl mb-2">⚠️</div>
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  return (
    <main>
      <LocationModal
        isOpen={isOpen}
        onLocationGranted={onLocationGranted}
        onLocationDenied={onLocationDenied}
        onSkip={onSkip}
      />
      <div className="w-screen h-screen">
        <MapStart userLocation={userLocation} mapCenter={mapCenter} pickleLocations={pickleLocations} />
      </div>
    </main>
  )
}