
'use client';

import { useState, useEffect } from 'react';
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
import { Loader, PlusCircle, Trash2, Link as LinkIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { appointments, patients, claims } from '@/lib/data';

type ServiceLine = {
  id: number;
  dateOfService: string;
  placeOfService: string;
  procedureCode: string;
  modifiers: string[];
  diagPointers: string[];
  units: string;
  charges: string;
};

// Get unique providers from claims data for the dropdown
const providers = [...new Set(claims.map(c => c.provider))];
const completedVisits = appointments.filter(a => a.status === 'Checked Out').map(a => {
    const patient = patients.find(p => p.id === a.patientId);
    return { ...a, patientName: patient?.name || 'Unknown' };
});

export default function NewClaimPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Controlled form state
  const [patientName, setPatientName] = useState('');
  const [patientDob, setPatientDob] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [isSubscriberSame, setIsSubscriberSame] = useState(true);
  const [subscriberName, setSubscriberName] = useState('');
  const [payer, setPayer] = useState('');
  const [policyId, setPolicyId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [dxCodes, setDxCodes] = useState(['', '', '', '', '', '']);
  const [provider, setProvider] = useState('');
  const [referringProvider, setReferringProvider] = useState('');
  const [priorAuth, setPriorAuth] = useState('');
  const [serviceLines, setServiceLines] = useState<ServiceLine[]>([]);
  const [selectedVisitId, setSelectedVisitId] = useState<string>('');

  useEffect(() => {
    if (!selectedVisitId) return;

    const visit = appointments.find(a => a.id === selectedVisitId);
    if (!visit) return;
    const patient = patients.find(p => p.id === visit.patientId);
    if (!patient) return;

    setPatientName(patient.name);
    setPatientDob(patient.dob);
    setPatientId(patient.id);
    setPatientAddress(`${patient.address}, ${patient.city}, ${patient.state} ${patient.zip}`);
    
    setSubscriberName(patient.subscriberName);
    const subscriberIsPatient = patient.subscriberRelationship === 'Self';
    setIsSubscriberSame(subscriberIsPatient);
    if (subscriberIsPatient) {
        setSubscriberName(patient.name);
    }

    const payerValue = patient.primaryInsuranceProvider.toLowerCase().replace(/ /g, '').replace('bluecrossblueshield', 'bcbs');
    setPayer(payerValue);
    setPolicyId(patient.primaryInsuranceId);
    setGroupId(patient.primaryInsuranceGroup);
    setProvider(visit.provider);

    const [procCode] = visit.procedure.split(' - ');
    setServiceLines([{
        id: Date.now(),
        dateOfService: visit.date,
        placeOfService: '11', // Office
        procedureCode: procCode || '',
        modifiers: ['', ''],
        diagPointers: ['A', ''],
        units: '1',
        charges: '',
    }]);

  }, [selectedVisitId]);

  const handleAddServiceLine = () => {
    setServiceLines([
      ...serviceLines,
      {
        id: Date.now(),
        dateOfService: '',
        placeOfService: '',
        procedureCode: '',
        modifiers: ['', ''],
        diagPointers: ['', ''],
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
    field: keyof Omit<ServiceLine, 'id' | 'modifiers' | 'diagPointers'>,
    value: string
  ) => {
    setServiceLines(
      serviceLines.map((line) =>
        line.id === id ? { ...line, [field]: value } : line
      )
    );
  };

  const handleArrayFieldChange = (id: number, field: 'modifiers' | 'diagPointers', index: number, value: string) => {
      setServiceLines(
          serviceLines.map(line => {
              if (line.id === id) {
                  const newArray = [...line[field]];
                  newArray[index] = value;
                  return {...line, [field]: newArray};
              }
              return line;
          })
      )
  }

  const handleAddArrayField = (id: number, field: 'modifiers' | 'diagPointers') => {
      setServiceLines(
          serviceLines.map(line => {
              if (line.id === id && line[field].length < 4) {
                  const newArray = [...line[field], ''];
                  return {...line, [field]: newArray};
              }
              return line;
          })
      )
  }

  const handleDxCodeChange = (index: number, value: string) => {
    const newDxCodes = [...dxCodes];
    newDxCodes[index] = value.toUpperCase();
    setDxCodes(newDxCodes);
  };

  const totalCharges = serviceLines.reduce(
    (acc, line) => acc + (parseFloat(line.charges) || 0),
    0
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
        setIsSubmitting(false);
        toast({
            title: "Claim Submitted Successfully",
            description: `Claim for ${patientName} has been created with a total charge of $${totalCharges.toFixed(2)}.`,
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
       <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LinkIcon className="h-5 w-5 text-accent"/> Link to Patient Visit</CardTitle>
            <CardDescription>Select a completed visit to automatically populate claim information.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
                 <Label htmlFor="visit-select">Completed Visits</Label>
                <Select value={selectedVisitId} onValueChange={setSelectedVisitId}>
                    <SelectTrigger id="visit-select">
                        <SelectValue placeholder="Select a visit to pre-fill form..." />
                    </SelectTrigger>
                    <SelectContent>
                        {completedVisits.map(visit => (
                            <SelectItem key={visit.id} value={visit.id}>
                                {visit.date} - {visit.patientName} ({visit.procedure})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </CardContent>
        </Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patient-name">Patient Name</Label>
                <Input id="patient-name" value={patientName} onChange={e => setPatientName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-dob">Date of Birth</Label>
                <Input id="patient-dob" type="date" value={patientDob} onChange={e => setPatientDob(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-id">Patient ID</Label>
                <Input id="patient-id" value={patientId} onChange={e => setPatientId(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-address">Patient Address</Label>
              <Input id="patient-address" value={patientAddress} onChange={e => setPatientAddress(e.target.value)} required />
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Subscriber & Payer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                    <Checkbox id="insured-same-as-patient" checked={isSubscriberSame} onCheckedChange={(checked) => setIsSubscriberSame(!!checked)} />
                    <Label htmlFor="insured-same-as-patient">
                        Subscriber is the same as the patient
                    </Label>
                </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="subscriber-name">Subscriber Name</Label>
                        <Input id="subscriber-name" value={subscriberName} onChange={e => setSubscriberName(e.target.value)} required disabled={isSubscriberSame} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="payer">Payer</Label>
                         <Select required value={payer} onValueChange={setPayer}>
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
                        <Input id="policy-id" value={policyId} onChange={e => setPolicyId(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="group-id">Group Number</Label>
                        <Input id="group-id" value={groupId} onChange={e => setGroupId(e.target.value)} />
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
            <div className="grid md:grid-cols-6 gap-4">
                {dxCodes.map((code, index) => (
                    <Input 
                        key={index}
                        placeholder={`${String.fromCharCode(65 + index)}. (Primary)`}
                        required={index === 0}
                        value={code}
                        onChange={e => handleDxCodeChange(index, e.target.value)}
                    />
                ))}
            </div>
             <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="provider">Rendering Provider</Label>
                    <Select required value={provider} onValueChange={setProvider}>
                        <SelectTrigger id="provider">
                            <SelectValue placeholder="Select a provider" />
                        </SelectTrigger>
                        <SelectContent>
                            {providers.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="referring-provider">Referring Provider Name (Optional)</Label>
                    <Input id="referring-provider" placeholder="Dr. Alan Grant" value={referringProvider} onChange={e => setReferringProvider(e.target.value)} />
                </div>
             </div>
             <div className="pt-2 space-y-2">
                <Label htmlFor="prior-auth">Prior Authorization Number (Optional)</Label>
                <Input id="prior-auth" placeholder="e.g., AUTH123456789" value={priorAuth} onChange={e => setPriorAuth(e.target.value)} />
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
            {serviceLines.length === 0 && (
                <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
                    <p>No service lines added.</p>
                    <p className="text-sm">Add a service line below or select a visit to auto-populate.</p>
                </div>
            )}
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
                
                <div className="col-span-12 md:col-span-3 flex items-end gap-1">
                    {line.modifiers.map((mod, modIndex) => (
                        <div key={modIndex} className="space-y-1 flex-1">
                            <Label htmlFor={`mod${modIndex}-${line.id}`} className="text-xs">Mod {modIndex + 1}</Label>
                            <Input id={`mod${modIndex}-${line.id}`} value={mod} onChange={e => handleArrayFieldChange(line.id, 'modifiers', modIndex, e.target.value)} />
                        </div>
                    ))}
                    {line.modifiers.length < 4 && (
                        <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAddArrayField(line.id, 'modifiers')}>
                            <PlusCircle className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="col-span-12 md:col-span-3 flex items-end gap-1">
                    {line.diagPointers.map((diag, diagIndex) => (
                        <div key={diagIndex} className="space-y-1 flex-1">
                            <Label htmlFor={`diag${diagIndex}-${line.id}`} className="text-xs">Dx {diagIndex + 1}</Label>
                            <Input id={`diag${diagIndex}-${line.id}`} required={diagIndex === 0} maxLength={1} value={diag} onChange={e => handleArrayFieldChange(line.id, 'diagPointers', diagIndex, e.target.value)} />
                        </div>
                    ))}
                    {line.diagPointers.length < 4 && (
                        <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAddArrayField(line.id, 'diagPointers')}>
                            <PlusCircle className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                 <div className="col-span-4 md:col-span-1 space-y-1">
                  <Label htmlFor={`units-${line.id}`} className="text-xs">Units</Label>
                  <Input id={`units-${line.id}`} type="number" required value={line.units} onChange={e => handleServiceLineChange(line.id, 'units', e.target.value)} />
                </div>
                 <div className="col-span-4 md:col-span-1 space-y-1">
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
