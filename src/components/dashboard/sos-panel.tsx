'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Siren } from 'lucide-react';
import { triggerSosAlert } from '@/app/actions';

// This is a placeholder. In a real app, this would come from a data store.
const emergencyContacts = [
  { name: 'Jane Doe', relation: 'Spouse', phone: '(555) 123-4567' },
  { name: 'John Smith', relation: 'Friend', phone: '(555) 987-6543' },
];

export function SosPanel() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSosConfirm = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Geolocation Not Supported',
        description: 'Your browser does not support geolocation.',
      });
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const currentLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(
          4
        )}`;

        try {
          const result = await triggerSosAlert({
            currentLocation,
            emergencyContacts,
          });

          toast({
            title: 'SOS Alert Sent',
            description: result.confirmationMessage,
            variant: 'destructive',
            duration: 10000, // Show for longer
          });
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'SOS Failed',
            description: 'Could not send the SOS alert. Please try again.',
          });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          variant: 'destructive',
          title: 'Location Error',
          description: 'Could not retrieve your location. SOS not sent.',
        });
        setIsLoading(false);
      }
    );
  };

  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">Emergency SOS</CardTitle>
        <CardDescription>
          Press only in a real emergency.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="group h-32 w-32 rounded-full p-0 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 active:scale-100"
              aria-label="Activate SOS"
              disabled={isLoading}
            >
              <div className="relative flex h-full w-full items-center justify-center">
                {isLoading ? (
                  <Loader2 className="h-12 w-12 animate-spin text-destructive-foreground" />
                ) : (
                  <>
                    <div className="absolute h-full w-full animate-ping rounded-full bg-destructive/50 opacity-75"></div>
                    <Siren className="h-12 w-12 text-destructive-foreground transition-transform duration-300 group-hover:scale-110" />
                  </>
                )}
              </div>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm SOS Alert?</AlertDialogTitle>
              <AlertDialogDescription>
                This will immediately attempt to send your location to the nearest emergency services and your pre-selected contacts. Use this only if you are in danger.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleSosConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Yes, Send Alert'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <p className="mt-6 text-sm font-bold uppercase tracking-wider text-destructive">Press and hold</p>
      </CardContent>
    </Card>
  );
}
