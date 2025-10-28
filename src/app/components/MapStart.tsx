'use client'

import { useState, useEffect, useRef } from "react";
import Map, { Marker } from "react-map-gl/mapbox"
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css'
import PickleMarker from './PickleMarker'

const mobileStyles = `
  <style>
    @media (max-width: 768px) {
      .pickle-banner {
        top: 8px !important;
        right: 8px !important;
        left: 8px !important;
        max-width: none !important;
        padding: 8px !important;
      }
      .pickle-banner .banner-title {
        font-size: 12px !important;
      }
      .pickle-banner .banner-name {
        font-size: 13px !important;
      }
      .pickle-banner .banner-details {
        font-size: 11px !important;
      }
      .pickle-banner .banner-price {
        font-size: 11px !important;
      }
    }
  </style>
`

interface UserLocation {
  latitude: number
  longitude: number
}

interface PickleLocation {
    id: string
    name: string
    rentalRate: number
    image: string
    latitude: number
    longitude: number
    miles: number
}

interface MapStartProps {
  userLocation?: UserLocation | null
  mapCenter?: UserLocation | null
  pickleLocations: PickleLocation[]
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

export default function MapStart({ userLocation, mapCenter, pickleLocations }: MapStartProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [viewState, setViewState] = useState({
        latitude: 40.708720,
        longitude: -74.002058,
        zoom: 16
    });
    const [isMapReady, setIsMapReady] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (mapCenter) {
            setViewState({
                latitude: mapCenter.latitude,
                longitude: mapCenter.longitude,
                zoom: 16
            })
        } else if (userLocation) {
            setViewState({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                zoom: 16
            })
        }
    }, [mapCenter, userLocation])

    if (!MAPBOX_TOKEN) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-red-600">Mapbox token not found</p>
            </div>
        );
    }

    if (!isMounted) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            <div dangerouslySetInnerHTML={{ __html: mobileStyles }} />
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%', position: 'relative' }} id="map-container">
                {/* Closest Pickle Banner */}
                {pickleLocations.length > 0 && userLocation && (
                    <div className="pickle-banner" style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        zIndex: 10,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #e5e7eb',
                        maxWidth: '280px',
                        backdropFilter: 'blur(4px)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: '#10b981',
                                borderRadius: '50%'
                            }}></div>
                            <span className="banner-title" style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#374151'
                            }}>Closest to you</span>
                        </div>
                        <div style={{ marginTop: '4px' }}>
                            <p className="banner-name" style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#111827',
                                margin: '0 0 2px 0'
                            }}>{pickleLocations[0].name}</p>
                            <p className="banner-details" style={{
                                fontSize: '12px',
                                color: '#6b7280',
                                margin: '0 0 2px 0'
                            }}>{pickleLocations[0].miles} miles away</p>
                            <p className="banner-price" style={{
                                fontSize: '12px',
                                color: '#059669',
                                fontWeight: '500',
                                margin: '0'
                            }}>${pickleLocations[0].rentalRate}/day</p>
                        </div>
                    </div>
                )}

            <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                onLoad={() => setIsMapReady(true)}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={MAPBOX_TOKEN}
                mapLib={mapboxgl}
            >
                {userLocation && isMapReady && (
                    <Marker
                        longitude={userLocation.longitude}
                        latitude={userLocation.latitude}
                        color="blue"
                    />
                )}
                {isMapReady && pickleLocations.map((pickle) => (
                    <Marker
                        key={pickle.id}
                        longitude={pickle.longitude}
                        latitude={pickle.latitude}
                    >
                        <PickleMarker pickle={pickle} />
                    </Marker>
                ))}
            </Map>
            </div>
        </>
    );
}