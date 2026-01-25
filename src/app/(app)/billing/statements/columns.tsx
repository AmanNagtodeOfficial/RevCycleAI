
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

// Placeholder type
export type PatientForStatement = {
  id: string;
  chartNo: string;
  patientName: string;
  dob: string;
  address: string;
  phone: string;
  credit: number;
  balance: number;
  insBalance: number;
  patientOpeningBal: number;
  insOpeningBal: number;
  email: string;
};


const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export const columns: ColumnDef<PatientForStatement>[] = [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "chartNo",
    header: "Chart No",
  },
  {
    accessorKey: "patientName",
    header: "Patient Name",
  },
  {
    accessorKey: "dob",
    header: "DOB",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "credit",
    header: () => <div className="text-right">Credit</div>,
    cell: ({ row }) => <div className="text-right">{formatCurrency(row.getValue("credit"))}</div>,
    footer: ({ table }) => {
        const total = table.getCoreRowModel().rows.reduce((sum, row) => sum + (row.getValue("credit") as number), 0)
        return <div className="text-right">{formatCurrency(total)}</div>
    }
  },
    {
    accessorKey: "balance",
    header: () => <div className="text-right">Balance</div>,
    cell: ({ row }) => <div className="text-right">{formatCurrency(row.getValue("balance"))}</div>,
    footer: ({ table }) => {
        const total = table.getCoreRowModel().rows.reduce((sum, row) => sum + (row.getValue("balance") as number), 0)
        return <div className="text-right font-bold">{formatCurrency(total)}</div>
    }
  },
    {
    accessorKey: "insBalance",
    header: () => <div className="text-right">Ins. Balance</div>,
    cell: ({ row }) => <div className="text-right">{formatCurrency(row.getValue("insBalance"))}</div>,
    footer: ({ table }) => {
        const total = table.getCoreRowModel().rows.reduce((sum, row) => sum + (row.getValue("insBalance") as number), 0)
        return <div className="text-right">{formatCurrency(total)}</div>
    }
  },
    {
    accessorKey: "patientOpeningBal",
    header: () => <div className="text-right">Patient Opening Bal.</div>,
    cell: ({ row }) => <div className="text-right">{formatCurrency(row.getValue("patientOpeningBal"))}</div>,
    footer: ({ table }) => {
        const total = table.getCoreRowModel().rows.reduce((sum, row) => sum + (row.getValue("patientOpeningBal") as number), 0)
        return <div className="text-right">{formatCurrency(total)}</div>
    }
  },
    {
    accessorKey: "insOpeningBal",
    header: () => <div className="text-right">Ins. Opening Bal.</div>,
    cell: ({ row }) => <div className="text-right">{formatCurrency(row.getValue("insOpeningBal"))}</div>,
     footer: ({ table }) => {
        const total = table.getCoreRowModel().rows.reduce((sum, row) => sum + (row.getValue("insOpeningBal") as number), 0)
        return <div className="text-right">{formatCurrency(total)}</div>
    }
  },
   {
    accessorKey: "email",
    header: "E-mail",
  },
]
