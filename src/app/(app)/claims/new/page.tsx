
'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Loader, PlusCircle, Trash2, Link as LinkIcon, FileText, Printer, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { usePractice } from '@/context/practice-context';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, query, where, Timestamp } from 'firebase/firestore';
import { Patient, Appointment, Claim } from '@/lib/data';
import { cn } from '@/lib/utils';

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

export default function NewClaimPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { selectedPractice } = usePractice();
  const firestore = useFirestore();

  const appointmentsQuery = useMemo(() => {
    if (!firestore || !selectedPractice) return null;
    return query(collection(firestore, 'appointments'), where('practiceId', '==', selectedPractice.id));
  }, [firestore, selectedPractice]);

  const { data: appointments, isLoading: appointmentsLoading } = useCollection<Appointment>(appointmentsQuery);

  const patientsQuery = useMemo(() => {
      if (!firestore || !selectedPractice) return null;
      return query(collection(firestore, 'patients'), where('practiceId', '==', selectedPractice.id));
  }, [firestore, selectedPractice]);
  const { data: patients, isLoading: patientsLoading } = useCollection<Patient>(patientsQuery);

  const claimsQuery = useMemo(() => {
      if (!firestore || !selectedPractice) return null;
      return query(collection(firestore, 'claims'), where('practiceId', '==', selectedPractice.id));
  }, [firestore, selectedPractice]);
  const { data: claims, isLoading: claimsLoading } = useCollection<Claim>(claimsQuery);


  const completedVisits = useMemo(() => {
    if (!appointments || !patients) return [];
    return appointments.filter(a => a.status === 'Checked Out').map(a => {
      const patient = patients.find(p => p.id === a.patientId);
      return { ...a, patientName: patient?.name || 'Unknown' };
    });
  }, [appointments, patients]);

  const providers = useMemo(() => {
    if (!claims) return [];
    const uniqueProviders = [...new Set(claims.map(c => c.provider))];
    const allProviders = new Set([...uniqueProviders, 'Dr. Evelyn Reed', 'Dr. Ben Carter', 'Dr. Samira Khan', 'Dr. Egon Spengler', 'Dr. Ray Stantz']);
    return Array.from(allProviders);
  }, [claims]);


  // Controlled form state
  const [patientName, setPatientName] = useState('');
  const [patientDob, setPatientDob] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [patientCity, setPatientCity] = useState('');
  const [patientState, setPatientState] = useState('');
  const [patientZip, setPatientZip] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
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

    const visit = completedVisits.find(a => a.id === selectedVisitId);
    if (!visit || !patients) return;
    const patient = patients.find(p => p.id === visit.patientId);
    if (!patient) return;

    setPatientName(patient.name);
    setPatientDob(patient.dob);
    setPatientId(patient.id);
    setPatientAddress(patient.address);
    setPatientCity(patient.city);
    setPatientState(patient.state);
    setPatientZip(patient.zip);
    setPatientPhone(patient.phone);
    
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

  }, [selectedVisitId, completedVisits, patients]);

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

  const handleDxCodeChange = (index: number, value: string) => {
    const newDxCodes = [...dxCodes];
    newDxCodes[index] = value.toUpperCase();
    setDxCodes(newDxCodes);
  };

  const totalCharges = serviceLines.reduce(
    (acc, line) => acc + (parseFloat(line.charges) || 0),
    0
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore || !selectedPractice) return;
    setIsSubmitting(true);

    const newClaimData: Omit<Claim, 'id' | 'date' | 'lastActivity' | 'dateOfService'> = {
        patient: patientName,
        patientId,
        provider,
        payer,
        amount: totalCharges,
        status: "Submitted",
        denialReason: '',
        riskScore: Math.floor(Math.random() * 30), // simple random score for new claims
        procedure: serviceLines.map(sl => sl.procedureCode).join(', '),
        diagnosis: dxCodes.filter(Boolean).join(', '),
        history: [{ status: 'Submitted', date: new Date().toLocaleDateString(), user: 'Admin' }],
        submissionType: 'EMC',
        formType: 'CMS 1500',
        priority: 'Primary',
        claimCount: serviceLines.length,
        practiceId: selectedPractice.id,
    };
    
    const newClaim = {
        ...newClaimData,
        date: Timestamp.now(),
        lastActivity: Timestamp.now(),
        dateOfService: Timestamp.fromDate(new Date(serviceLines[0]?.dateOfService || Date.now())),
    }

    try {
        await addDoc(collection(firestore, 'claims'), newClaim);
        toast({
            title: "Claim Submitted Successfully",
            description: `Claim for ${patientName} has been created.`,
        });
        router.push('/claims');
    } catch(e: any) {
         toast({
            title: "Error submitting claim",
            description: e.message,
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (appointmentsLoading || patientsLoading || claimsLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <PageHeader 
        title="New Professional Claim (CMS-1500)" 
        description="Standard professional medical claim form used for billing." 
        action={
            <div className="flex gap-2">
                <Button variant="outline"><Printer className="h-4 w-4 mr-2" /> Print Preview</Button>
                <Button variant="outline"><FileText className="h-4 w-4 mr-2" /> Validate</Button>
            </div>
        }
      />

      <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-4 flex items-center gap-4">
            <LinkIcon className="h-5 w-5 text-accent"/>
            <div className="flex-1">
                <Label htmlFor="visit-select" className="text-xs font-bold uppercase text-accent-foreground/70">Link Completed Patient Visit</Label>
                <Select value={selectedVisitId} onValueChange={setSelectedVisitId}>
                    <SelectTrigger id="visit-select" className="mt-1 h-9 bg-background">
                        <SelectValue placeholder="Select a visit to auto-populate the CMS-1500 form..." />
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* CMS-1500 Form Emulator */}
        <div className="border-2 border-destructive/20 bg-background rounded-sm shadow-xl max-w-5xl mx-auto overflow-hidden text-[10px]">
            {/* Form Header */}
            <div className="bg-destructive/10 border-b-2 border-destructive/20 p-2 flex justify-between items-center">
                <div className="font-bold text-destructive/80 uppercase">Health Insurance Claim Form</div>
                <div className="flex items-center gap-4 text-[9px] font-medium uppercase text-muted-foreground">
                    <span>Approved OMB-0938-1197</span>
                    <span className="font-bold border border-destructive/20 px-2">Form CMS-1500 (02-12)</span>
                </div>
            </div>

            {/* Carrier Block (Box 1) */}
            <div className="grid grid-cols-12 border-b border-destructive/20 divide-x divide-destructive/20">
                <div className="col-span-12 p-2 bg-destructive/5">
                    <Label className="text-[9px] font-bold text-destructive uppercase">1. Medicare / Medicaid / TRICARE / CHAMPVA / GROUP / FECA / OTHER</Label>
                    <div className="flex gap-6 mt-1">
                        {['Medicare', 'Medicaid', 'TRICARE', 'CHAMPVA', 'Group', 'FECA', 'Other'].map(type => (
                            <div key={type} className="flex items-center gap-1.5">
                                <div className={cn("w-3 h-3 border border-destructive/40 flex items-center justify-center", (type.toLowerCase() === payer || (type === 'Group' && payer === 'bcbs')) && "bg-destructive/20")}>
                                    {(type.toLowerCase() === payer || (type === 'Group' && payer === 'bcbs')) && <Check className="h-2.5 w-2.5 text-destructive" />}
                                </div>
                                <span className="font-semibold">{type}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Patient & Insured Section (Boxes 2-13) */}
            <div className="grid grid-cols-12 border-b border-destructive/20 divide-x divide-destructive/20">
                {/* Left Column (Patient) */}
                <div className="col-span-6 divide-y divide-destructive/20">
                    <div className="p-2 min-h-[45px]">
                        <Label className="text-[8px] font-bold text-destructive uppercase">2. Patient's Name (Last Name, First Name, Middle Initial)</Label>
                        <Input value={patientName} onChange={e => setPatientName(e.target.value)} className="h-6 border-none focus-visible:ring-0 px-0 font-bold uppercase text-[11px]" />
                    </div>
                    <div className="p-2 min-h-[45px] grid grid-cols-2 divide-x divide-destructive/20 -mx-2">
                        <div className="px-2">
                            <Label className="text-[8px] font-bold text-destructive uppercase">3. Patient's Birth Date</Label>
                            <Input type="date" value={patientDob} onChange={e => setPatientDob(e.target.value)} className="h-6 border-none focus-visible:ring-0 px-0 font-bold uppercase text-[11px]" />
                        </div>
                        <div className="px-2">
                            <Label className="text-[8px] font-bold text-destructive uppercase">Sex</Label>
                            <div className="flex gap-4 mt-1">
                                <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 border border-destructive/40" /> M</span>
                                <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 border border-destructive/40" /> F</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-2 min-h-[45px]">
                        <Label className="text-[8px] font-bold text-destructive uppercase">5. Patient's Address (No., Street)</Label>
                        <Input value={patientAddress} onChange={e => setPatientAddress(e.target.value)} className="h-6 border-none focus-visible:ring-0 px-0 font-bold uppercase text-[11px]" />
                    </div>
                    <div className="grid grid-cols-3 divide-x divide-destructive/20">
                        <div className="p-2 min-h-[45px]">
                            <Label className="text-[8px] font-bold text-destructive uppercase">City</Label>
                            <Input value={patientCity} onChange={e => setPatientCity(e.target.value)} className="h-6 border-none focus-visible:ring-0 px-0 font-bold uppercase text-[11px]" />
                        </div>
                        <div className="p-2 min-h-[45px]">
                            <Label className="text-[8px] font-bold text-destructive uppercase">State</Label>
                            <Input value={patientState} onChange={e => setPatientState(e.target.value)} className="h-6 border-none focus-visible:ring-0 px-0 font-bold uppercase text-[11px]" />
                        </div>
                        <div className="p-2 min-h-[45px]">
                            <Label className="text-[8px] font-bold text-destructive uppercase">Zip Code</Label>
                            <Input value={patientZip} onChange={e => setPatientZip(e.target.value)} className="h-6 border-none focus-visible:ring-0 px-0 font-bold uppercase text-[11px]" />
                        </div>
                    </div>
                    <div className="p-2 min-h-[45px]">
                        <Label className="text-[8px] font-bold text-destructive uppercase">Patient's Relationship to Insured</Label>
                        <div className="flex gap-6 mt-1 font-bold">
                            {['Self', 'Spouse', 'Child', 'Other'].map(rel => (
                                <span key={rel} className="flex items-center gap-1">
                                    <div className={cn("w-2.5 h-2.5 border border-destructive/40", (rel === 'Self' && isSubscriberSame) && "bg-destructive/20")} /> {rel}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (Insured) */}
                <div className="col-span-6 divide-y divide-destructive/20">
                    <div className="p-2 min-h-[45px] bg-destructive/5">
                        <Label className="text-[8px] font-bold text-destructive uppercase">1a. Insured's I.D. Number</Label>
                        <Input value={policyId} onChange={e => setPolicyId(e.target.value)} className="h-6 border-none focus-visible:ring-0 px-0 font-bold uppercase text-[11px] bg-transparent" />
                    </div>
                    <div className="p-2 min-h-[45px]">
                        <Label className="text-[8px] font-bold text-destructive uppercase">4. Insured's Name (Last Name, First Name, Middle Initial)</Label>
                        <Input value={subscriberName} onChange={e => setSubscriberName(e.target.value)} className="h-6 border-none focus-visible:ring-0 px-0 font-bold uppercase text-[11px]" />
                    </div>
                    <div className="p-2 min-h-[45px]">
                        <Label className="text-[8px] font-bold text-destructive uppercase">7. Insured's Address (No., Street)</Label>
                        <Input className="h-6 border-none focus-visible:ring-0 px-0 font-bold uppercase text-[11px]" placeholder="(Same as Patient)" />
                    </div>
                    <div className="p-2 min-h-[45px]">
                        <Label className="text-[8px] font-bold text-destructive uppercase">11. Insured's Policy Group or FECA Number</Label>
                        <Input value={groupId} onChange={e => setGroupId(e.target.value)} className="h-6 border-none focus-visible:ring-0 px-0 font-bold uppercase text-[11px]" />
                    </div>
                    <div className="p-2 min-h-[45px]">
                        <Label className="text-[8px] font-bold text-destructive uppercase">Insurance Plan Name or Program Name</Label>
                        <Input value={payer.toUpperCase()} readOnly className="h-6 border-none focus-visible:ring-0 px-0 font-black text-primary text-[11px] uppercase" />
                    </div>
                </div>
            </div>

            {/* Clinical Section (Boxes 14-23) */}
            <div className="grid grid-cols-12 border-b border-destructive/20 divide-x divide-destructive/20 bg-muted/10">
                <div className="col-span-8 p-2 divide-y divide-destructive/20">
                    <div className="pb-2">
                        <Label className="text-[8px] font-bold text-destructive uppercase">21. Diagnosis or Nature of Illness or Injury (Relate Lines 1, 2, 3 or 4 to Item 24E by Line)</Label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                            {dxCodes.map((code, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                    <span className="font-bold text-destructive/60">{String.fromCharCode(65 + idx)}.</span>
                                    <Input 
                                        value={code} 
                                        onChange={e => handleDxCodeChange(idx, e.target.value)} 
                                        className="h-6 border-destructive/20 focus-visible:ring-0 font-bold uppercase text-[10px]"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-span-4 p-2 divide-y divide-destructive/20">
                    <div className="pb-2">
                        <Label className="text-[8px] font-bold text-destructive uppercase">17. Name of Referring Provider or Other Source</Label>
                        <Input value={referringProvider} onChange={e => setReferringProvider(e.target.value)} className="h-6 border-none focus-visible:ring-0 px-0 font-bold uppercase text-[11px]" />
                    </div>
                    <div className="pt-2">
                        <Label className="text-[8px] font-bold text-destructive uppercase">23. Prior Authorization Number</Label>
                        <Input value={priorAuth} onChange={e => setPriorAuth(e.target.value)} className="h-6 border-none focus-visible:ring-0 px-0 font-bold uppercase text-[11px]" />
                    </div>
                </div>
            </div>

            {/* Service Lines Grid (Box 24) */}
            <div className="border-b border-destructive/20">
                <div className="grid grid-cols-12 bg-destructive/10 text-[8px] font-bold uppercase text-destructive border-b border-destructive/20 divide-x divide-destructive/20 text-center">
                    <div className="col-span-2 py-1">24. A. Date(s) of Service</div>
                    <div className="col-span-1 py-1">B. POS</div>
                    <div className="col-span-3 py-1">D. Procedures, Services, or Supplies</div>
                    <div className="col-span-2 py-1">E. Diagnosis Pointer</div>
                    <div className="col-span-1 py-1">F. $ Charges</div>
                    <div className="col-span-1 py-1">G. Units</div>
                    <div className="col-span-2 py-1">H. EPSDT/Family Plan</div>
                </div>
                
                {serviceLines.map((line, idx) => (
                    <div key={line.id} className="grid grid-cols-12 divide-x divide-destructive/20 border-b border-destructive/10 hover:bg-muted/5 group">
                        <div className="col-span-2 p-1">
                            <Input type="date" value={line.dateOfService} onChange={e => handleServiceLineChange(line.id, 'dateOfService', e.target.value)} className="h-6 border-none focus-visible:ring-0 p-0 text-[10px] font-bold" />
                        </div>
                        <div className="col-span-1 p-1">
                            <Input value={line.placeOfService} onChange={e => handleServiceLineChange(line.id, 'placeOfService', e.target.value)} className="h-6 border-none focus-visible:ring-0 text-center p-0 text-[10px] font-bold" />
                        </div>
                        <div className="col-span-3 p-1 flex gap-1">
                            <Input value={line.procedureCode} onChange={e => handleServiceLineChange(line.id, 'procedureCode', e.target.value)} placeholder="CPT/HCPCS" className="h-6 border-none focus-visible:ring-0 p-0 text-[10px] font-bold flex-1" />
                            {line.modifiers.map((mod, midx) => (
                                <Input key={midx} value={mod} onChange={e => handleArrayFieldChange(line.id, 'modifiers', midx, e.target.value)} className="h-6 w-6 border-none focus-visible:ring-0 p-0 text-[10px] text-center" />
                            ))}
                        </div>
                        <div className="col-span-2 p-1 flex gap-1 justify-center">
                            {line.diagPointers.map((ptr, pidx) => (
                                <Input key={pidx} value={ptr} onChange={e => handleArrayFieldChange(line.id, 'diagPointers', pidx, e.target.value)} className="h-6 w-6 border-none focus-visible:ring-0 p-0 text-[10px] text-center font-bold" />
                            ))}
                        </div>
                        <div className="col-span-1 p-1">
                            <Input type="number" value={line.charges} onChange={e => handleServiceLineChange(line.id, 'charges', e.target.value)} className="h-6 border-none focus-visible:ring-0 p-0 text-[10px] font-bold text-right pr-1" />
                        </div>
                        <div className="col-span-1 p-1">
                            <Input type="number" value={line.units} onChange={e => handleServiceLineChange(line.id, 'units', e.target.value)} className="h-6 border-none focus-visible:ring-0 p-0 text-[10px] font-bold text-center" />
                        </div>
                        <div className="col-span-2 p-1 flex items-center justify-between">
                            <span className="text-[8px] font-bold text-muted-foreground ml-2">N/A</span>
                            <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 text-destructive" onClick={() => handleRemoveServiceLine(line.id)}>
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                ))}
                
                <div className="p-2 bg-destructive/5 flex justify-between items-center">
                    <Button type="button" variant="outline" size="sm" onClick={handleAddServiceLine} className="h-7 text-[9px] font-bold border-destructive/20 text-destructive uppercase">
                        <PlusCircle className="mr-1.5 h-3 w-3" /> Add Service Line
                    </Button>
                    <div className="flex gap-8 text-[11px] font-bold">
                        <div className="flex items-center gap-2">
                            <span className="text-destructive">28. TOTAL CHARGE:</span>
                            <span className="font-black">${totalCharges.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Provider Section (Boxes 25-33) */}
            <div className="grid grid-cols-12 divide-x divide-destructive/20">
                <div className="col-span-4 p-2 space-y-2">
                    <div className="bg-destructive/5 p-1">
                        <Label className="text-[8px] font-bold text-destructive uppercase">31. Signature of Physician or Supplier</Label>
                        <p className="font-bold text-[11px] italic mt-1">{provider || 'Select Provider'}</p>
                    </div>
                </div>
                <div className="col-span-4 p-2">
                    <Label className="text-[8px] font-bold text-destructive uppercase">32. Service Facility Location Information</Label>
                    <div className="mt-1 space-y-0.5 font-bold uppercase text-[9px]">
                        <p>{selectedPractice?.name}</p>
                        <p>123 Medical Plaza, Suite 400</p>
                        <p>Anytown, ST 12345</p>
                    </div>
                </div>
                <div className="col-span-4 p-2 bg-destructive/5">
                    <Label className="text-[8px] font-bold text-destructive uppercase">33. Billing Provider Info & Ph #</Label>
                    <div className="mt-1 space-y-0.5 font-bold uppercase text-[9px]">
                        <p>{selectedPractice?.name} Revenue Dept.</p>
                        <p>PO Box 9900</p>
                        <p>Anytown, ST 12345</p>
                        <p className="text-primary mt-1">NPI: 1234567890</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-2 pt-6 sticky bottom-4 z-50">
          <Button variant="outline" type="button" size="lg" className="bg-background shadow-lg" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting} size="lg" className="shadow-lg px-10">
             {isSubmitting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
             Submit Claim to Clearinghouse
          </Button>
        </div>
      </form>
    </div>
  )
}
