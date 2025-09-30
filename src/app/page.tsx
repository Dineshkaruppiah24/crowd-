// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useToast } from '@/hooks/use-toast';
import { CrowdCompassLogo } from '@/components/icons';
import { KeyRound, Mail, Phone, LogIn } from 'lucide-react';

const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  captcha: z.string().refine(val => !isNaN(parseInt(val, 10)), {
    message: 'Please enter a number.',
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0 });

  useEffect(() => {
    generateCaptcha();
  }, []);
  
  const generateCaptcha = () => {
    setCaptcha({
      num1: Math.floor(Math.random() * 10) + 1,
      num2: Math.floor(Math.random() * 10) + 1,
    });
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: '',
      password: '',
      captcha: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    const expectedAnswer = captcha.num1 + captcha.num2;
    if (parseInt(data.captcha, 10) !== expectedAnswer) {
      toast({
        variant: 'destructive',
        title: 'Incorrect CAPTCHA',
        description: 'Please solve the math problem correctly.',
      });
       generateCaptcha();
       form.setValue('captcha', '');
      return;
    }

    toast({
      title: 'Login Successful',
      description: 'Redirecting you to the dashboard...',
    });
    // In a real app, you would perform authentication here
    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="absolute top-8 left-8 flex items-center gap-3 text-foreground">
         <CrowdCompassLogo className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">
          CrowdCompass
        </h1>
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="emailOrPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Phone Number</FormLabel>
                    <div className="relative">
                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="e.g., user@example.com or (555) 123-4567"
                          className="pl-10"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                     <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                           className="pl-10"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="captcha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Check</FormLabel>
                     <div className="flex items-center gap-4">
                       <span className="text-lg font-semibold text-muted-foreground">
                        {captcha.num1} + {captcha.num2} = ?
                      </span>
                      <FormControl>
                        <Input
                          placeholder="Your answer"
                          className="w-32"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-lg" size="lg">
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
           <Button variant="link" className="text-sm">
              Forgot password?
            </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
