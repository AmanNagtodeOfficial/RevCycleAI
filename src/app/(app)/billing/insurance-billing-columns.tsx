"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Claim } from "@/lib/data"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const insuranceBillingColumns: ColumnDef<Claim>[] = [
  {
    id: "indicator",
    header: "",
    cell: ({ row }) => (
        <div className="w-4 flex justify-center text-primary font-bold">
            {row.getIsSelected() ? ">" : ""}
        </div>
    ),
    size: 20,
  },
  {
    id: "index",
    header: "",
    cell: ({ row }) => <span className="font-bold text-[10px] text-muted-foreground">{row.index + 1}.</span>,
    size: 30,
  },
  {
    id: "select",
    header: "",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="h-3 w-3"
      />
    ),
    size: 30,
  },
  {
    accessorKey: "submissionType",
    header: "Type",
    cell: ({ row }) => (
        <Select defaultValue={row.getValue("submissionType")}>
            <SelectTrigger className="h-5 text-[9px] w-16 p-1 bg-background border-none shadow-none">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="EMC">EMC</SelectItem>
                <SelectItem value="Paper">Paper</SelectItem>
            </SelectContent>
        </Select>
    ),
    size: 70,
  },
  {
    accessorKey: "formType",
    header: "Form",
    cell: ({ row }) => <span className="text-[10px]">{row.getValue("formType")}</span>,
    size: 80,
  },
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ row }) => <span className="text-[10px] text-primary font-medium cursor-pointer hover:underline uppercase">{row.getValue("provider")}</span>,
  },
  {
    accessorKey: "payer",
    header: "Insurance",
    cell: ({ row }) => <span className="text-[10px] text-primary font-bold cursor-pointer hover:underline uppercase">{row.getValue("payer")}</span>,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => <span className="text-[10px] text-primary font-medium uppercase">{row.getValue("priority")}</span>,
    size: 100,
  },
  {
    accessorKey: "claimCount",
    header: "Claims",
     cell: ({ row }) => {
      return <div className="text-center text-[10px] text-primary font-bold">{row.getValue("claimCount") || 1}</div>
    },
    size: 60,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)

      return <div className="text-right text-[10px] pr-2 font-mono">{formatted}</div>
    },
    size: 100,
  },
]
