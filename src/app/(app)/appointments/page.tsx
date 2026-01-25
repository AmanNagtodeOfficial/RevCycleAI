
'use client';

import React from "react";
import { appointments, patients } from "@/lib/data"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { CalendarPlus } from "lucide-react"
import Link from "next/link";
import { usePractice } from "@/context/practice-context";

export default function AppointmentsPage() {
  const { selectedPractice } = usePractice();

  const data = React.useMemo(() => {
    return appointments
      .filter(appt => appt.practiceId === selectedPractice.id)
      .map(appt => ({
        ...appt,
        patientName: patients.find(p => p.id === appt.patientId)?.name || 'Unknown Patient'
      }));
  }, [selectedPractice]);

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
      <DataTable columns={columns} data={data} filterColumn="patientName" filterPlaceholder="Filter by patient name..."/>
    </div>
  )
}
