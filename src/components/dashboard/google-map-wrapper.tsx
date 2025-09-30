'use client';

import { useLoadScript } from '@react-google-maps/api';
import { MapComponent } from './google-map';
import { Skeleton } from '../ui/skeleton';

type MapProps = {
  center: { lat: number; lng: number };
  crowdDensityData: { location: string; density: number }[];
};

export function GoogleMapWrapper(props: MapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['visualization'],
  });

  if (loadError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-destructive/10 text-destructive">
        Error loading maps. Please check your API key.
      </div>
    );
  }

  if (!isLoaded) {
    return <Skeleton className="h-full w-full" />;
  }

  return <MapComponent {...props} />;
}
