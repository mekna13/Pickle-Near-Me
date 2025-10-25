'use client'

import { useState, useEffect } from "react"
import MapStart from "./components/MapStart"
import LocationModal from "./components/LocationModal"

interface UserLocation {
  latitude: number
  longitude: number
}

export default function Home() {
  const [showLocationModal, setShowLocationModal] = useState(true)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)

  const handleLocationGranted = (latitude: number, longitude: number) => {
    setUserLocation({ latitude, longitude })
    setShowLocationModal(false)
  }

  const handleLocationDenied = () => {
    setShowLocationModal(false)
  }

  const handleSkip = () => {
    setShowLocationModal(false)
  }

  return (
    <main className="relative h-screen flex flex-col md:flex-row">
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg md:hidden">
        <h1 className="text-2xl font-bold text-center">
          🥒 Pickle Near Me
        </h1>
      </div>

      <div className="hidden md:block w-1/2 h-full overflow-y-auto bg-white p-4">
        <h1 className="text-2xl font-bold mb-4">🥒 Pickle Near Me</h1>
        <h2 className="text-xl font-semibold mb-4">Pickle Spots</h2>
        <p>List of pickle locations will appear here...</p>
      </div>

      <div className="flex-1 h-full">
        <MapStart userLocation={userLocation} />
      </div>

      <LocationModal
        isOpen={showLocationModal}
        onLocationGranted={handleLocationGranted}
        onLocationDenied={handleLocationDenied}
        onSkip={handleSkip}
      />
    </main>
  )
}