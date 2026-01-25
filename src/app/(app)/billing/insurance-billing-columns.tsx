"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Claim } from "@/lib/data"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export const insuranceBillingColumns: ColumnDef<Claim>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "submissionType",
    header: "Type",
  },
  {
    accessorKey: "formType",
    header: "Form",
  },
  {
    accessorKey: "provider",
    header: "Provider",
  },
    {
    accessorKey: "patient",
    header: "Patient",
  },
  {
    accessorKey: "payer",
    header: "Insurance",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    accessorKey: "claimCount",
    header: "Claims",
     cell: ({ row }) => {
      return <div className="text-center">{row.getValue("claimCount")}</div>
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-end"
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium pr-4">{formatted}</div>
    },
  },
]
