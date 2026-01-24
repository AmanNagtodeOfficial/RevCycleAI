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
import { Loader, PlusCircle, Trash2, DollarSign } from 'lucide-react';

type AdjustmentLine = {
  id: number;
  reasonCode: string;
  description: string;
  amount: string;
};

export default function ManualEobPostingPage() {
  const [isPosting, setIsPosting] = useState(false);
  const [adjustments, setAdjustments] = useState<AdjustmentLine[]>([
    { id: 1, reasonCode: 'CO-45', description: 'Contractual Obligation', amount: '250.00' },
  ]);
  const [billedAmount, setBilledAmount] = useState('1500.00');
  const [paymentAmount, setPaymentAmount] = useState('1250.00');

  const router = useRouter();

  const handleAddAdjustment = () => {
    setAdjustments([
      ...adjustments,
      { id: Date.now(), reasonCode: '', description: '', amount: '' },
    ]);
  };

  const handleRemoveAdjustment = (id: number) => {
    setAdjustments(adjustments.filter((line) => line.id !== id));
  };

  const handleAdjustmentChange = (
    id: number,
    field: keyof Omit<AdjustmentLine, 'id'>,
    value: string
  ) => {
    setAdjustments(
      adjustments.map((line) =>
        line.id === id ? { ...line, [field]: value } : line
      )
    );
  };
  
  const totalAdjustments = adjustments.reduce(
    (acc, line) => acc + (parseFloat(line.amount) || 0),
    0
  );
  
  const patientResponsibility = (parseFloat(billedAmount) || 0) - (parseFloat(paymentAmount) || 0) - totalAdjustments;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPosting(true);

    // Simulate API call
    setTimeout(() => {
        setIsPosting(false);
        toast({
            title: "Payment Posted Successfully",
            description: `A payment of $${paymentAmount} has been manually posted.`,
        });
        router.push('/payments');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manual Payment Posting (EOB)" 
        description="Manually post a payment from a paper EOB or other remittance advice." 
      />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Enter the primary details from the remittance advice.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="claimId">Claim ID</Label>
                      <Input id="claimId" defaultValue="C20240715001" required />
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
                 <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="paymentDate">Payment Date</Label>
                        <Input id="paymentDate" type="date" defaultValue={new Date().toISOString().substring(0, 10)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select required defaultValue="check">
                          <SelectTrigger id="paymentMethod">
                              <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="check">Check</SelectItem>
                              <SelectItem value="era">ERA/EFT</SelectItem>
                              <SelectItem value="creditcard">Credit Card</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="checkNumber">Check / Reference #</Label>
                        <Input id="checkNumber" placeholder="CHK12345" />
                    </div>
                 </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adjustment Details</CardTitle>
                <CardDescription>
                  Enter each adjustment from the EOB. The patient responsibility will be calculated automatically.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {adjustments.map((line, index) => (
                  <div key={line.id} className="grid grid-cols-12 gap-x-4 gap-y-2 items-end p-3 rounded-md border bg-muted/20">
                     <div className="col-span-12"><p className="font-medium text-sm">Adjustment #{index+1}</p></div>
                    <div className="col-span-6 md:col-span-3 space-y-1">
                      <Label htmlFor={`reasonCode-${line.id}`} className="text-xs">Reason Code</Label>
                      <Input id={`reasonCode-${line.id}`} required placeholder="e.g. CO-45" value={line.reasonCode} onChange={e => handleAdjustmentChange(line.id, 'reasonCode', e.target.value)} />
                    </div>
                    <div className="col-span-12 md:col-span-5 space-y-1">
                      <Label htmlFor={`description-${line.id}`} className="text-xs">Description</Label>
                      <Input id={`description-${line.id}`} required placeholder="e.g. Contractual Obligation" value={line.description} onChange={e => handleAdjustmentChange(line.id, 'description', e.target.value)} />
                    </div>
                    <div className="col-span-6 md:col-span-3 space-y-1">
                      <Label htmlFor={`amount-${line.id}`} className="text-xs">Adjustment Amount ($)</Label>
                      <Input id={`amount-${line.id}`} type="number" step="0.01" required placeholder="150.00" value={line.amount} onChange={e => handleAdjustmentChange(line.id, 'amount', e.target.value)} />
                    </div>
                    <div className="col-span-12 md:col-span-1 flex items-center justify-end">
                        {adjustments.length > 1 && (
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveAdjustment(line.id)} className="text-destructive hover:text-destructive">
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
                  onClick={handleAddAdjustment}
                  className="mt-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Adjustment Line
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5"/> Financial Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="billedAmount">Total Billed Amount</Label>
                        <Input id="billedAmount" type="number" step="0.01" required value={billedAmount} onChange={(e) => setBilledAmount(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="paymentAmount">Payer Payment Amount</Label>
                        <Input id="paymentAmount" type="number" step="0.01" required value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-start space-y-4 bg-muted/50 p-4 rounded-b-lg">
                    <div className="w-full flex justify-between items-center">
                        <span className="text-muted-foreground">Total Adjustments</span>
                        <span className="font-medium">-{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalAdjustments)}</span>
                    </div>
                     <div className="w-full flex justify-between items-center text-lg">
                        <span className="font-semibold">Patient Responsibility</span>
                        <span className="font-bold text-destructive">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(patientResponsibility > 0 ? patientResponsibility : 0)}</span>
                    </div>
                </CardFooter>
             </Card>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-6">
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isPosting}>
             {isPosting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
             Post Payment
          </Button>
        </div>
      </form>
    </div>
  )
}
