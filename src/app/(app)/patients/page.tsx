
'use client';

import React, { useMemo } from "react";
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
import { Users, UserPlus, UserCheck, UserX, Loader } from "lucide-react"
import { usePractice } from "@/context/practice-context";
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Patient } from '@/lib/data';

export default function PatientsPage() {
  const { selectedPractice } = usePractice();
  const firestore = useFirestore();

  const patientsQuery = useMemo(() => {
    if (!firestore || !selectedPractice) return null;
    return query(
      collection(firestore, 'patients'),
      where('practiceId', '==', selectedPractice.id)
    );
  }, [firestore, selectedPractice]);

  const { data: patients, isLoading } = useCollection<Patient>(patientsQuery);

  const stats = useMemo(() => {
    const data = patients || [];
    return {
      total: data.length,
      active: data.filter(p => p.status === 'Active').length,
      inactive: data.filter(p => p.status === 'Inactive').length,
    }
  }, [patients]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
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

      <DataTable 
        columns={columns} 
        data={patients || []} 
        filterColumn="name" 
        filterPlaceholder="Filter patients by name..."
      />
    </div>
  )
}
