
'use client'

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function NewClaimPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
        setIsSubmitting(false);
        toast({
            title: "Claim Submitted Successfully",
            description: "Claim ID C20240726009 has been created and is now being processed.",
        });
        router.push('/claims');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="New Claim" 
        description="Manually create and submit a new claim." 
      />
      <form onSubmit={handleSubmit}>
        <Card>
            <CardHeader>
                <CardTitle>Claim Information</CardTitle>
                <CardDescription>Fill out the details below to create a new claim.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="patient-id">Patient ID</Label>
                        <Input id="patient-id" placeholder="e.g., P001" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="patient-name">Patient Name</Label>
                        <Input id="patient-name" placeholder="e.g., Eleanor Vance" required />
                    </div>
                </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="provider">Provider</Label>
                         <Select required>
                            <SelectTrigger id="provider">
                                <SelectValue placeholder="Select a provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dr-reed">Dr. Evelyn Reed</SelectItem>
                                <SelectItem value="dr-carter">Dr. Ben Carter</SelectItem>
                                <SelectItem value="dr-khan">Dr. Samira Khan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="payer">Payer</Label>
                         <Select required>
                            <SelectTrigger id="payer">
                                <SelectValue placeholder="Select a payer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="aetna">Aetna</SelectItem>
                                <SelectItem value="cigna">Cigna</SelectItem>
                                <SelectItem value="uhc">United Healthcare</SelectItem>
                                <SelectItem value="bcbs">BlueCross BlueShield</SelectItem>
                                <SelectItem value="humana">Humana</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Separator />
                <div className="space-y-2">
                    <Label htmlFor="service-details">Service Details</Label>
                    <Textarea id="service-details" placeholder="Enter clinical notes, procedure descriptions, etc." required />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <Label htmlFor="procedure-code">Procedure Code (CPT)</Label>
                        <Input id="procedure-code" placeholder="e.g., 99214" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="diagnosis-code">Diagnosis Code (ICD-10)</Label>
                        <Input id="diagnosis-code" placeholder="e.g., R05" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="claim-amount">Claim Amount</Label>
                        <Input id="claim-amount" type="number" placeholder="e.g., 1250.75" required />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                 <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                 <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Claim
                </Button>
            </CardFooter>
        </Card>
      </form>
    </div>
  )
}
