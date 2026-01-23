'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader, User, Users, Briefcase, Phone, Checkbox } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function NewPatientPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
        setIsSubmitting(false);
        toast({
            title: "Patient Created Successfully",
            description: "A new patient profile has been added to the system.",
        });
        router.push('/patients');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Add New Patient" 
        description="Create a new patient profile with their demographic and insurance information."
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-6 w-6"/> Patient Demographics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patient-name">Full Name</Label>
                <Input id="patient-name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-dob">Date of Birth</Label>
                <Input id="patient-dob" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                 <Select required>
                    <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" placeholder="123 Main St" required />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Anytown" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="CA" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="12345" required />
                </div>
            </div>
             <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="(555) 555-5555" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" required />
                </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6"/> Subscriber & Insurance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="flex items-center space-x-2">
                    <Checkbox id="subscriber-same-as-patient" defaultChecked />
                    <Label htmlFor="subscriber-same-as-patient">
                        Subscriber is the same as the patient
                    </Label>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="subscriberName">Subscriber Name</Label>
                        <Input id="subscriberName" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="subscriberRelationship">Relationship to Patient</Label>
                        <Select required defaultValue="Self">
                            <SelectTrigger id="subscriberRelationship">
                                <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Self">Self</SelectItem>
                                <SelectItem value="Spouse">Spouse</SelectItem>
                                <SelectItem value="Child">Child</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                 </div>
                 <Separator />
                  <h3 className="font-medium text-lg flex items-center gap-2"><Briefcase className="h-5 w-5"/> Primary Insurance</h3>
                   <div className="space-y-2">
                        <Label htmlFor="primaryPayer">Payer Name</Label>
                        <Input id="primaryPayer" required />
                    </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="primaryPolicyId">Policy ID / Member ID</Label>
                        <Input id="primaryPolicyId" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="primaryGroupId">Group Number</Label>
                        <Input id="primaryGroupId" required />
                    </div>
                 </div>
                <Separator />
                  <h3 className="font-medium text-lg flex items-center gap-2"><Briefcase className="h-5 w-5"/> Secondary Insurance (Optional)</h3>
                   <div className="space-y-2">
                        <Label htmlFor="secondaryPayer">Payer Name</Label>
                        <Input id="secondaryPayer" />
                    </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="secondaryPolicyId">Policy ID / Member ID</Label>
                        <Input id="secondaryPolicyId" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="secondaryGroupId">Group Number</Label>
                        <Input id="secondaryGroupId" />
                    </div>
                 </div>
            </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
             {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
             Create Patient
          </Button>
        </div>
      </form>
    </div>
  )
}
