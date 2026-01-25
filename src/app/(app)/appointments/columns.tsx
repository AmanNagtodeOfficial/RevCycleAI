
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Appointment } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

// Extended type for the data table to include patient's name
export type AppointmentWithPatient = Appointment & { patientName: string };

const getStatusBadge = (status: Appointment["status"]) => {
  switch (status) {
    case "Checked Out":
      return <Badge className="bg-success text-success-foreground hover:bg-success/80">{status}</Badge>
    case "Cancelled":
    case "No Show":
      return <Badge variant="destructive">{status}</Badge>
    case "Checked In":
    case "In Room":
      return <Badge className="bg-accent text-accent-foreground hover:bg-accent/80">{status}</Badge>
    case "Scheduled":
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export const columns: ColumnDef<AppointmentWithPatient>[] = [
  {
    accessorKey: "patientName",
    header: "Patient",
    cell: ({ row }) => <Link href={`/patients/${row.original.patientId}`} className="font-medium text-primary hover:underline">{row.getValue("patientName")}</Link>,
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "provider",
    header: "Provider",
  },
  {
    accessorKey: "procedure",
    header: "Procedure",
  },
    {
    accessorKey: "room",
    header: "Room",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status")),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const appointment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem disabled={appointment.status !== 'Scheduled'}>Check In</DropdownMenuItem>
            <DropdownMenuItem disabled={appointment.status !== 'Checked In'}>Mark as In Room</DropdownMenuItem>
            <DropdownMenuItem disabled={appointment.status !== 'In Room'}>Check Out</DropdownMenuItem>
            <DropdownMenuItem>Cancel Appointment</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
