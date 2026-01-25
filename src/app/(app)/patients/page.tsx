
'use client';

import { patients } from "@/lib/data"
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
import { Users, UserPlus, UserCheck, UserX } from "lucide-react"

export default function PatientsPage() {
  const data = patients;

  const stats = {
      total: data.length,
      active: data.filter(p => p.status === 'Active').length,
      inactive: data.filter(p => p.status === 'Inactive').length,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description="Manage patient demographics and insurance information."
        action={
            <Link href="/patients/new" passHref>
                <Button><UserPlus className="mr-2 h-4 w-4" /> Add Patient</Button>
            </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <UserCheck className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                <UserX className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.inactive}</div>
            </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={data} filterColumn="name" filterPlaceholder="Filter patients by name..."/>
    </div>
  )
}
