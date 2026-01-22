"use client"

import { ColumnDef } from "@tanstack/react-table"
import { InsurancePlan } from "@/lib/insurance-data"
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

export const columns: ColumnDef<InsurancePlan>[] = [
  {
    accessorKey: "payerName",
    header: "Payer",
    cell: ({ row }) => <Link href={`/insurance/${row.original.id}`} className="font-medium text-primary hover:underline">{row.getValue("payerName")}</Link>,
  },
  {
    accessorKey: "planName",
    header: "Plan Name",
  },
  {
    accessorKey: "planType",
    header: "Plan Type",
     cell: ({ row }) => <Badge variant="secondary">{row.getValue("planType")}</Badge>,
  },
    {
    accessorKey: "memberCount",
    header: "Members",
  },
    {
    accessorKey: "totalClaims",
    header: "Total Claims",
  },
    {
    accessorKey: "timelyFilingLimit",
    header: "TFL (Days)",
  },
   {
    accessorKey: "claimsCorrectionLimit",
    header: "CCFL (Days)",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <Badge variant={status === 'Active' ? 'default' : 'destructive'} className={status === 'Active' ? 'bg-success text-success-foreground' : ''}>{status}</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const insurance = row.original

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
              <Link href={`/insurance/${insurance.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>View Associated Claims</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Plan Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
