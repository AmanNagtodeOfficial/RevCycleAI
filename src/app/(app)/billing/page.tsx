
'use client'

import React from 'react';
import { PageHeader } from "@/components/page-header";
import { Claim, Statement } from "@/lib/data";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, FileWarning, Mail, FileCheck, Search, Loader } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Payment } from "@/lib/payments-data";
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
import { insuranceBillingColumns } from "./insurance-billing-columns";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePractice } from '@/context/practice-context';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

function InsuranceBillingWorkbench() {
    const { selectedPractice } = usePractice();
    const firestore = useFirestore();

    const claimsQuery = React.useMemo(() => {
        if (!firestore || !selectedPractice) return null;
        return query(collection(firestore, 'claims'), where('practiceId', '==', selectedPractice.id));
    }, [firestore, selectedPractice]);

    const { data: claims, isLoading } = useCollection<Claim>(claimsQuery);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

    const table = useReactTable({
        data: claims || [],
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

    if (isLoading) return <div className="p-8 text-center"><Loader className="h-8 w-8 animate-spin mx-auto text-primary" /></div>;

    return (
        <div className="space-y-4">
            <Card className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-end">
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="patient-filter">Patient</Label>
                        <Input id="patient-filter" placeholder="Filter by patient..." value={(table.getColumn("patient")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("patient")?.setFilterValue(event.target.value)} />
                    </div>
                     <div className="space-y-2 col-span-2">
                        <Label htmlFor="insurance-filter">Insurance</Label>
                        <Input id="insurance-filter" placeholder="Filter by insurance..." value={(table.getColumn("payer")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("payer")?.setFilterValue(event.target.value)} />
                    </div>
                    <Button className="w-full"><Search className="mr-2 h-4 w-4" />Retrieve</Button>
                </div>
            </Card>

            <div className="grid grid-cols-1 gap-4 items-start">
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
                <div className="flex justify-between items-center text-sm font-medium p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                        <span>Total Records: {selectedRows.length || table.getCoreRowModel().rows.length}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="font-bold">Total Amount: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalSelectedAmount || table.getCoreRowModel().rows.reduce((acc, row) => acc + row.original.amount, 0))}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BillingPage() {
    const { selectedPractice } = usePractice();
    const firestore = useFirestore();

    const statementsQuery = React.useMemo(() => {
        if (!firestore || !selectedPractice) return null;
        return query(collection(firestore, 'statements'), where('practiceId', '==', selectedPractice.id));
    }, [firestore, selectedPractice]);

    const { data: statements, isLoading } = useCollection<Statement>(statementsQuery);

    const stats = React.useMemo(() => {
        if (!statements) return { outstanding: 0, overdue: 0, draft: 0, paidThisMonth: 0 };
        return {
            outstanding: statements.filter(s => s.status === 'Sent' || s.status === 'Overdue').reduce((acc, s) => acc + s.amountDue, 0),
            overdue: statements.filter(s => s.status === 'Overdue').length,
            draft: statements.filter(s => s.status === 'Draft').length,
            paidThisMonth: statements.filter(s => s.status === 'Paid').length,
        }
    }, [statements]);
    

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

                    <DataTable columns={columns} data={statements || []} filterColumn="patientName" filterPlaceholder="Filter by patient name..." />
                </TabsContent>
                <TabsContent value="insurance" className="mt-4">
                    <InsuranceBillingWorkbench />
                </TabsContent>
            </Tabs>
        </div>
    )
}
