'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Patient } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import { Loader, User, Mail, Phone, Home, Users, Briefcase } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export function EditPatientDialog({ patient }: { patient: Patient }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    // Simulate API call to save patient data
    setTimeout(() => {
      setIsSaving(false);
      setIsOpen(false);
      toast({
        title: 'Patient Updated',
        description: `${patient.name}'s details have been successfully updated.`,
      });
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Patient</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Patient Details</DialogTitle>
            <DialogDescription>
              Make changes to the patient's profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] p-4">
            <div className="space-y-6">
                {/* Patient Demographics */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2"><User className="h-5 w-5" /> Patient Demographics</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={patient.name} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input id="dob" type="date" defaultValue={patient.dob} required />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="gender">Gender</Label>
                            <Select required defaultValue={patient.gender}>
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
                </div>

                <Separator />

                {/* Contact Information */}
                 <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2"><Phone className="h-5 w-5" /> Contact Information</h4>
                    <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input id="address" defaultValue={patient.address} required />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" defaultValue={patient.city} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" defaultValue={patient.state} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="zip">ZIP Code</Label>
                            <Input id="zip" defaultValue={patient.zip} required />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" defaultValue={patient.phone} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={patient.email} required />
                        </div>
                    </div>
                </div>

                <Separator />

                 {/* Subscriber Information */}
                 <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2"><Users className="h-5 w-5" /> Subscriber Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="subscriberName">Subscriber Name</Label>
                            <Input id="subscriberName" defaultValue={patient.subscriberName} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subscriberDob">Subscriber DOB</Label>
                            <Input id="subscriberDob" type="date" defaultValue={patient.subscriberDob} required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subscriberRelationship">Relationship to Patient</Label>
                        <Select required defaultValue={patient.subscriberRelationship}>
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

                {/* Primary Insurance */}
                <div className="space-y-4">
                     <h4 className="font-semibold text-lg flex items-center gap-2"><Briefcase className="h-5 w-5" /> Primary Insurance</h4>
                     <div className="space-y-2">
                        <Label htmlFor="primaryInsuranceProvider">Payer Name</Label>
                        <Input id="primaryInsuranceProvider" defaultValue={patient.primaryInsuranceProvider} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="primaryInsuranceId">Policy ID / Member ID</Label>
                            <Input id="primaryInsuranceId" defaultValue={patient.primaryInsuranceId} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="primaryInsuranceGroup">Group Number</Label>
                            <Input id="primaryInsuranceGroup" defaultValue={patient.primaryInsuranceGroup} required />
                        </div>
                    </div>
                </div>

                 <Separator />

                 {/* Secondary Insurance */}
                <div className="space-y-4">
                     <h4 className="font-semibold text-lg flex items-center gap-2"><Briefcase className="h-5 w-5" /> Secondary Insurance</h4>
                     <div className="space-y-2">
                        <Label htmlFor="secondaryInsuranceProvider">Payer Name</Label>
                        <Input id="secondaryInsuranceProvider" defaultValue={patient.secondaryInsuranceProvider} placeholder="Optional" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="secondaryInsuranceId">Policy ID / Member ID</Label>
                            <Input id="secondaryInsuranceId" defaultValue={patient.secondaryInsuranceId} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="secondaryInsuranceGroup">Group Number</Label>
                            <Input id="secondaryInsuranceGroup" defaultValue={patient.secondaryInsuranceGroup} />
                        </div>
                    </div>
                </div>
            </div>
          </ScrollArea>
          <DialogFooter className="pt-6">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
