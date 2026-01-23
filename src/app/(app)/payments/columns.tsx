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
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "Payment ID",
  },
  {
    accessorKey: "claimId",
    header: "Claim ID",
    cell: ({ row }) => <Link href={`/claims/${row.getValue("claimId")}`} className="font-medium text-primary hover:underline">{row.getValue("claimId")}</Link>,
  },
  {
    accessorKey: "patientName",
    header: "Patient",
  },
  {
    accessorKey: "payerName",
    header: "Payer",
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
    accessorKey: "remittanceCode",
    header: "Remit Code",
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
