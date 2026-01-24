
'use client'

import { PageHeader } from "@/components/page-header";
import { statements } from "@/lib/data";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, FileWarning, Mail, FileCheck, FileCog, Banknote, FileStack, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { payments, Payment } from "@/lib/payments-data";
import { columns as paymentColumns } from "@/app/(app)/payments/columns";
import { Row } from '@tanstack/react-table';
import Link from "next/link";

function renderSubComponent({ row }: { row: Row<Payment> }) {
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

export default function BillingPage() {

    const data = statements;
    const paymentsData = payments;

    const stats = {
        outstanding: data.filter(s => s.status === 'Sent' || s.status === 'Overdue').reduce((acc, s) => acc + s.amountDue, 0),
        overdue: data.filter(s => s.status === 'Overdue').length,
        draft: data.filter(s => s.status === 'Draft').length,
        paidThisMonth: data.filter(s => s.status === 'Paid').length, // Simplified
    }

    const insuranceStats = {
        totalReceived: paymentsData.reduce((acc, p) => acc + p.amountPaid, 0),
        eraReceived: paymentsData.filter(p => p.paymentMethod === 'ERA').length,
        checksReceived: paymentsData.filter(p => p.paymentMethod === 'Check').length,
        needsReconciliation: 4, // dummy data
    }


    return (
        <div className="space-y-6">
            <PageHeader 
                title="Billing" 
                description="Manage both patient and insurance billing processes."
            />
            
            <Tabs defaultValue="patient" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                    <TabsTrigger value="patient">Patient Billing</TabsTrigger>
                    <TabsTrigger value="insurance">Insurance Billing</TabsTrigger>
                </TabsList>
                <TabsContent value="patient" className="mt-4 space-y-6">
                     <div className="flex items-center justify-between">
                         <h2 className="text-xl font-semibold tracking-tight">Patient Statements</h2>
                         <div className="flex gap-2">
                            <Button variant="outline">Send Reminders</Button>
                            <Button>Generate Statements</Button>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.outstanding)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Overdue Statements</CardTitle>
                                <FileWarning className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.overdue}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Statements in Draft</CardTitle>
                                <Mail className="h-4 w-4 text-accent" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.draft}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Paid (This Month)</CardTitle>
                                <FileCheck className="h-4 w-4 text-success" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.paidThisMonth}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <DataTable columns={columns} data={data} filterColumn="patientName" filterPlaceholder="Filter by patient name..." />
                </TabsContent>
                <TabsContent value="insurance" className="mt-4 space-y-6">
                     <div className="flex items-center justify-between">
                         <h2 className="text-xl font-semibold tracking-tight">Insurance Remittances (EOB/ERA)</h2>
                         <div className="flex gap-2">
                            <Button variant="outline">Upload ERA File</Button>
                            <Button>Post Manual EOB</Button>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Received</CardTitle>
                                <Banknote className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(insuranceStats.totalReceived)}</div>
                                <p className="text-xs text-muted-foreground">from insurance payers</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">ERAs Received</CardTitle>
                                <FileStack className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{insuranceStats.eraReceived}</div>
                                <p className="text-xs text-muted-foreground">Electronic Remittance Advices</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Checks Received</CardTitle>
                                <Mail className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{insuranceStats.checksReceived}</div>
                                 <p className="text-xs text-muted-foreground">Paper checks from payers</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Needs Reconciliation</CardTitle>
                                <FileCog className="h-4 w-4 text-accent" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{insuranceStats.needsReconciliation}</div>
                                <p className="text-xs text-muted-foreground">Payments to be posted</p>
                            </CardContent>
                        </Card>
                    </div>

                    <DataTable columns={paymentColumns} data={paymentsData} filterColumn="payerName" filterPlaceholder="Filter by payer..." renderSubComponent={renderSubComponent} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
