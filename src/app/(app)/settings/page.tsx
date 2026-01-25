'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';
import { Loader, User, Shield, Palette, Database } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { seedDatabase } from '@/lib/seed-db';

const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50, { message: "Name must not be longer than 50 characters." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function SettingsPage() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (user) {
      form.reset({ displayName: user.displayName || '' });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!auth.currentUser) return;
    
    setIsSaving(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: data.displayName,
      });
      toast({
        title: 'Profile Updated',
        description: 'Your display name has been successfully updated.',
      });
      form.reset(data); // To reset the dirty state
    } catch (error: any) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeed = async () => {
    if (!firestore) {
      toast({ title: "Firestore not available", variant: "destructive" });
      return;
    }
    setIsSeeding(true);
    await seedDatabase(firestore);
    setIsSeeding(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your application and manage your account."
      />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account">
            <Shield className="mr-2 h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="mr-2 h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                  <CardHeader>
                      <CardTitle>User Profile</CardTitle>
                      <CardDescription>Manage your public profile information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <FormField
                          control={form.control}
                          name="displayName"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Display Name</FormLabel>
                                  <FormControl>
                                      <Input placeholder="Your Name" {...field} className="max-w-sm" />
                                  </FormControl>
                                  <FormDescription>
                                  This is the name that will be displayed throughout the application.
                                  </FormDescription>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                             <Input value={user?.email || ''} disabled className="max-w-sm" />
                          </FormControl>
                          <FormDescription>Your email address cannot be changed.</FormDescription>
                      </FormItem>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                      <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
                          {isSaving && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                          Save Changes
                      </Button>
                  </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your account security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h3 className="font-semibold">Change Password</h3>
                        <p className="text-sm text-muted-foreground">It's a good idea to use a strong password that you're not using elsewhere.</p>
                    </div>
                    <Button variant="outline" disabled>Change Password</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                    <div>
                        <h3 className="font-semibold text-destructive">Delete Account</h3>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all of your content. This action is irreversible.</p>
                    </div>
                    <Button variant="destructive" disabled>Delete Account</Button>
                </div>
            </CardContent>
          </Card>
          <Card className="mt-6">
              <CardHeader>
                  <CardTitle>Developer Settings</CardTitle>
                  <CardDescription>Actions for development and testing purposes.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                          <h3 className="font-semibold">Seed Database</h3>
                          <p className="text-sm text-muted-foreground">Populate the database with dummy data. This will overwrite existing data with the same IDs.</p>
                      </div>
                      <Button variant="outline" onClick={handleSeed} disabled={isSeeding}>
                          {isSeeding ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                          Seed Data
                      </Button>
                  </div>
              </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h3 className="font-semibold">Theme</h3>
                        <p className="text-sm text-muted-foreground">Select a theme for the application.</p>
                    </div>
                    <Button variant="outline" disabled>Toggle Theme</Button>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
