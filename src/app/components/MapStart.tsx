'use client'

import { useState, useEffect } from "react";
import Map, { Marker } from "react-map-gl/mapbox"

interface UserLocation {
  latitude: number
  longitude: number
}

interface MapStartProps {
  userLocation?: UserLocation | null
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

export default function MapStart({ userLocation }: MapStartProps) {
    const [viewState, setViewState] = useState({
        latitude: 37.8,
        longitude: -122.4,
        zoom: 14
    });

    useEffect(() => {
        if (userLocation) {
            setViewState({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                zoom: 14
            })
        }
    }, [userLocation])

    return (
        <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={MAPBOX_TOKEN}
        >
            {userLocation && (
                <Marker
                    longitude={userLocation.longitude}
                    latitude={userLocation.latitude}
                    color="blue"
                />
            )}
            <Marker longitude={-122.4} latitude={37.8} color="red" />
        </Map>
    );
}