
'use client'

import React from 'react';
import { PageHeader } from "@/components/page-header";
import { statements, claims, Claim } from "@/lib/data";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, FileWarning, Mail, FileCheck, Send, TestTube2, Cog, History, PauseCircle, CheckSquare, XSquare, FileText, AlertCircle, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { payments, Payment } from "@/lib/payments-data";
import { Row, SortingState, useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender, ColumnFiltersState, VisibilityState, RowSelectionState } from '@tanstack/react-table';
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { insuranceBillingColumns } from "./insurance-billing-columns";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

function renderSubComponent({ row }: { row: Row<Payment> }) {
    const payment = row.original;
    const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
    const allowedAmount = payment.amountPaid + payment.patientResponsibility;

    return (
        <div className="p-4 bg-muted/50 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">Claim & Payment Details</h4>
                    <p><span className="text-muted-foreground w-28 inline-block">Claim ID:</span> <Link href={`/claims/${payment.claimId}`} className="font-medium text-primary hover:underline">{payment.claimId}</Link></p>
                    <p><span className="text-muted-foreground w-28 inline-block">Payment Method:</span> {payment.paymentMethod}</p>
                    {payment.checkNumber && <p><span className="text-muted-foreground w-28 inline-block">Check Number:</span> {payment.checkNumber}</p>}
                </div>
                <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">Financial Summary</h4>
                    <div className="flex justify-between"><span className="text-muted-foreground">Billed Amount:</span> <span>{formatCurrency(payment.billedAmount)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Allowed Amount:</span> <span>{formatCurrency(allowedAmount)}</span></div>
                    <div className="flex justify-between font-medium"><span className="text-muted-foreground">Amount Paid:</span> <span>{formatCurrency(payment.amountPaid)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Patient Responsibility:</span> <span>{formatCurrency(payment.patientResponsibility)}</span></div>
                </div>
                <div className="space-y-3">
                    <h4 className="font-semibold">Adjustments</h4>
                    {payment.adjustments.map((adj, i) => (
                        <div key={i} className="flex justify-between">
                            <div>
                                <span className="font-mono text-xs bg-background border rounded-sm px-1 py-0.5">{adj.reasonCode}</span>
                                <span className="ml-2">{adj.description}</span>
                            </div>
                            <span>{formatCurrency(adj.amount)}</span>
                        </div>
                    ))}
                     {!payment.adjustments.length && <p className='text-muted-foreground'>No adjustments for this payment.</p>}
                </div>
            </div>
        </div>
    )
}

function InsuranceBillingWorkbench() {
    const [data] = React.useState(() => [...claims]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

    const table = useReactTable({
        data,
        columns: insuranceBillingColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const selectedRows = table.getSelectedRowModel().rows;
    const totalSelectedAmount = selectedRows.reduce((total, row) => total + row.original.amount, 0);

    return (
        <div className="space-y-4">
            <Card className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 items-end">
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="patient-filter">Patient</Label>
                        <Input id="patient-filter" placeholder="Filter by patient..." value={(table.getColumn("patient")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("patient")?.setFilterValue(event.target.value)} />
                    </div>
                     <div className="space-y-2 col-span-2">
                        <Label htmlFor="insurance-filter">Insurance</Label>
                        <Input id="insurance-filter" placeholder="Filter by insurance..." value={(table.getColumn("payer")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("payer")?.setFilterValue(event.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="priority-filter">Priority</Label>
                        <Select value={(table.getColumn("priority")?.getFilterValue() as string) ?? ""} onValueChange={(value) => table.getColumn("priority")?.setFilterValue(value === "all" ? "" : value)}>
                            <SelectTrigger id="priority-filter"><SelectValue placeholder="All" /></SelectTrigger>
                            <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="Primary">Primary</SelectItem><SelectItem value="Secondary">Secondary</SelectItem><SelectItem value="Tertiary">Tertiary</SelectItem></SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="type-filter">Type</Label>
                         <Select value={(table.getColumn("submissionType")?.getFilterValue() as string) ?? ""} onValueChange={(value) => table.getColumn("submissionType")?.setFilterValue(value === "all" ? "" : value)}>
                            <SelectTrigger id="type-filter"><SelectValue placeholder="Both" /></SelectTrigger>
                            <SelectContent><SelectItem value="all">Both</SelectItem><SelectItem value="EMC">EMC</SelectItem><SelectItem value="Paper">Paper</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="form-filter">Form</Label>
                        <Select value={(table.getColumn("formType")?.getFilterValue() as string) ?? ""} onValueChange={(value) => table.getColumn("formType")?.setFilterValue(value === "all" ? "" : value)}>
                            <SelectTrigger id="form-filter"><SelectValue placeholder="All" /></SelectTrigger>
                            <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="CMS 1500">CMS 1500</SelectItem><SelectItem value="UB04">UB04</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <Button className="w-full"><Search className="mr-2 h-4 w-4" />Retrieve</Button>
                </div>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-4 items-start">
                <div className="space-y-2">
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <TableHead key={header.id} className="whitespace-nowrap">
                                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows?.length ? (
                                            table.getRowModel().rows.map((row) => (
                                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                                    {row.getVisibleCells().map((cell) => (
                                                        <TableCell key={cell.id} className="whitespace-nowrap">
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={insuranceBillingColumns.length} className="h-24 text-center">No results.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-between items-center text-sm font-medium p-2 border rounded-lg bg-muted/50">
                        <div className="flex items-center gap-4">
                           <span className="flex items-center gap-1 text-red-600"><AlertCircle className="h-4 w-4" /> Overdue Claim Filing Days</span>
                           <span>Scrubbing On</span>
                           <span>Transaction on Hold [{claims.filter(c => c.status === 'Pending').length}]</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>Total: {selectedRows.length || table.getCoreRowModel().rows.length}</span>
                             <span className="font-bold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalSelectedAmount || table.getCoreRowModel().rows.reduce((acc, row) => acc + row.original.amount, 0))}</span>
                        </div>
                    </div>
                </div>

                 <Card className="w-full xl:w-[180px] shrink-0">
                    <CardHeader className="p-2 border-b">
                        <Button className="w-full"><DollarSign className="mr-2 h-4 w-4"/>Pre-Claim</Button>
                    </CardHeader>
                    <CardContent className="p-2 space-y-2">
                        <h4 className="font-semibold text-sm px-2">EMC:</h4>
                        <Button variant="outline" className="w-full justify-start"><Cog className="mr-2 h-4 w-4" />Generate</Button>
                        <Button variant="outline" className="w-full justify-start"><Send className="mr-2 h-4 w-4" />Send/Rece.</Button>
                        <Separator />
                        <h4 className="font-semibold text-sm px-2">Paper:</h4>
                         <Button variant="outline" className="w-full justify-start"><FileText className="mr-2 h-4 w-4" />CMS 1500</Button>
                         <Button variant="outline" className="w-full justify-start"><FileText className="mr-2 h-4 w-4" />UB04</Button>
                         <Separator />
                        <Button variant="outline" className="w-full justify-start"><History className="mr-2 h-4 w-4" />History</Button>
                        <Button variant="outline" className="w-full justify-start"><PauseCircle className="mr-2 h-4 w-4" />Hold</Button>
                        <Separator />
                        <Button variant="outline" className="w-full justify-start" onClick={() => table.toggleAllRowsSelected(true)}><CheckSquare className="mr-2 h-4 w-4"/>Select All</Button>
                        <Button variant="outline" className="w-full justify-start" onClick={() => table.toggleAllRowsSelected(false)}><XSquare className="mr-2 h-4 w-4"/>Deselect All</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function BillingPage() {

    const data = statements;

    const stats = {
        outstanding: data.filter(s => s.status === 'Sent' || s.status === 'Overdue').reduce((acc, s) => acc + s.amountDue, 0),
        overdue: data.filter(s => s.status === 'Overdue').length,
        draft: data.filter(s => s.status === 'Draft').length,
        paidThisMonth: data.filter(s => s.status === 'Paid').length, // Simplified
    }
    

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Billing" 
                description="Manage both patient and insurance billing processes."
            />
            
            <Tabs defaultValue="patient" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                    <TabsTrigger value="patient">Patient Billing</TabsTrigger>
                    <TabsTrigger value="insurance">Insurance Billing</TabsTrigger>
                </TabsList>
                <TabsContent value="patient" className="mt-4 space-y-6">
                     <div className="flex items-center justify-between">
                         <h2 className="text-xl font-semibold tracking-tight">Patient Statements</h2>
                         <div className="flex gap-2">
                            <Button variant="outline">Send Reminders</Button>
                             <Button asChild>
                                <Link href="/billing/statements">Generate Statements</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.outstanding)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Overdue Statements</CardTitle>
                                <FileWarning className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.overdue}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Statements in Draft</CardTitle>
                                <Mail className="h-4 w-4 text-accent" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.draft}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Paid (This Month)</CardTitle>
                                <FileCheck className="h-4 w-4 text-success" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.paidThisMonth}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <DataTable columns={columns} data={data} filterColumn="patientName" filterPlaceholder="Filter by patient name..." />
                </TabsContent>
                <TabsContent value="insurance" className="mt-4">
                    <InsuranceBillingWorkbench />
                </TabsContent>
            </Tabs>
        </div>
    )
}
