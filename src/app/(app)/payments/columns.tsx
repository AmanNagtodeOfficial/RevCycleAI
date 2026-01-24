
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Payment } from "@/lib/payments-data"
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
import { claims, patients } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<Payment>[] = [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={row.getToggleExpandedHandler()}
        >
          {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="sr-only">Toggle details</span>
        </Button>
      )
    },
  },
  {
    id: "patientId",
    header: "Patient ID",
    cell: ({ row }) => {
        const claim = claims.find(c => c.id === row.original.claimId);
        if (!claim) return 'N/A';
        return <Link href={`/patients/${claim.patientId}`} className="font-medium text-primary hover:underline">{claim.patientId}</Link>;
    }
  },
  {
    accessorKey: "patientName",
    header: "Patient",
  },
  {
    accessorKey: "payerName",
    header: "Paying Payer",
    cell: ({ row }) => <Badge variant="secondary">{row.getValue("payerName")}</Badge>
  },
  {
    id: 'primaryInsurance',
    header: 'Primary Payer',
    cell: ({ row }) => {
      const claim = claims.find(c => c.id === row.original.claimId)
      if (!claim) return 'N/A'
      const patient = patients.find(p => p.id === claim.patientId)
      return patient?.primaryInsuranceProvider || 'N/A'
    }
  },
  {
    id: 'secondaryInsurance',
    header: 'Secondary Payer',
    cell: ({ row }) => {
      const claim = claims.find(c => c.id === row.original.claimId)
      if (!claim) return 'N/A'
      const patient = patients.find(p => p.id === claim.patientId)
      return patient?.secondaryInsuranceProvider || 'N/A'
    }
  },
  {
    accessorKey: "paymentDate",
    header: "Payment Date",
  },
  {
    accessorKey: "amountPaid",
    header: () => <div className="text-right">Amount Paid</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amountPaid"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
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
            <DropdownMenuItem>View EOB/ERA</DropdownMenuItem>
            <DropdownMenuItem>Reconcile Payment</DropdownMenuItem>
            <DropdownMenuSeparator />
             <DropdownMenuItem asChild>
              <Link href={`/claims/${row.original.claimId}`}>View Claim</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
