'use client'

import { useState, useEffect, useRef } from "react";
import Map, { Marker } from "react-map-gl/mapbox"
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css'
import PickleMarker from './PickleMarker'

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
        <div ref={mapContainerRef} className="w-full h-full" id="map-container">
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
    );
}