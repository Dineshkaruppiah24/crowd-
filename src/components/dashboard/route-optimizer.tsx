'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertCircle,
  Loader2,
  Search,
  Shield,
  Waypoints,
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

const RouteOptimizerSchema = z.object({
  currentLocation: z.string().min(1, 'Current location is required.'),
  destination: z.string().optional(),
  incidentDescription: z.string().min(1, 'Incident description is required.'),
});

type RouteOptimizerFormValues = z.infer<typeof RouteOptimizerSchema>;

export function RouteOptimizer() {
  const [result, setResult] = useState<SuggestEvacuationRoutesOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RouteOptimizerFormValues>({
    resolver: zodResolver(RouteOptimizerSchema),
    defaultValues: {
      currentLocation: '34.0522, -118.2437',
      destination: '',
      incidentDescription: 'Fire outbreak in a nearby building',
    },
  });

  async function onSubmit(values: RouteOptimizerFormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const crowdDensityData = JSON.stringify([
      { location: '34.0530,-118.2440', density: 150 },
      { location: '34.0515,-118.2430', density: 300 },
      { location: '34.0525,-118.2450', density: 50 },
    ]);

    try {
      const response = await getEvacuationRoutes({
        ...values,
        crowdDensityData,
      });
      setResult(response);
    } catch (e) {
      setError('Failed to generate routes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }
  
  const [lat, lng] = form.getValues('currentLocation').split(',').map(parseFloat);

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
                    <FormControl>
                      <Input placeholder="e.g., 34.0522, -118.2437" {...field} />
                    </FormControl>
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
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
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

      {result && (
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
                crowdDensityData={JSON.parse(form.getValues('incidentDescription') ? '[]' : '[]')}
              />
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}