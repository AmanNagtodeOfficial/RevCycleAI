"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Claim } from "@/lib/data"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
    cell: ({ row }) => (
        <Select defaultValue={row.getValue("submissionType")}>
            <SelectTrigger className="h-7 text-[10px] w-20">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="EMC">EMC</SelectItem>
                <SelectItem value="Paper">Paper</SelectItem>
            </SelectContent>
        </Select>
    )
  },
  {
    accessorKey: "formType",
    header: "Form",
    cell: ({ row }) => <span className="text-[11px] font-medium">{row.getValue("formType")}</span>
  },
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ row }) => <span className="text-[11px] uppercase">{row.getValue("provider")}</span>
  },
  {
    accessorKey: "payer",
    header: "Insurance",
    cell: ({ row }) => <span className="text-[11px] font-bold text-primary cursor-pointer hover:underline uppercase">{row.getValue("payer")}</span>
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => <span className="text-[11px] font-medium text-primary uppercase">{row.getValue("priority")}</span>
  },
  {
    accessorKey: "claimCount",
    header: "Claims",
     cell: ({ row }) => {
      return <div className="text-center text-[11px] font-bold">{row.getValue("claimCount") || 1}</div>
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-end text-[11px] h-auto p-0"
          >
            Amount
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        )
      },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)

      return <div className="text-right font-mono text-[11px] pr-2">{formatted}</div>
    },
  },
]
