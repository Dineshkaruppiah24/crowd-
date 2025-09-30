'use client';

import { AlertTriangle, Bluetooth, Info, ShieldCheck } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';

type Notification = {
  icon: JSX.Element;
  title: string;
  location: string;
  time: string;
  description: string;
  isMesh?: boolean;
};

const initialNotifications: Notification[] = [
  {
    icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
    title: 'High Crowd Density Alert',
    location: 'Central Plaza',
    time: '2m ago',
    description:
      'Avoid Central Plaza due to unexpected gathering. Alternate routes are advised.',
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-green-600" />,
    title: 'Area Secure',
    location: 'Market Street',
    time: '15m ago',
    description:
      'The incident on Market Street has been resolved. The area is now safe.',
  },
  {
    icon: <Info className="h-5 w-5 text-blue-500" />,
    title: 'Public Transport Update',
    location: 'City-wide',
    time: '1h ago',
    description:
      'Subway lines A and C are experiencing delays. Please consider alternative transport.',
  },
];

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    const handleMeshAlert = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { receivedAlert } = customEvent.detail;

      const newNotification: Notification = {
        icon: <Bluetooth className="h-5 w-5 text-primary" />,
        title: receivedAlert.title,
        location: receivedAlert.location,
        time: 'Just now',
        description: receivedAlert.description,
        isMesh: true,
      };

      setNotifications((prev) => [newNotification, ...prev]);
    };

    window.addEventListener('mesh-alert-received', handleMeshAlert);

    return () => {
      window.removeEventListener('mesh-alert-received', handleMeshAlert);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Safety Notifications</CardTitle>
        <CardDescription>Real-time alerts for your area.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {notifications.map((notification, index) => (
            <li
              key={index}
              className={`flex items-start gap-4 ${notification.isMesh ? 'rounded-lg border border-primary/50 bg-primary/10 p-3' : ''}`}
            >
              <div className="mt-1 flex-shrink-0">{notification.icon}</div>
              <div className="flex-grow">
                <div className="flex items-baseline justify-between">
                  <p className="font-semibold">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {notification.time}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
