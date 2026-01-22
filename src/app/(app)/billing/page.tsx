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
import { DollarSign, FileWarning, Mail, FileCheck } from "lucide-react";

export default function BillingPage() {

    const data = statements;

    const stats = {
        outstanding: data.filter(s => s.status === 'Sent' || s.status === 'Overdue').reduce((acc, s) => acc + s.amountDue, 0),
        overdue: data.filter(s => s.status === 'Overdue').length,
        draft: data.filter(s => s.status === 'Draft').length,
        paidThisMonth: data.filter(s => s.status === 'Paid').length, // Simplified
    }

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Patient Billing" 
                description="Manage patient statements, payments, and collections."
                action={
                    <div className="flex gap-2">
                        <Button variant="outline">Send Reminders</Button>
                        <Button>Generate Statements</Button>
                    </div>
                }
            />
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

        </div>
    )
}
