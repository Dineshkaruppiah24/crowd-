
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertCircle,
  Loader2,
  Search,
  Shield,
  Waypoints,
  Locate,
} from 'lucide-react';
import type { SuggestEvacuationRoutesOutput } from '@/ai/flows/suggest-evacuation-routes';
import { getEvacuationRoutes } from '@/app/actions';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '../ui/separator';
import { GoogleMapWrapper } from './google-map-wrapper';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/hooks/use-location';

const RouteOptimizerSchema = z.object({
  currentLocation: z.string().min(1, 'Current location is required.'),
  destination: z.string().optional(),
  incidentDescription: z.string().min(1, 'Incident description is required.'),
});

type RouteOptimizerFormValues = z.infer<typeof RouteOptimizerSchema>;

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


// Function to generate dynamic crowd data based on incident description
const generateCrowdData = (incident: string, baseLat: number, baseLng: number) => {
    if (!incident) return [];
    
    const hash = simpleHash(incident);
    const numPoints = (Math.abs(hash) % 3) + 3; // Generate 3 to 5 data points
    const crowdData = [];

    for (let i = 0; i < numPoints; i++) {
        const latOffset = ( ( (hash * (i+1)) % 100) / 10000) - 0.005; // small offset
        const lngOffset = ( ( (hash / (i+1)) % 100) / 10000) - 0.005; // small offset
        const density = Math.abs((hash * (i+1) * 37)) % 300 + 50; // Density between 50 and 350
        
        crowdData.push({
            location: `${(baseLat + latOffset).toFixed(4)},${(baseLng + lngOffset).toFixed(4)}`,
            density: density
        });
    }

    return crowdData;
}


export function RouteOptimizer() {
  const [result, setResult] = useState<SuggestEvacuationRoutesOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [crowdDensityData, setCrowdDensityData] = useState<any[]>([]);
  const { location, isLoading: isLocating, error: locationError } = useLocation();


  const form = useForm<RouteOptimizerFormValues>({
    resolver: zodResolver(RouteOptimizerSchema),
    defaultValues: {
      currentLocation: '',
      destination: '',
      incidentDescription: 'Fire outbreak in a nearby building',
    },
  });

  useEffect(() => {
    if (location) {
      const newLocation = `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
      form.setValue('currentLocation', newLocation, { shouldValidate: true });
    } else if (locationError) {
       form.setValue('currentLocation', '34.0522, -118.2437', { shouldValidate: true });
    }
  }, [location, locationError, form]);
  
  const handleSetCurrentLocation = () => {
    if (location) {
      const newLocation = `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
      form.setValue('currentLocation', newLocation, { shouldValidate: true });
      toast({
        title: 'Location Updated',
        description: `Your location has been set to ${newLocation}`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Location Not Available',
        description: 'Could not retrieve your current location.',
      });
    }
  };


  async function onSubmit(values: RouteOptimizerFormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const [lat, lng] = values.currentLocation.split(',').map(s => parseFloat(s.trim()));
    const dynamicCrowdData = generateCrowdData(values.incidentDescription, lat, lng);
    setCrowdDensityData(dynamicCrowdData);

    try {
      const response = await getEvacuationRoutes({
        ...values,
        crowdDensityData: JSON.stringify(dynamicCrowdData),
      });
      setResult(response);
    } catch (e) {
      setError('Failed to generate routes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }
  
  const watchedLocation = form.watch('currentLocation');
  const [lat, lng] = watchedLocation ? watchedLocation.split(',').map(s => parseFloat(s.trim())) : [0,0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <Waypoints className="h-6 w-6" />
          Dynamic Route Optimization
        </CardTitle>
        <CardDescription>
          Find the safest evacuation routes based on real-time data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="currentLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Current Location (GPS)</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="e.g., 34.0522, -118.2437" {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleSetCurrentLocation}
                        disabled={isLocating}
                        aria-label="Get current location"
                      >
                        {isLocating ? (
                           <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Locate className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 34.0600, -118.2500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="incidentDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Incident Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Fire, flooding, protest"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading || !watchedLocation} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Find Safest Routes
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      {error && (
        <CardFooter>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardFooter>
      )}

      {result && lat != 0 && (
        <CardFooter className="flex flex-col items-start gap-6">
          <Separator />
          <div className="w-full space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">Suggested Routes</h3>
            <div className="space-y-4">
              {result.safeRoutes.map((route, index) => (
                <div key={index} className="rounded-lg border bg-secondary/50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span className="font-semibold">Route {index + 1} (Safest)</span>
                    </div>
                  </div>
                  <p className="text-foreground">{route}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">Crowd Density Map</h3>
            <div className="overflow-hidden rounded-lg border h-96">
             <GoogleMapWrapper
                center={{ lat, lng }}
                crowdDensityData={crowdDensityData}
              />
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
