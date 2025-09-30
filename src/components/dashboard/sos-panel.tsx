'use client';

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
import { Siren } from 'lucide-react';

export function SosPanel() {
  const { toast } = useToast();

  const handleSosConfirm = () => {
    toast({
      title: 'SOS Alert Sent',
      description: 'Your location and identity have been shared with emergency services and contacts.',
      variant: 'destructive',
    });
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
            >
              <div className="relative flex h-full w-full items-center justify-center">
                <div className="absolute h-full w-full animate-ping rounded-full bg-destructive/50 opacity-75"></div>
                <Siren className="h-12 w-12 text-destructive-foreground transition-transform duration-300 group-hover:scale-110" />
              </div>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm SOS Alert?</AlertDialogTitle>
              <AlertDialogDescription>
                This will immediately send your location and identity to the nearest emergency services and your pre-selected contacts. Use this only if you are in danger.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleSosConfirm}
              >
                Yes, Send Alert
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <p className="mt-6 text-sm font-bold uppercase tracking-wider text-destructive">Press and hold</p>
      </CardContent>
    </Card>
  );
}