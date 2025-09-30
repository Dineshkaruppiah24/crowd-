// src/components/dashboard/nearby-map-panel.tsx
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GoogleMapWrapper } from './google-map-wrapper';
import { ExternalLink, MapPin } from 'lucide-react';
import { useLocation } from '@/hooks/use-location';
import { Button } from '../ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState, useEffect } from 'react';

// Helper function to create a simple hash from a string
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// Function to generate dynamic crowd data
const generateCrowdData = (baseLat: number, baseLng: number) => {
  const incident = `nearby-users-${baseLat}-${baseLng}`;
  const hash = simpleHash(incident);
  const numPoints = (Math.abs(hash) % 5) + 5; // Generate 5 to 9 data points
  const crowdData = [];

  for (let i = 0; i < numPoints; i++) {
    const latOffset = (((hash * (i + 1)) % 100) / 5000) - 0.01; // wider offset
    const lngOffset = (((hash / (i + 1)) % 100) / 5000) - 0.01; // wider offset
    const density = Math.abs(hash * (i + 1) * 37) % 150 + 20; // Density between 20 and 170

    crowdData.push({
      location: `${(baseLat + latOffset).toFixed(4)},${(
        baseLng + lngOffset
      ).toFixed(4)}`,
      density: density,
    });
  }

  return crowdData;
};

export function NearbyMapPanel() {
  const { location: center, isLoading, error } = useLocation();
  const mapPlaceholder = PlaceHolderImages.find(
    (img) => img.id === 'map-placeholder'
  );
  const [crowdDensityData, setCrowdDensityData] = useState<
    { location: string; density: number }[]
  >([]);

  useEffect(() => {
    if (center) {
      const data = generateCrowdData(center.lat, center.lng);
      setCrowdDensityData(data);
    }
  }, [center]);

  const handleOpenInGoogleMaps = () => {
    if (center) {
      const url = `https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Nearby Map
          </CardTitle>
          {center && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInGoogleMaps}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in Google Maps
            </Button>
          )}
        </div>
        <CardDescription>
          Your current location and simulated nearby users.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80 p-0">
        {(isLoading || error) && mapPlaceholder && (
          <div className="relative h-full w-full">
            <Image
              src={mapPlaceholder.imageUrl}
              alt={mapPlaceholder.description}
              data-ai-hint={mapPlaceholder.imageHint}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <p className="text-white/80">Loading map...</p>
            </div>
          </div>
        )}
        {!isLoading && !error && center && (
          <GoogleMapWrapper center={center} crowdDensityData={crowdDensityData} />
        )}
      </CardContent>
    </Card>
  );
}
