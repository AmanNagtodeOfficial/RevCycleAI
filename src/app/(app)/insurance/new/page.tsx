
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
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

type CoveredCpt = {
    id: number;
    code: string;
    description: string;
    requiresAuth: boolean;
    notes: string;
};

type CoveredDx = {
    id: number;
    code: string;
    description: string;
};

export default function NewInsurancePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const firestore = useFirestore();

  const [coveredCpt, setCoveredCpt] = useState<CoveredCpt[]>([
    { id: 1, code: '', description: '', requiresAuth: false, notes: '' }
  ]);

  const [coveredDx, setCoveredDx] = useState<CoveredDx[]>([
    { id: 1, code: '', description: '' }
  ]);
  
  const handleAddCpt = () => {
    setCoveredCpt([...coveredCpt, { id: Date.now(), code: '', description: '', requiresAuth: false, notes: '' }]);
  };

  const handleRemoveCpt = (id: number) => {
    setCoveredCpt(coveredCpt.filter(c => c.id !== id));
  };
  
  const handleCptChange = (id: number, field: keyof Omit<CoveredCpt, 'id'>, value: string | boolean) => {
    setCoveredCpt(coveredCpt.map(cpt => cpt.id === id ? { ...cpt, [field]: value } : cpt));
  };

  const handleAddDx = () => {
    setCoveredDx([...coveredDx, { id: Date.now(), code: '', description: '' }]);
  };

  const handleRemoveDx = (id: number) => {
    setCoveredDx(coveredDx.filter(dx => dx.id !== id));
  };

  const handleDxChange = (id: number, field: keyof Omit<CoveredDx, 'id'>, value: string) => {
    setCoveredDx(coveredDx.map(dx => dx.id === id ? { ...dx, [field]: value } : dx));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore) return;
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const planType = formData.get('plan-type') as any;
    const status = formData.get('status') === 'active' ? 'Active' : 'Terminated';

    const newPlan = {
        payerName: formData.get('payer-name'),
        planName: formData.get('plan-name'),
        planType: planType.toUpperCase(),
        status: status,
        timelyFilingLimit: parseInt(formData.get('tfl') as string),
        claimsCorrectionLimit: parseInt(formData.get('ccfl') as string),
        memberCount: parseInt(formData.get('member-count') as string) || 0,
        totalClaims: parseInt(formData.get('total-claims') as string) || 0,
        benefits: {
            individualDeductible: { inNetwork: formData.get('ind-deduct-in'), outOfNetwork: formData.get('ind-deduct-out') },
            familyDeductible: { inNetwork: formData.get('fam-deduct-in'), outOfNetwork: formData.get('fam-deduct-out') },
            individualOOPMax: { inNetwork: formData.get('ind-oop-in'), outOfNetwork: formData.get('ind-oop-out') },
            familyOOPMax: { inNetwork: formData.get('fam-oop-in'), outOfNetwork: formData.get('fam-oop-out') }
        },
        coveredCpt: coveredCpt.filter(c => c.code).map(({ id, ...rest }) => rest),
        coveredDx: coveredDx.filter(d => d.code).map(({ id, ...rest }) => rest),
    };

    try {
        await addDoc(collection(firestore, 'insurancePlans'), newPlan);
        toast({
            title: "Insurance Plan Added",
            description: "The new insurance plan has been successfully added to the system.",
        });
        router.push('/insurance');
    } catch (error: any) {
        toast({
            title: "Error adding plan",
            description: error.message,
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Add New Insurance Plan" 
        description="Onboard a new payer plan and configure its details." 
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Plan Details</CardTitle>
            <CardDescription>Enter the information for the new insurance plan below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="payer-name">Payer Name</Label>
                <Input id="payer-name" name="payer-name" placeholder="e.g., Aetna" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input id="plan-name" name="plan-name" placeholder="e.g., Aetna Choice® POS II" required />
              </div>
            </div>
             <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="plan-type">Plan Type</Label>
                     <Select required name="plan-type">
                        <SelectTrigger id="plan-type">
                            <SelectValue placeholder="Select a plan type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ppo">PPO</SelectItem>
                            <SelectItem value="hmo">HMO</SelectItem>
                            <SelectItem value="epo">EPO</SelectItem>
                            <SelectItem value="pos">POS</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                     <Select required name="status" defaultValue="active">
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="terminated">Terminated</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tfl">Timely Filing Limit (Days)</Label>
                <Input id="tfl" name="tfl" type="number" placeholder="e.g., 90" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ccfl">Claims Correction Limit (Days)</Label>
                <Input id="ccfl" name="ccfl" type="number" placeholder="e.g., 180" required />
              </div>
            </div>
             <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="member-count">Member Count</Label>
                    <Input id="member-count" name="member-count" type="number" placeholder="e.g., 1250" required defaultValue="0" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="total-claims">Total Claims</Label>
                    <Input id="total-claims" name="total-claims" type="number" placeholder="e.g., 850" required defaultValue="0" />
                </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Benefits</CardTitle>
            <CardDescription>Enter deductible and out-of-pocket maximums.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="font-semibold">Individual Deductible</Label>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="ind-deduct-in">In-Network</Label>
                  <Input id="ind-deduct-in" name="ind-deduct-in" placeholder="$1,500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ind-deduct-out">Out-of-Network</Label>
                  <Input id="ind-deduct-out" name="ind-deduct-out" placeholder="$5,000" />
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <Label className="font-semibold">Family Deductible</Label>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="fam-deduct-in">In-Network</Label>
                  <Input id="fam-deduct-in" name="fam-deduct-in" placeholder="$3,000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fam-deduct-out">Out-of-Network</Label>
                  <Input id="fam-deduct-out" name="fam-deduct-out" placeholder="$10,000" />
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <Label className="font-semibold">Individual Out-of-Pocket Max</Label>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="ind-oop-in">In-Network</Label>
                  <Input id="ind-oop-in" name="ind-oop-in" placeholder="$6,000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ind-oop-out">Out-of-Network</Label>
                  <Input id="ind-oop-out" name="ind-oop-out" placeholder="$15,000" />
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <Label className="font-semibold">Family Out-of-Pocket Max</Label>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="fam-oop-in">In-Network</Label>
                  <Input id="fam-oop-in" name="fam-oop-in" placeholder="$12,000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fam-oop-out">Out-of-Network</Label>
                  <Input id="fam-oop-out" name="fam-oop-out" placeholder="$30,000" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Covered CPT Codes</CardTitle>
                <CardDescription>Add commonly billed CPT codes and their coverage rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {coveredCpt.map((cpt, index) => (
                    <div key={cpt.id} className="p-4 border rounded-lg space-y-4 relative bg-muted/20">
                        <Label className="font-semibold">CPT Code #{index + 1}</Label>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2 md:col-span-1">
                                <Label htmlFor={`cpt-code-${cpt.id}`}>Code</Label>
                                <Input id={`cpt-code-${cpt.id}`} placeholder="99213" value={cpt.code} onChange={(e) => handleCptChange(cpt.id, 'code', e.target.value)} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor={`cpt-desc-${cpt.id}`}>Description</Label>
                                <Input id={`cpt-desc-${cpt.id}`} placeholder="Office visit, established patient..." value={cpt.description} onChange={(e) => handleCptChange(cpt.id, 'description', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`cpt-notes-${cpt.id}`}>Notes</Label>
                            <Input id={`cpt-notes-${cpt.id}`} placeholder="Standard coverage" value={cpt.notes} onChange={(e) => handleCptChange(cpt.id, 'notes', e.target.value)} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id={`cpt-auth-${cpt.id}`} checked={cpt.requiresAuth} onCheckedChange={(checked) => handleCptChange(cpt.id, 'requiresAuth', !!checked)} />
                            <Label htmlFor={`cpt-auth-${cpt.id}`}>Requires Prior Authorization</Label>
                        </div>
                        {coveredCpt.length > 1 && (
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive hover:text-destructive" onClick={() => handleRemoveCpt(cpt.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={handleAddCpt} className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add CPT Code
                </Button>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Covered Diagnosis Codes</CardTitle>
                <CardDescription>Add commonly covered ICD-10 codes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {coveredDx.map((dx, index) => (
                    <div key={dx.id} className="p-4 border rounded-lg space-y-4 relative bg-muted/20">
                         <Label className="font-semibold">Diagnosis Code #{index + 1}</Label>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2 md:col-span-1">
                                <Label htmlFor={`dx-code-${dx.id}`}>Code</Label>
                                <Input id={`dx-code-${dx.id}`} placeholder="I10" value={dx.code} onChange={(e) => handleDxChange(dx.id, 'code', e.target.value)} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor={`dx-desc-${dx.id}`}>Description</Label>
                                <Input id={`dx-desc-${dx.id}`} placeholder="Essential (primary) hypertension" value={dx.description} onChange={(e) => handleDxChange(dx.id, 'description', e.target.value)} />
                            </div>
                        </div>
                        {coveredDx.length > 1 && (
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive hover:text-destructive" onClick={() => handleRemoveDx(dx.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={handleAddDx} className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Diagnosis Code
                </Button>
            </CardContent>
        </Card>
        
        <CardFooter className="flex justify-end gap-2 pt-6 bg-card">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Add Plan
            </Button>
        </CardFooter>
      </form>
    </div>
  )
}
