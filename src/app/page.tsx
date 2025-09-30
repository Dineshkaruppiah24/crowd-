import { Header } from '@/components/dashboard/header';
import { NotificationsPanel } from '@/components/dashboard/notifications-panel';
import { OtherFeaturesPanel } from '@/components/dashboard/other-features-panel';
import { RouteOptimizer } from '@/components/dashboard/route-optimizer';
import { SosPanel } from '@/components/dashboard/sos-panel';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-6 lg:col-span-2 lg:gap-8">
            <RouteOptimizer />
            <OtherFeaturesPanel />
          </div>
          <div className="grid auto-rows-max items-start gap-6 lg:col-span-1 lg:gap-8">
            <SosPanel />
            <NotificationsPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
