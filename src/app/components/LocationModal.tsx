'use client'

import { useState } from 'react'
import PickleMarker from './PickleMarker'

interface LocationModalProps {
  isOpen: boolean
  onLocationGranted: (lat: number, lng: number) => void
  onLocationDenied: () => void
  onSkip: () => void
}

export default function LocationModal({
  isOpen,
  onLocationDenied,
  onLocationGranted,
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
    <div className="fixed inset-0 flex items-center justify-center z-50 w-screen h-screen" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-1/3 p-6 relative" style={{ background: "white", borderRadius: "12px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", fontFamily: "Raleway, sans-serif", padding: "24px" }}>
        <div className="text-center mb-6" style={{ fontFamily: "Raleway, sans-serif", textAlign: "center", marginBottom: "24px" }}>
          <div className="text-4xl mb-4" style={{ fontSize: "2.25rem", marginBottom: "16px" }}>📍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Raleway, sans-serif", color: "#1f2937", fontSize: "1.5rem", fontWeight: "700", marginBottom: "8px" }}>
            Find Pickles Near You
          </h2>
          <p className="text-gray-600" style={{ fontFamily: "Raleway, sans-serif", color: "#4b5563" }}>
            Allow location access to discover the best pickle spots in your area
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: "6px", fontFamily: "Raleway, sans-serif", padding: "12px 16px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <div className="space-y-3" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={handleAllowLocation}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            style={{ backgroundColor: "#71bd4b", color: "white", borderRadius: "8px", fontFamily: "Raleway, sans-serif", fontWeight: "600", border: "none", cursor: isLoading ? "not-allowed" : "pointer", width: "100%", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}
            onMouseEnter={(e) => !isLoading && ((e.target as HTMLButtonElement).style.backgroundColor = "#5da83a")}
            onMouseLeave={(e) => !isLoading && ((e.target as HTMLButtonElement).style.backgroundColor = "#71bd4b")}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid transparent", borderBottom: "2px solid white", marginRight: "8px", animation: "spin 1s linear infinite" }}></div>
                Getting Location...
              </>
            ) : (
              'Allow Location Access'
            )}
          </button>

          <button
            onClick={onSkip}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
            style={{ backgroundColor: "#e5e7eb", color: "#374151", borderRadius: "8px", fontFamily: "Raleway, sans-serif", fontWeight: "600", border: "none", cursor: "pointer", width: "100%", padding: "12px 16px" }}
            onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#d1d5db")}
            onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#e5e7eb")}
          >
            Skip for Now
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4" style={{ fontFamily: "Raleway, sans-serif", color: "#6b7280", fontSize: "0.75rem", textAlign: "center", marginTop: "16px" }}>
          We only use your location to show nearby pickle spots. Your location is not stored or shared.
        </p>
      </div>
    </div>
  )
}