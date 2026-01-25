
'use client';

import { appointments, patients } from "@/lib/data"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { CalendarPlus } from "lucide-react"

export default function AppointmentsPage() {
  const data = appointments.map(appt => ({
    ...appt,
    patientName: patients.find(p => p.id === appt.patientId)?.name || 'Unknown Patient'
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Schedule, view, and manage all patient appointments."
        action={
            <Button disabled><CalendarPlus className="mr-2 h-4 w-4" /> Schedule Appointment</Button>
        }
      />
      <DataTable columns={columns} data={data} filterColumn="patientName" filterPlaceholder="Filter by patient name..."/>
    </div>
  )
}
