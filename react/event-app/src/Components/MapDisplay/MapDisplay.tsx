import React, { useEffect, useState } from 'react';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapDisplayProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const MapDisplay = ({
  latitude,
  longitude,
  zoom = 12,
  className = '',
}: MapDisplayProps) => {
  const [viewState, setViewState] = useState({
    latitude,
    longitude,
    zoom,
  });

  useEffect(() => {
    setViewState({ latitude, longitude, zoom });
  }, [latitude, longitude, zoom]);

  if (!MAPBOX_TOKEN) {
    console.error('Error loading map');
    return null;
  }

  return (
    <div className={`relative w-full h-64 ${className}`}>
      <Map
        initialViewState={viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle='mapbox://styles/mapbox/streets-v11'
        mapboxAccessToken={MAPBOX_TOKEN}>
        <Marker
          latitude={latitude}
          longitude={longitude}
          anchor='bottom'
        />
      </Map>
    </div>
  );
};
