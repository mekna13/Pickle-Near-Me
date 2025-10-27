'use client'
import { useState } from "react"
import MapStart from "./components/MapStart"
import LocationModal from "./components/LocationModal"

export interface Location {
  latitude: number,
  longitude: number
}

export default function Home() {

  const [userLocation, setUserLocation] = useState<Location>()
  const [isOpen, setIsOpen] = useState<boolean>(true)

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

  return (
    <main>
      {/* <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-center">
          🥒 Pickle Near Me
        </h1>
      </div> */}
      <LocationModal
        isOpen={isOpen}
        onLocationGranted={onLocationGranted}
        onLocationDenied={onLocationDenied}
        onSkip={onSkip}
      />
      <div className="w-screen h-screen">
        <MapStart userLocation={userLocation} />
      </div>

    </main>
  )
}