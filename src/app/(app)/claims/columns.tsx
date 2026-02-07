"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Claim, patients } from "@/lib/data"
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
import { MoreHorizontal, ChevronDown, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Timestamp } from "firebase/firestore"

const getStatusBadge = (status: Claim["status"]) => {
  switch (status) {
    case "Paid":
      return <Badge className="bg-success text-success-foreground hover:bg-success/80">{status}</Badge>
    case "Denied":
      return <Badge variant="destructive">{status}</Badge>
    case "Pending":
      return <Badge className="bg-accent text-accent-foreground hover:bg-accent/80">{status}</Badge>
    case "Submitted":
      return <Badge variant="secondary">{status}</Badge>
    case "Scrubbing":
      return <Badge variant="outline" className="border-primary/50 text-primary">{status}</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

const formatDate = (val: any) => {
  if (val instanceof Timestamp) {
    return val.toDate().toLocaleDateString();
  }
  if (val instanceof Date) {
    return val.toLocaleDateString();
  }
  return val;
}

export const columns: ColumnDef<Claim>[] = [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          onClick={row.getToggleExpandedHandler()}
          className="h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="sr-only">Toggle details</span>
        </Button>
      )
    },
  },
  {
    accessorKey: "patientId",
    header: "Patient ID",
    cell: ({ row }) => <Link href={`/patients/${row.getValue("patientId")}`} className="font-medium text-primary hover:underline">{row.getValue("patientId") as string}</Link>,
  },
  {
    accessorKey: "patient",
    header: "Patient",
  },
  {
    accessorKey: "provider",
    header: "Provider",
  },
  {
    accessorKey: "payer",
    header: "Primary Payer",
  },
  {
    id: 'secondaryPayer',
    header: 'Secondary Payer',
    cell: ({ row }) => {
      const patient = patients.find(p => p.id === row.original.patientId);
      return patient?.secondaryInsuranceProvider || 'N/A';
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
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
    accessorKey: "dateOfService",
    header: "Date of Service",
    cell: ({ row }) => formatDate(row.getValue("dateOfService")),
  },
  {
    accessorKey: "date",
    header: "Submission Date",
    cell: ({ row }) => formatDate(row.getValue("date")),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const claim = row.original

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
            <DropdownMenuItem asChild>
              <Link href={`/claims/${claim.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Triage Denial</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Generate Appeal</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
