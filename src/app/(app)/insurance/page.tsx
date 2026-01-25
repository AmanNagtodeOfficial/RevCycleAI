
'use client';

import { insurancePlans } from "@/lib/insurance-data"
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
import { Briefcase, Users, UserPlus, CheckCircle } from "lucide-react"

export default function InsurancePage() {
  const data = insurancePlans;

  const stats = {
      totalPlans: data.length,
      activePlans: data.filter(p => p.status === 'Active').length,
      totalMembers: data.reduce((acc, p) => acc + p.memberCount, 0),
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insurance Plans"
        description="Manage payer contracts, fee schedules, and plan details."
        action={
            <Link href="/insurance/new" passHref>
                <Button><UserPlus className="mr-2 h-4 w-4" /> Add Plan</Button>
            </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.totalPlans}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.activePlans}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members Covered</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{new Intl.NumberFormat().format(stats.totalMembers)}</div>
            </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={data} filterColumn="payerName" filterPlaceholder="Filter by payer..."/>
    </div>
  )
}
