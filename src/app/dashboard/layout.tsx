import { LocationProvider } from '@/hooks/use-location';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocationProvider>
      <div className="flex min-h-screen w-full flex-col bg-background">
        {children}
      </div>
    </LocationProvider>
  );
}
