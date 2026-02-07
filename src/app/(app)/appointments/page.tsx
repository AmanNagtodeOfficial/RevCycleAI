
'use client';

import React, { useMemo } from "react";
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { CalendarPlus, Loader } from "lucide-react"
import Link from "next/link";
import { usePractice } from "@/context/practice-context";
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Appointment } from '@/lib/data';

export default function AppointmentsPage() {
  const { selectedPractice } = usePractice();
  const firestore = useFirestore();

  const appointmentsQuery = useMemo(() => {
    if (!firestore || !selectedPractice) return null;
    return query(
      collection(firestore, 'appointments'),
      where('practiceId', '==', selectedPractice.id)
    );
  }, [firestore, selectedPractice]);

  const { data: appointments, isLoading } = useCollection<Appointment>(appointmentsQuery);

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
        title="Appointments"
        description="Schedule, view, and manage all patient appointments."
        action={
            <Button asChild>
                <Link href="/appointments/new">
                    <CalendarPlus className="mr-2 h-4 w-4" /> Schedule Appointment
                </Link>
            </Button>
        }
      />
      <DataTable 
        columns={columns} 
        data={appointments || []} 
        filterColumn="patientName" 
        filterPlaceholder="Filter by patient name..."
      />
    </div>
  )
}
