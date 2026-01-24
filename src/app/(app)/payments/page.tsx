
'use client'
import { Row } from '@tanstack/react-table';
import { PageHeader } from "@/components/page-header";
import { payments, Payment } from "@/lib/payments-data";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Clock, TrendingUp, FileCheck, FileText, Banknote } from "lucide-react";
import Link from 'next/link';

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

export default function PaymentsPage() {
    const data = payments;

    const stats = {
        totalReceived: data.reduce((acc, p) => acc + p.amountPaid, 0),
        totalTransactions: data.length,
        avgPayment: data.reduce((acc, p) => acc + p.amountPaid, 0) / data.length,
    }

    return (
        <div className="space-y-6">
            <PageHeader title="Payments & Remittances" description="Track and manage all payments and remittances from payers." />
            
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

            <DataTable columns={columns} data={data} filterColumn="payerName" filterPlaceholder="Filter by payer..." renderSubComponent={renderSubComponent} />
        </div>
    )
}
