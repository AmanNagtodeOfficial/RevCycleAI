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
import { DollarSign, FileText, AlertTriangle, CheckCircle, Loader, AlertCircle as AlertCircleIcon } from "lucide-react"
import { Row } from "@tanstack/react-table"

function renderSubComponent({ row }: { row: Row<Claim> }) {
    const claim = row.original;

    const getTimelineIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
            case 'submitted':
                return <CheckCircle className="h-4 w-4 text-success" />;
            case 'denied':
                return <AlertCircleIcon className="h-4 w-4 text-destructive" />;
            case 'pending':
            case 'scrubbing':
                return <Loader className="h-4 w-4 text-accent animate-spin" />;
            default:
                return <FileText className="h-4 w-4 text-muted-foreground" />;
        }
    }

    if (!claim.history || claim.history.length === 0) {
        return (
            <div className="p-4 bg-muted/50 text-sm text-muted-foreground">
                No history available for this claim.
            </div>
        )
    }

    return (
        <div className="p-4 bg-muted/50">
            <h4 className="font-semibold mb-4 text-sm">Claim History</h4>
            <div className="relative pl-6">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-border -translate-x-1/2"></div>
                <ul className="space-y-6">
                {claim.history.map((event, index) => (
                    <li key={index} className="flex items-start gap-4">
                        <div className="absolute left-6 -translate-x-1/2 bg-background p-1 rounded-full border">
                            {getTimelineIcon(event.status)}
                        </div>
                        <div className="flex-1 text-sm">
                            <p className="font-medium">{event.status}</p>
                            <p className="text-xs text-muted-foreground">by {event.user} on {event.date}</p>
                        </div>
                    </li>
                ))}
                </ul>
            </div>
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
