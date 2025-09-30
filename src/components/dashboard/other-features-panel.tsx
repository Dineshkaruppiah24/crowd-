
'use client';

import { useState } from 'react';
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
import { MessageSquareWarning, Trash2, Users, PlusCircle, Bluetooth } from 'lucide-react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  relation: z.string().min(1, 'Relation is required'),
  phone: z.string().min(10, 'Phone number is required'),
});

type EmergencyContact = z.infer<typeof emergencyContactSchema>;

const formSchema = z.object({
  emergencyContacts: z.array(emergencyContactSchema),
  newContact: emergencyContactSchema.optional(),
});

const initialContacts: EmergencyContact[] = [
  { name: 'Jane Doe', relation: 'Spouse', phone: '(555) 123-4567' },
  { name: 'John Smith', relation: 'Friend', phone: '(555) 987-6543' },
];

export function OtherFeaturesPanel() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(initialContacts);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: {
      name: '',
      relation: '',
      phone: '',
    },
  });

  const onSubmit = (data: EmergencyContact) => {
    setContacts([...contacts, data]);
    reset();
    setShowAddForm(false);
  };

  const deleteContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };
  
  const handleMeshAlert = () => {
    toast({
      title: "Simulating Mesh Alert",
      description: "Broadcasting a low-energy alert to nearby devices.",
    });
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Tools & Settings</CardTitle>
        <CardDescription>Manage your safety preferences and report incidents.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="emergency-contacts">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="anonymous-reporting">
              <MessageSquareWarning className="mr-2 h-4 w-4" />
              Anonymous Reporting
            </TabsTrigger>
            <TabsTrigger value="emergency-contacts">
              <Users className="mr-2 h-4 w-4" />
              Emergency Contacts
            </TabsTrigger>
            <TabsTrigger value="mesh-alert">
              <Bluetooth className="mr-2 h-4 w-4" />
              Offline Mesh Alert
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
                {contacts.map((contact, index) => (
                  <li key={index} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-semibold">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.relation} - {contact.phone}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => deleteContact(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete {contact.name}</span>
                    </Button>
                  </li>
                ))}
              </ul>

              {showAddForm ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border p-4">
                  <h4 className="font-semibold">Add New Contact</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" {...register('name')} placeholder="e.g., John Doe" />
                      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relation">Relation</Label>
                      <Input id="relation" {...register('relation')} placeholder="e.g., Sibling" />
                      {errors.relation && <p className="text-xs text-destructive">{errors.relation.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" {...register('phone')} type="tel" placeholder="e.g., (555) 555-5555" />
                       {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => { setShowAddForm(false); reset(); }}>Cancel</Button>
                    <Button type="submit">Save Contact</Button>
                  </div>
                </form>
              ) : (
                <Button variant="outline" onClick={() => setShowAddForm(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Contact
                </Button>
              )}
            </div>
          </TabsContent>
           <TabsContent value="mesh-alert" className="mt-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If cellular networks are unavailable, you can broadcast a low-energy Bluetooth alert to other CrowdCompass users nearby. This can help create a local mesh network for essential communication.
              </p>
              <Button onClick={handleMeshAlert}>
                <Bluetooth className="mr-2 h-4 w-4" />
                Activate Mesh Alert
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
