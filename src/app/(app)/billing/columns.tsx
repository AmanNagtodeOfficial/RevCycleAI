"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Statement } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

const getStatusBadge = (status: Statement["status"]) => {
  switch (status) {
    case "Paid":
      return <Badge className="bg-success text-success-foreground hover:bg-success/80">{status}</Badge>
    case "Overdue":
      return <Badge variant="destructive">{status}</Badge>
    case "Sent":
      return <Badge className="bg-accent text-accent-foreground hover:bg-accent/80">{status}</Badge>
    case "Draft":
      return <Badge variant="secondary">{status}</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export const columns: ColumnDef<Statement>[] = [
  {
    accessorKey: "id",
    header: "Statement ID",
  },
  {
    accessorKey: "patientName",
    header: "Patient",
    cell: ({ row }) => <Link href={`/patients/${row.original.patientId}`} className="font-medium text-primary hover:underline">{row.getValue("patientName")}</Link>,
  },
  {
    accessorKey: "dateIssued",
    header: "Date Issued",
  },
  {
    accessorKey: "amountDue",
    header: () => <div className="text-right">Amount Due</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amountDue"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status")),
  },
  {
    id: "actions",
    cell: ({ row }) => {
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
            <DropdownMenuItem>View Statement</DropdownMenuItem>
            <DropdownMenuItem>Send Reminder</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Void Statement</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
