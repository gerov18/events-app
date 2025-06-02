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
          anchor='bottom'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-8 w-8 text-blue-600'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='
                M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 
                1.343-3 3 1.343 3 3 3z
                M12 21c-4.418 0-8-3.582-8-8 
                0-4.418 3.582-8 8-8s8 3.582 8 8
                c0 4.418-3.582 8-8 8z
              '
            />
          </svg>
        </Marker>
      </Map>
    </div>
  );
};
