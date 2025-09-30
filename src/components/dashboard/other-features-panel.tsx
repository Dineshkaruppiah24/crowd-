'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { MessageSquareWarning, Trash2, Users } from 'lucide-react';

const emergencyContacts = [
  { name: 'Jane Doe', relation: 'Spouse', phone: '(555) 123-4567' },
  { name: 'John Smith', relation: 'Friend', phone: '(555) 987-6543' },
];

export function OtherFeaturesPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tools & Settings</CardTitle>
        <CardDescription>Manage your safety preferences and report incidents.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="anonymous-reporting">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="anonymous-reporting">
              <MessageSquareWarning className="mr-2 h-4 w-4" />
              Anonymous Reporting
            </TabsTrigger>
            <TabsTrigger value="emergency-contacts">
              <Users className="mr-2 h-4 w-4" />
              Emergency Contacts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="anonymous-reporting" className="mt-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Report an incident anonymously. Your identity will remain private.
              </p>
              <div className="space-y-2">
                <Label htmlFor="incident-type">Type of Incident</Label>
                <Input id="incident-type" placeholder="e.g., Suspicious activity, Unsafe conditions" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incident-description">Description</Label>
                <Textarea
                  id="incident-description"
                  placeholder="Provide a brief description of the incident."
                />
              </div>
              <Button>Submit Report</Button>
            </div>
          </TabsContent>
          <TabsContent value="emergency-contacts" className="mt-6">
            <div className="space-y-4">
               <p className="text-sm text-muted-foreground">
                These contacts will be notified when you trigger an SOS alert.
              </p>
              <ul className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <li key={index} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-semibold">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.relation} - {contact.phone}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete {contact.name}</span>
                    </Button>
                  </li>
                ))}
              </ul>
              <Button variant="outline">Add New Contact</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
