'use client'

import { useState } from 'react'

interface LocationModalProps {
  isOpen: boolean
  onLocationGranted: (lat: number, lng: number) => void
  onLocationDenied: () => void
  onSkip: () => void
}

export default function LocationModal({
  isOpen,
  onLocationGranted,
  onLocationDenied,
  onSkip
}: LocationModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAllowLocation = async () => {
    setIsLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        onLocationGranted(latitude, longitude)
        setIsLoading(false)
      },
      (error) => {
        let errorMessage = 'Unable to get your location'

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }

        setError(errorMessage)
        setIsLoading(false)
        onLocationDenied()
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">📍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Find Pickles Near You
          </h2>
          <p className="text-gray-600">
            Allow location access to discover the best pickle spots in your area
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleAllowLocation}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Getting Location...
              </>
            ) : (
              'Allow Location Access'
            )}
          </button>

          <button
            onClick={onSkip}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Skip for Now
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          We only use your location to show nearby pickle spots. Your location is not stored or shared.
        </p>
      </div>
    </div>
  )
}