
'use client';

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
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader, PlusCircle, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

type ServiceLine = {
  id: number;
  dateOfService: string;
  placeOfService: string;
  procedureCode: string;
  modifier1: string;
  modifier2: string;
  diagPointer: string;
  units: string;
  charges: string;
};

export default function NewClaimPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceLines, setServiceLines] = useState<ServiceLine[]>([
    {
      id: 1,
      dateOfService: '2024-07-26',
      placeOfService: '11',
      procedureCode: '99214',
      modifier1: '',
      modifier2: '',
      diagPointer: 'A',
      units: '1',
      charges: '250.00',
    },
  ]);
  const router = useRouter();

  const handleAddServiceLine = () => {
    setServiceLines([
      ...serviceLines,
      {
        id: Date.now(),
        dateOfService: '',
        placeOfService: '',
        procedureCode: '',
        modifier1: '',
        modifier2: '',
        diagPointer: '',
        units: '1',
        charges: '',
      },
    ]);
  };

  const handleRemoveServiceLine = (id: number) => {
    setServiceLines(serviceLines.filter((line) => line.id !== id));
  };

  const handleServiceLineChange = (
    id: number,
    field: keyof Omit<ServiceLine, 'id'>,
    value: string
  ) => {
    setServiceLines(
      serviceLines.map((line) =>
        line.id === id ? { ...line, [field]: value } : line
      )
    );
  };

  const totalCharges = serviceLines.reduce(
    (acc, line) => acc + (parseFloat(line.charges) || 0),
    0
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
        setIsSubmitting(false);
        toast({
            title: "Claim Submitted Successfully",
            description: `Claim ID C20240726009 has been created with a total charge of $${totalCharges.toFixed(2)}.`,
        });
        router.push('/claims');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="New Professional Claim (CMS-1500)" 
        description="Manually create and submit a new claim, modeled after the CMS-1500 form." 
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patient-name">Patient Name</Label>
                <Input id="patient-name" defaultValue="Eleanor Vance" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-dob">Date of Birth</Label>
                <Input id="patient-dob" type="date" defaultValue="1985-05-22" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-id">Patient ID</Label>
                <Input id="patient-id" defaultValue="P001" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-address">Patient Address</Label>
              <Input id="patient-address" defaultValue="123 Wellness Way, Healthville, CA 90210" required />
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Subscriber & Payer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                    <Checkbox id="insured-same-as-patient" defaultChecked />
                    <Label htmlFor="insured-same-as-patient">
                        Subscriber is the same as the patient
                    </Label>
                </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="subscriber-name">Subscriber Name</Label>
                        <Input id="subscriber-name" defaultValue="Eleanor Vance" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="payer">Payer</Label>
                         <Select required defaultValue="aetna">
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
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="policy-id">Policy ID</Label>
                        <Input id="policy-id" defaultValue="AET123456789" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="group-id">Group Number</Label>
                        <Input id="group-id" defaultValue="GRP-XYZ1" required />
                    </div>
                 </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clinical & Provider Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <Label>Diagnosis Codes (ICD-10)</Label>
            <div className="grid md:grid-cols-4 gap-4">
               <Input placeholder="A. (Primary)" required defaultValue="R05"/>
               <Input placeholder="B." />
               <Input placeholder="C." />
               <Input placeholder="D." />
            </div>
             <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="provider">Rendering Provider</Label>
                    <Select required defaultValue="dr-reed">
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
                    <Label htmlFor="referring-provider">Referring Provider Name (Optional)</Label>
                    <Input id="referring-provider" placeholder="Dr. Alan Grant" />
                </div>
             </div>
             <div className="pt-2 space-y-2">
                <Label htmlFor="prior-auth">Prior Authorization Number (Optional)</Label>
                <Input id="prior-auth" placeholder="e.g., AUTH123456789" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Lines</CardTitle>
            <CardDescription>
              Detail each service provided. All fields are required for each line.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceLines.map((line, index) => (
              <div key={line.id} className="grid grid-cols-12 gap-2 items-end p-3 rounded-md border bg-muted/10">
                <div className="col-span-12"><p className="font-medium text-sm">Line {index+1}</p></div>
                <div className="col-span-6 md:col-span-2 space-y-1">
                  <Label htmlFor={`dos-${line.id}`} className="text-xs">Date of Service</Label>
                  <Input id={`dos-${line.id}`} type="date" required value={line.dateOfService} onChange={e => handleServiceLineChange(line.id, 'dateOfService', e.target.value)} />
                </div>
                <div className="col-span-6 md:col-span-1 space-y-1">
                  <Label htmlFor={`pos-${line.id}`} className="text-xs">POS</Label>
                  <Input id={`pos-${line.id}`} required placeholder="e.g. 11" value={line.placeOfService} onChange={e => handleServiceLineChange(line.id, 'placeOfService', e.target.value)} />
                </div>
                <div className="col-span-12 md:col-span-2 space-y-1">
                  <Label htmlFor={`cpt-${line.id}`} className="text-xs">Procedure (CPT)</Label>
                  <Input id={`cpt-${line.id}`} required placeholder="e.g. 99214" value={line.procedureCode} onChange={e => handleServiceLineChange(line.id, 'procedureCode', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-2 col-span-6 md:col-span-2">
                    <div className="space-y-1">
                        <Label htmlFor={`mod1-${line.id}`} className="text-xs">Mod 1</Label>
                        <Input id={`mod1-${line.id}`} placeholder="25" value={line.modifier1} onChange={e => handleServiceLineChange(line.id, 'modifier1', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor={`mod2-${line.id}`} className="text-xs">Mod 2</Label>
                        <Input id={`mod2-${line.id}`} placeholder="59" value={line.modifier2} onChange={e => handleServiceLineChange(line.id, 'modifier2', e.target.value)} />
                    </div>
                </div>
                 <div className="col-span-6 md:col-span-1 space-y-1">
                  <Label htmlFor={`diag-${line.id}`} className="text-xs">Dx Ptr</Label>
                  <Input id={`diag-${line.id}`} required placeholder="e.g. A" value={line.diagPointer} onChange={e => handleServiceLineChange(line.id, 'diagPointer', e.target.value)} />
                </div>
                <div className="col-span-4 md:col-span-1 space-y-1">
                  <Label htmlFor={`units-${line.id}`} className="text-xs">Units</Label>
                  <Input id={`units-${line.id}`} type="number" required value={line.units} onChange={e => handleServiceLineChange(line.id, 'units', e.target.value)} />
                </div>
                 <div className="col-span-4 md:col-span-2 space-y-1">
                  <Label htmlFor={`charges-${line.id}`} className="text-xs">Charges ($)</Label>
                  <Input id={`charges-${line.id}`} type="number" required placeholder="150.00" value={line.charges} onChange={e => handleServiceLineChange(line.id, 'charges', e.target.value)} />
                </div>
                <div className="col-span-4 md:col-span-1 flex items-center">
                    {serviceLines.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveServiceLine(line.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove line</span>
                        </Button>
                    )}
                </div>
              </div>
            ))}
             <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddServiceLine}
              className="mt-2"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Service Line
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end bg-muted/50 p-4 mt-4 rounded-b-lg">
            <div className="font-bold text-lg">
              Total Charges: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalCharges)}
            </div>
          </CardFooter>
        </Card>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
             {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
             Submit Claim
          </Button>
        </div>
      </form>
    </div>
  )
}
