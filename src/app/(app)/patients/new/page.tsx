'use client';

import { useState, useRef } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader, User, Users, Briefcase, Phone, Wand2, UploadCloud } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { autoFillPatientData } from '@/ai/flows/auto-fill-patient-data';
import { Checkbox } from '@/components/ui/checkbox';
import { usePractice } from '@/context/practice-context';

type PatientFormData = {
    patientName: string;
    dob: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    subscriberSameAsPatient: boolean;
    subscriberName: string;
    subscriberRelationship: string;
    primaryPayer: string;
    primaryPolicyId: string;
    primaryGroupId: string;
    secondaryPayer: string;
    secondaryPolicyId: string;
    secondaryGroupId: string;
}

const initialFormData: PatientFormData = {
    patientName: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    subscriberSameAsPatient: true,
    subscriberName: '',
    subscriberRelationship: 'Self',
    primaryPayer: '',
    primaryPolicyId: '',
    primaryGroupId: '',
    secondaryPayer: '',
    secondaryPolicyId: '',
    secondaryGroupId: '',
}

export default function NewPatientPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [formData, setFormData] = useState<PatientFormData>(initialFormData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { selectedPractice } = usePractice();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (id: keyof PatientFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  }

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  };

  const handleAutoFill = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
        toast({
            title: "No file selected",
            description: "Please select an insurance card image to auto-fill.",
            variant: "destructive"
        });
        return;
    }
    setIsAutoFilling(true);
    try {
        const dataUri = await fileToDataUri(file);
        const result = await autoFillPatientData({ insuranceCardDataUri: dataUri });
        setFormData(prev => ({
            ...prev,
            patientName: result.patientName || prev.patientName,
            dob: result.dateOfBirth ? new Date(result.dateOfBirth).toISOString().split('T')[0] : prev.dob,
            address: result.address || prev.address,
            primaryPayer: result.insuranceProvider || prev.primaryPayer,
            primaryPolicyId: result.policyNumber || prev.primaryPolicyId,
        }));
        toast({
            title: "AI Auto-fill Complete",
            description: "Patient data has been extracted from the image.",
        });
    } catch (error) {
        console.error("Error auto-filling patient data:", error);
        toast({
            title: "Auto-fill Failed",
            description: "Could not extract data from the provided image. Please fill manually.",
            variant: "destructive"
        });
    } finally {
        setIsAutoFilling(false);
    }
  };


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const newPatientData = {
        ...formData,
        practiceId: selectedPractice.id
    };
    console.log("Submitting patient data:", newPatientData);

    // Simulate API call
    setTimeout(() => {
        setIsSubmitting(false);
        toast({
            title: "Patient Created Successfully",
            description: `${formData.patientName} has been added to the system.`,
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

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wand2 className="h-6 w-6 text-accent"/> Smart Patient Registration</CardTitle>
                <CardDescription>Upload an image of an insurance card to automatically fill in patient details using AI.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="insurance-card">Insurance Card Photo</Label>
                        <Input id="insurance-card" type="file" accept="image/*" ref={fileInputRef} />
                    </div>
                     <Button type="button" onClick={handleAutoFill} disabled={isAutoFilling} className="w-full md:w-auto mt-4 md:mt-0">
                        {isAutoFilling ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                        Auto-fill with AI
                    </Button>
                </div>
            </CardContent>
        </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-6 w-6"/> Patient Demographics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patientName">Full Name</Label>
                <Input id="patientName" placeholder="John Doe" required value={formData.patientName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" required value={formData.dob} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                 <Select required value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
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
                <Input id="address" placeholder="123 Main St" required value={formData.address} onChange={handleInputChange} />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Anytown" required value={formData.city} onChange={handleInputChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="CA" required value={formData.state} onChange={handleInputChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="12345" required value={formData.zip} onChange={handleInputChange} />
                </div>
            </div>
             <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="(555) 555-5555" required value={formData.phone} onChange={handleInputChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" required value={formData.email} onChange={handleInputChange} />
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
                    <Checkbox id="subscriberSameAsPatient" checked={formData.subscriberSameAsPatient} onCheckedChange={(checked) => handleSelectChange('subscriberSameAsPatient', !!checked)} />
                    <Label htmlFor="subscriberSameAsPatient">
                        Subscriber is the same as the patient
                    </Label>
                 </div>
                 {!formData.subscriberSameAsPatient && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="subscriberName">Subscriber Name</Label>
                            <Input id="subscriberName" required={!formData.subscriberSameAsPatient} value={formData.subscriberName} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subscriberRelationship">Relationship to Patient</Label>
                            <Select required={!formData.subscriberSameAsPatient} value={formData.subscriberRelationship} onValueChange={(value) => handleSelectChange('subscriberRelationship', value)}>
                                <SelectTrigger id="subscriberRelationship">
                                    <SelectValue placeholder="Select relationship" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Spouse">Spouse</SelectItem>
                                    <SelectItem value="Child">Child</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                 )}
                 <Separator />
                  <h3 className="font-medium text-lg flex items-center gap-2"><Briefcase className="h-5 w-5"/> Primary Insurance</h3>
                   <div className="space-y-2">
                        <Label htmlFor="primaryPayer">Payer Name</Label>
                        <Input id="primaryPayer" required value={formData.primaryPayer} onChange={handleInputChange} />
                    </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="primaryPolicyId">Policy ID / Member ID</Label>
                        <Input id="primaryPolicyId" required value={formData.primaryPolicyId} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="primaryGroupId">Group Number</Label>
                        <Input id="primaryGroupId" value={formData.primaryGroupId} onChange={handleInputChange} />
                    </div>
                 </div>
                <Separator />
                  <h3 className="font-medium text-lg flex items-center gap-2"><Briefcase className="h-5 w-5"/> Secondary Insurance (Optional)</h3>
                   <div className="space-y-2">
                        <Label htmlFor="secondaryPayer">Payer Name</Label>
                        <Input id="secondaryPayer" value={formData.secondaryPayer} onChange={handleInputChange} />
                    </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="secondaryPolicyId">Policy ID / Member ID</Label>
                        <Input id="secondaryPolicyId" value={formData.secondaryPolicyId} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="secondaryGroupId">Group Number</Label>
                        <Input id="secondaryGroupId" value={formData.secondaryGroupId} onChange={handleInputChange} />
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
