'use client'

import { Claim, claims } from "@/lib/data"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { PageHeader } from "@/components/page-header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DollarSign, FileText, AlertTriangle, CheckCircle, Loader, Banknote } from "lucide-react"
import { Row } from "@tanstack/react-table"
import { payments, Payment } from "@/lib/payments-data";

function renderSubComponent({ row }: { row: Row<Claim> }) {
    const claim = row.original;
    const associatedPayments = payments.filter(p => p.claimId === claim.id);
    const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

    return (
        <div className="p-4 bg-muted/50 text-sm space-y-4">
            <div className="flex justify-between items-center px-4">
                <h4 className="font-semibold">Claim Details</h4>
                <p><span className="text-muted-foreground">Claim ID:</span> <Link href={`/claims/${claim.id}`} className="font-medium text-primary hover:underline">{claim.id}</Link></p>
            </div>
            
            {associatedPayments.length > 0 ? (
                associatedPayments.map(payment => {
                    const allowedAmount = payment.amountPaid + payment.patientResponsibility;
                    return (
                        <div key={payment.id} className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-lg bg-background mx-4">
                            <div className="space-y-3">
                                <h4 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4"/> Payment from {payment.payerName}</h4>
                                <p><span className="text-muted-foreground w-28 inline-block">Payment Date:</span> {payment.paymentDate}</p>
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
                    )
                })
            ) : (
                 <div className="text-muted-foreground text-center py-4">
                    No payment details available for this claim.
                </div>
            )}
        </div>
    )
}


export default function ClaimsPage() {
  const data = claims;

  const stats = {
      total: data.length,
      paid: data.filter(c => c.status === 'Paid').length,
      pending: data.filter(c => c.status === 'Pending' || c.status === 'Submitted' || c.status === 'Scrubbing').length,
      denied: data.filter(c => c.status === 'Denied').length
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Claims"
        description="Track, manage, and resolve all your medical claims."
        action={
            <Link href="/claims/new" passHref>
                <Button>New Claim</Button>
            </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid</CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.paid}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Loader className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Denied</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.denied}</div>
            </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={data} filterColumn="patient" filterPlaceholder="Filter claims by patient..." renderSubComponent={renderSubComponent} />
    </div>
  )
}
