
'use client'

import React, { useState } from 'react';
import { Row, ColumnDef } from '@tanstack/react-table';
import { PageHeader } from "@/components/page-header";
import { payments, Payment, PaymentAdjustment } from "@/lib/payments-data";
import { claims, Claim } from "@/lib/data";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DollarSign, Clock, TrendingUp, FileCheck, FileText, Banknote, Upload, FileUp, PlusCircle, Trash2, Loader, AlertCircle, CheckCircle } from "lucide-react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sub-component for rendering payment details in an expanded row
function renderPaymentSubComponent({ row }: { row: Row<Payment> }) {
    const payment = row.original;
    const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
    const allowedAmount = payment.amountPaid + payment.patientResponsibility;

    return (
        <div className="p-4 bg-muted/50 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4"/> Claim & Payment Details</h4>
                    <p><span className="text-muted-foreground w-28 inline-block">Claim ID:</span> <Link href={`/claims/${payment.claimId}`} className="font-medium text-primary hover:underline">{payment.claimId}</Link></p>
                    <p><span className="text-muted-foreground w-28 inline-block">Payment Method:</span> {payment.paymentMethod}</p>
                    {payment.checkNumber && <p><span className="text-muted-foreground w-28 inline-block">Check Number:</span> {payment.checkNumber}</p>}
                </div>
                <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2"><Banknote className="h-4 w-4"/> Financial Summary</h4>
                    <div className="flex justify-between"><span className="text-muted-foreground">Billed Amount:</span> <span>{formatCurrency(payment.billedAmount)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Allowed Amount:</span> <span>{formatCurrency(allowedAmount)}</span></div>
                    <div className="flex justify-between font-medium"><span className="text-muted-foreground">Amount Paid:</span> <span>{formatCurrency(payment.amountPaid)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Patient Responsibility:</span> <span>{formatCurrency(payment.patientResponsibility)}</span></div>
                </div>
                <div className="space-y-3">
                    <h4 className="font-semibold">Adjustments</h4>
                    {payment.adjustments.map((adj, i) => (
                        <div key={i} className="flex justify-between">
                            <div>
                                <span className="font-mono text-xs bg-background border rounded-sm px-1 py-0.5">{adj.reasonCode}</span>
                                <span className="ml-2">{adj.description}</span>
                            </div>
                            <span>{formatCurrency(adj.amount)}</span>
                        </div>
                    ))}
                     {!payment.adjustments.length && <p className='text-muted-foreground'>No adjustments for this payment.</p>}
                </div>
            </div>
        </div>
    )
}

// Component for the Payment History tab
const PaymentList = () => {
    const data = payments;
    const stats = {
        totalReceived: data.reduce((acc, p) => acc + p.amountPaid, 0),
        totalTransactions: data.length,
        avgPayment: data.reduce((acc, p) => acc + p.amountPaid, 0) / data.length,
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Received (All Time)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.totalReceived)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Payment Transactions</CardTitle>
                        <FileCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalTransactions}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Payment Amount</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.avgPayment)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Days to Payment</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">21 Days</div>
                        <p className="text-xs text-muted-foreground">-2 days from last month</p>
                    </CardContent>
                </Card>
            </div>
            <DataTable columns={columns} data={data} filterColumn="payerName" filterPlaceholder="Filter by payer..." renderSubComponent={renderPaymentSubComponent} />
        </div>
    );
};

