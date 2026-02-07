
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
import { Loader, User, Phone, Users, Briefcase } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFirestore } from '@/firebase';
import { doc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function EditPatientDialog({ patient }: { patient: Patient }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const firestore = useFirestore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore) return;
    
    setIsSaving(true);
    const formData = new FormData(event.currentTarget);
    
    const updatedData = {
        name: formData.get('name'),
        dob: formData.get('dob'),
        gender: formData.get('gender'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip: formData.get('zip'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        subscriberName: formData.get('subscriberName'),
        subscriberDob: formData.get('subscriberDob'),
        subscriberRelationship: formData.get('subscriberRelationship'),
        primaryInsuranceProvider: formData.get('primaryInsuranceProvider'),
        primaryInsuranceId: formData.get('primaryInsuranceId'),
        primaryInsuranceGroup: formData.get('primaryInsuranceGroup'),
        secondaryInsuranceProvider: formData.get('secondaryInsuranceProvider'),
        secondaryInsuranceId: formData.get('secondaryInsuranceId'),
        secondaryInsuranceGroup: formData.get('secondaryInsuranceGroup'),
    };

    try {
        const patientRef = doc(firestore, 'patients', patient.id);
        await updateDoc(patientRef, updatedData);
        
        // Log activity
        await addDoc(collection(firestore, 'recentActivity'), {
            user: 'Admin',
            avatar: 'https://picsum.photos/seed/admin/40/40',
            action: 'updated profile for',
            target: patient.name,
            time: 'Just now',
            practiceId: patient.practiceId,
            createdAt: serverTimestamp()
        });

        toast({
            title: 'Patient Updated',
            description: `${patient.name}'s details have been successfully updated.`,
        });
        setIsOpen(false);
    } catch (error: any) {
        toast({
            title: 'Error updating patient',
            description: error.message,
            variant: 'destructive',
        });
    } finally {
        setIsSaving(false);
    }
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
                            <Input id="name" name="name" defaultValue={patient.name} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input id="dob" name="dob" type="date" defaultValue={patient.dob} required />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="gender">Gender</Label>
                            <Select required name="gender" defaultValue={patient.gender}>
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
                        <Input id="address" name="address" defaultValue={patient.address} required />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" defaultValue={patient.city} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" name="state" defaultValue={patient.state} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="zip">ZIP Code</Label>
                            <Input id="zip" name="zip" defaultValue={patient.zip} required />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" name="phone" type="tel" defaultValue={patient.phone} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" defaultValue={patient.email} required />
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
                            <Input id="subscriberName" name="subscriberName" defaultValue={patient.subscriberName} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subscriberDob">Subscriber DOB</Label>
                            <Input id="subscriberDob" name="subscriberDob" type="date" defaultValue={patient.subscriberDob} required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subscriberRelationship">Relationship to Patient</Label>
                        <Select required name="subscriberRelationship" defaultValue={patient.subscriberRelationship}>
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
                        <Input id="primaryInsuranceProvider" name="primaryInsuranceProvider" defaultValue={patient.primaryInsuranceProvider} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="primaryInsuranceId">Policy ID / Member ID</Label>
                            <Input id="primaryInsuranceId" name="primaryInsuranceId" defaultValue={patient.primaryInsuranceId} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="primaryInsuranceGroup">Group Number</Label>
                            <Input id="primaryInsuranceGroup" name="primaryInsuranceGroup" defaultValue={patient.primaryInsuranceGroup} required />
                        </div>
                    </div>
                </div>

                 <Separator />

                 {/* Secondary Insurance */}
                <div className="space-y-4">
                     <h4 className="font-semibold text-lg flex items-center gap-2"><Briefcase className="h-5 w-5" /> Secondary Insurance</h4>
                     <div className="space-y-2">
                        <Label htmlFor="secondaryInsuranceProvider">Payer Name</Label>
                        <Input id="secondaryInsuranceProvider" name="secondaryInsuranceProvider" defaultValue={patient.secondaryInsuranceProvider} placeholder="Optional" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="secondaryInsuranceId">Policy ID / Member ID</Label>
                            <Input id="secondaryInsuranceId" name="secondaryInsuranceId" defaultValue={patient.secondaryInsuranceId} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="secondaryInsuranceGroup">Group Number</Label>
                            <Input id="secondaryInsuranceGroup" name="secondaryInsuranceGroup" defaultValue={patient.secondaryInsuranceGroup} />
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