// Component for the ERA Posting tab
const EraPosting = () => {
    const [isPosting, setIsPosting] = useState(false);
    const [fileName, setFileName] = useState('');
    const [postResult, setPostResult] = useState<{success: boolean, message: string, details?: any} | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileName(file ? file.name : '');
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!fileName) {
            toast({ title: "No file selected", description: "Please select an ERA file to post.", variant: "destructive" });
            return;
        }
        setIsPosting(true);
        setPostResult(null);

        setTimeout(() => {
            setIsPosting(false);
            const postSuccess = Math.random() > 0.2;
            if (postSuccess) {
                setPostResult({
                    success: true,
                    message: `Successfully posted ERA file: ${fileName}`,
                    details: { totalPayments: 5, totalPosted: 12345.67, claimsAffected: ['C20240715001', 'C20240709005', 'C20240701008', 'C20240708006', 'C20240714002'] }
                });
                toast({ title: "ERA Posted Successfully", description: `Processed ${fileName} and applied payments.` });
            } else {
                setPostResult({
                    success: false,
                    message: `Failed to post ERA file: ${fileName}.`,
                    details: { error: "File format not recognized or contains errors.", line: 42 }
                });
                toast({ title: "ERA Posting Failed", description: "There was an error processing the ERA file.", variant: 'destructive' });
            }
        }, 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Upload ERA File</CardTitle>
                        <CardDescription>Select the ERA file (ANSI 835) you want to post. The system will automatically parse and apply payments.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="era-file">ERA File (ANSI 835)</Label>
                            <Input id="era-file" type="file" accept=".x12,.835,.txt" onChange={handleFileChange} />
                        </div>
                        {fileName && <p className="text-sm text-muted-foreground">Selected file: {fileName}</p>}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isPosting || !fileName}>
                            {isPosting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4"/>}
                            Post ERA
                        </Button>
                    </CardFooter>
                </form>
            </Card>
            {postResult && (
                <Card>
                    <CardHeader>
                        <CardTitle>Posting Results</CardTitle>
                        <CardDescription>Summary of the ERA posting process.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {postResult.success ? (
                            <Alert variant="default" className="bg-success/10 border-success/50">
                                <CheckCircle className="h-4 w-4 text-success" />
                                <AlertTitle className="text-success">Posting Successful</AlertTitle>
                                <AlertDescription className="text-success/90">
                                    <p className="font-semibold">{postResult.message}</p>
                                    <div className="mt-2 space-y-1 text-sm">
                                        <p><strong>Total Payments:</strong> {postResult.details.totalPayments}</p>
                                        <p><strong>Total Amount Posted:</strong> {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(postResult.details.totalPosted)}</p>
                                        <p><strong>Claims Affected:</strong> {postResult.details.claimsAffected.length}</p>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Posting Failed</AlertTitle>
                                <AlertDescription>
                                    <p className="font-semibold">{postResult.message}</p>
                                    <div className="mt-2 space-y-1 text-sm">
                                        <p><strong>Error:</strong> {postResult.details.error}</p>
                                        <p><strong>Approximate Location:</strong> Line {postResult.details.line}</p>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

type AdjustmentLine = Omit<PaymentAdjustment, 'amount'> & {id: number, amount: string};

const ManualPaymentForm = ({ claim, onFinished }: { claim: Claim, onFinished: () => void }) => {
    const [isPosting, setIsPosting] = useState(false);
    const [adjustments, setAdjustments] = useState<AdjustmentLine[]>([
        { id: 1, reasonCode: 'CO-45', description: 'Contractual Obligation', amount: '0.00' },
    ]);
    const [billedAmount, setBilledAmount] = useState(claim.amount.toString());
    const [paymentAmount, setPaymentAmount] = useState('');

    const handleAddAdjustment = () => setAdjustments([...adjustments, { id: Date.now(), reasonCode: '', description: '', amount: '' }]);
    const handleRemoveAdjustment = (id: number) => setAdjustments(adjustments.filter((line) => line.id !== id));
    const handleAdjustmentChange = (id: number, field: keyof Omit<AdjustmentLine, 'id'>, value: string) => {
        setAdjustments(adjustments.map((line) => line.id === id ? { ...line, [field]: value } : line));
    };

    const totalAdjustments = adjustments.reduce((acc, line) => acc + (parseFloat(line.amount) || 0), 0);
    const patientResponsibility = (parseFloat(billedAmount) || 0) - (parseFloat(paymentAmount) || 0) - totalAdjustments;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsPosting(true);
        setTimeout(() => {
            setIsPosting(false);
            toast({ title: "Payment Posted Successfully", description: `A payment of $${paymentAmount} has been manually posted for claim ${claim.id}.` });
            onFinished();
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Payment Details</CardTitle><CardDescription>Enter the primary details from the remittance advice.</CardDescription></CardHeader>
                        <CardContent className="space-y-6">
                             <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2"><Label htmlFor="paymentDate">Payment Date</Label><Input id="paymentDate" type="date" defaultValue={new Date().toISOString().substring(0, 10)} required /></div>
                                <div className="space-y-2"><Label htmlFor="paymentMethod">Payment Method</Label><Select required defaultValue="check"><SelectTrigger id="paymentMethod"><SelectValue placeholder="Select method" /></SelectTrigger><SelectContent><SelectItem value="check">Check</SelectItem><SelectItem value="era">ERA/EFT</SelectItem><SelectItem value="creditcard">Credit Card</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
                                <div className="space-y-2"><Label htmlFor="checkNumber">Check / Reference #</Label><Input id="checkNumber" placeholder="CHK12345" /></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Adjustment Details</CardTitle><CardDescription>Enter each adjustment from the EOB. The patient responsibility will be calculated automatically.</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            {adjustments.map((line, index) => (
                                <div key={line.id} className="grid grid-cols-12 gap-x-4 gap-y-2 items-end p-3 rounded-md border bg-muted/20">
                                    <div className="col-span-12"><p className="font-medium text-sm">Adjustment #{index+1}</p></div>
                                    <div className="col-span-6 md:col-span-3 space-y-1"><Label htmlFor={`reasonCode-${line.id}`} className="text-xs">Reason Code</Label><Input id={`reasonCode-${line.id}`} required placeholder="e.g. CO-45" value={line.reasonCode} onChange={e => handleAdjustmentChange(line.id, 'reasonCode', e.target.value)} /></div>
                                    <div className="col-span-12 md:col-span-5 space-y-1"><Label htmlFor={`description-${line.id}`} className="text-xs">Description</Label><Input id={`description-${line.id}`} required placeholder="e.g. Contractual Obligation" value={line.description} onChange={e => handleAdjustmentChange(line.id, 'description', e.target.value)} /></div>
                                    <div className="col-span-6 md:col-span-3 space-y-1"><Label htmlFor={`amount-${line.id}`} className="text-xs">Adjustment Amount ($)</Label><Input id={`amount-${line.id}`} type="number" step="0.01" required placeholder="150.00" value={line.amount} onChange={e => handleAdjustmentChange(line.id, 'amount', e.target.value)} /></div>
                                    <div className="col-span-12 md:col-span-1 flex items-center justify-end">{adjustments.length > 1 && (<Button variant="ghost" size="icon" onClick={() => handleRemoveAdjustment(line.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /><span className="sr-only">Remove line</span></Button>)}</div>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={handleAddAdjustment} className="mt-2"><PlusCircle className="mr-2 h-4 w-4" />Add Adjustment Line</Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5"/> Financial Summary</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="billedAmount">Total Billed Amount</Label><Input id="billedAmount" type="number" step="0.01" required value={billedAmount} onChange={(e) => setBilledAmount(e.target.value)} readOnly /></div>
                            <div className="space-y-2"><Label htmlFor="paymentAmount">Payer Payment Amount</Label><Input id="paymentAmount" type="number" step="0.01" required value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} /></div>
                        </CardContent>
                        <CardFooter className="flex-col items-start space-y-4 bg-muted/50 p-4 rounded-b-lg">
                            <div className="w-full flex justify-between items-center"><span className="text-muted-foreground">Total Adjustments</span><span className="font-medium">-{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalAdjustments)}</span></div>
                            <div className="w-full flex justify-between items-center text-lg"><span className="font-semibold">Patient Responsibility</span><span className="font-bold text-destructive">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(patientResponsibility > 0 ? patientResponsibility : 0)}</span></div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
             <DialogFooter className="pt-6">
                <Button variant="outline" type="button" onClick={onFinished}>Cancel</Button>
                <Button type="submit" disabled={isPosting}>
                    {isPosting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    Post Payment
                </Button>
            </DialogFooter>
        </form>
    );
};

// Component for the Manual EOB Posting tab
const ManualPosting = () => {
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

    const manualPostingColumns: ColumnDef<Claim>[] = [
        { 
            accessorKey: "id", 
            header: "Claim ID",
            cell: ({row}) => <Link href={`/claims/${row.original.id}`} className="font-medium text-primary hover:underline">{row.original.id}</Link>
        },
        { accessorKey: "patient", header: "Patient" },
        { accessorKey: "payer", header: "Payer" },
        {
            accessorKey: "amount",
            header: () => <div className="text-right">Billed</div>,
            cell: ({ row }) => <div className="text-right">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(row.getValue("amount"))}</div>
        },
        { accessorKey: "status", header: "Status" },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedClaim(row.original)}>
                        Post Payment
                    </Button>
                </div>
            ),
        },
    ];

    const claimsToPost = claims.filter(c => c.status === 'Submitted' || c.status === 'Pending' || c.status === 'Denied');

    return (
         <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Manual Payment Workbench</CardTitle>
                    <CardDescription>
                        This workbench lists claims awaiting manual payment posting. Select a claim to enter payment details from its EOB.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable 
                        columns={manualPostingColumns} 
                        data={claimsToPost} 
                        filterColumn="patient"
                        filterPlaceholder="Filter by patient or claim ID..."
                    />
                </CardContent>
            </Card>

            <Dialog open={!!selectedClaim} onOpenChange={(open) => !open && setSelectedClaim(null)}>
                <DialogContent className="max-w-5xl">
                    <DialogHeader>
                        <DialogTitle>Post Payment for Claim {selectedClaim?.id}</DialogTitle>
                        <DialogDescription>
                            Enter payment details from the Explanation of Benefits (EOB) for patient {selectedClaim?.patient}. Billed amount: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(selectedClaim?.amount || 0)}.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedClaim && <ManualPaymentForm claim={selectedClaim} onFinished={() => setSelectedClaim(null)} />}
                </DialogContent>
            </Dialog>
        </div>
    );
};


// Main Page Component
export default function PaymentsPage() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Payments & Remittances" 
                description="Track, manage, and post all payments from a central location." 
            />
            
            <Tabs defaultValue="history" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="history">Payment History</TabsTrigger>
                    <TabsTrigger value="era">ERA Posting</TabsTrigger>
                    <TabsTrigger value="manual">Manual EOB Posting</TabsTrigger>
                </TabsList>
                <TabsContent value="history" className="mt-4">
                    <PaymentList />
                </TabsContent>
                <TabsContent value="era" className="mt-4">
                    <EraPosting />
                </TabsContent>
                <TabsContent value="manual" className="mt-4">
                    <ManualPosting />
                </TabsContent>
            </Tabs>
        </div>
    )
}
