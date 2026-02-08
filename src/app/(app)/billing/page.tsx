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
import { 
    DollarSign, 
    FileWarning, 
    Mail, 
    FileCheck, 
    Search, 
    Loader, 
    Settings2, 
    Send, 
    Printer, 
    History, 
    PauseCircle, 
    PlayCircle, 
    CheckSquare, 
    Square,
    Zap
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortingState, useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender, ColumnFiltersState, VisibilityState, RowSelectionState } from '@tanstack/react-table';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

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
    const totalAllAmount = table.getCoreRowModel().rows.reduce((acc, row) => acc + row.original.amount, 0);

    if (isLoading) return <div className="p-8 text-center"><Loader className="h-8 w-8 animate-spin mx-auto text-primary" /></div>;

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] border rounded-lg bg-background overflow-hidden shadow-2xl">
            {/* Workbench Header */}
            <div className="bg-gradient-to-b from-primary/10 to-transparent p-2 border-b flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> Claim(s) Management Workbench
                </span>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6"><Settings2 className="h-3 w-3" /></Button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-muted/30 p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-10 gap-3 items-end border-b shadow-inner">
                <div className="space-y-1 col-span-1 md:col-span-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Provider:</Label>
                    <Select defaultValue="all">
                        <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Providers</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1 col-span-1 md:col-span-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Insurance:</Label>
                    <Select defaultValue="all">
                        <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Insurance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1 col-span-1 md:col-span-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Patient:</Label>
                    <Input className="h-8 text-xs bg-background" placeholder="Patient Search..." />
                </div>
                <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Charge From:</Label>
                    <Input type="date" className="h-8 text-xs bg-background" />
                </div>
                <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Charge To:</Label>
                    <Input type="date" className="h-8 text-xs bg-background" />
                </div>
                <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Priority:</Label>
                    <Select defaultValue="all">
                        <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="primary">Primary</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-wrap gap-3 pb-1 justify-center xl:justify-start">
                    <div className="flex items-center gap-1">
                        <Checkbox id="ovd" /><Label htmlFor="ovd" className="text-[10px] font-bold">Ovd</Label>
                    </div>
                    <div className="flex items-center gap-1">
                        <Checkbox id="wc" /><Label htmlFor="wc" className="text-[10px] font-bold">WC</Label>
                    </div>
                    <div className="flex items-center gap-1">
                        <Checkbox id="scrub" defaultChecked /><Label htmlFor="scrub" className="text-[10px] font-bold">Scrub</Label>
                    </div>
                </div>
                <Button className="h-8 w-full shadow-sm" size="sm"><Search className="mr-2 h-3 w-3" /> Retrieve</Button>
            </div>

            {/* Main Workspace Layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Table Area */}
                <div className="flex-1 overflow-auto border-r">
                    <Table className="text-[11px]">
                        <TableHeader className="bg-muted/50 sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="h-8 whitespace-nowrap font-bold text-muted-foreground uppercase text-[10px]">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="h-10">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-1 whitespace-nowrap border-r last:border-r-0">
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

                {/* Right Action Sidebar */}
                <div className="w-48 bg-muted/20 flex flex-col p-2 space-y-4 border-l">
                    <div className="space-y-1">
                        <Button variant="outline" className="w-full justify-start text-[10px] h-8 px-2 font-bold uppercase" size="sm">
                            <Zap className="mr-2 h-3 w-3 text-accent" /> Pre-Claim
                        </Button>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase px-1">EMC:</p>
                        <Separator className="mb-1" />
                        <Button variant="outline" className="w-full justify-start text-[10px] h-8 px-2" size="sm">
                            <Settings2 className="mr-2 h-3 w-3" /> Generate
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-[10px] h-8 px-2" size="sm">
                            <Send className="mr-2 h-3 w-3" /> Send / Rece.
                        </Button>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase px-1">Paper Forms:</p>
                        <Separator className="mb-1" />
                        <div className="grid grid-cols-2 gap-1">
                            <Button variant="outline" className="text-[9px] h-8 p-1" size="sm"><Printer className="mr-1 h-3 w-3" /> 1500</Button>
                            <Button variant="outline" className="text-[9px] h-8 p-1" size="sm"><Printer className="mr-1 h-3 w-3" /> UB04</Button>
                            <Button variant="outline" className="text-[9px] h-8 p-1" size="sm"><Printer className="mr-1 h-3 w-3" /> ADA</Button>
                            <Button variant="outline" className="text-[9px] h-8 p-1" size="sm"><Printer className="mr-1 h-3 w-3" /> WC</Button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase px-1">Workflow:</p>
                        <Separator className="mb-1" />
                        <Button variant="outline" className="w-full justify-start text-[10px] h-8 px-2" size="sm">
                            <History className="mr-2 h-3 w-3" /> History
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-[10px] h-8 px-2" size="sm">
                            <RefreshCw className="mr-2 h-3 w-3" /> Rebill
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-[10px] h-8 px-2" size="sm">
                            <PauseCircle className="mr-2 h-3 w-3" /> Hold Batch
                        </Button>
                    </div>

                    <div className="mt-auto space-y-1">
                        <Button variant="secondary" className="w-full text-[9px] h-7 uppercase" size="sm" onClick={() => table.toggleAllPageRowsSelected(true)}>
                            <CheckSquare className="mr-1 h-3 w-3" /> Select All
                        </Button>
                        <Button variant="ghost" className="w-full text-[9px] h-7 uppercase" size="sm" onClick={() => table.toggleAllPageRowsSelected(false)}>
                            <Square className="mr-1 h-3 w-3" /> Deselect
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="bg-primary/90 text-primary-foreground p-1 px-4 flex items-center justify-between text-[10px] font-bold shadow-2xl">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><FileWarning className="h-3 w-3" /> Ovd = Overdue</span>
                    <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Scrubbing On</span>
                </div>
                <div className="flex gap-6 items-center">
                    <span className="uppercase opacity-80">Practice: {selectedPractice?.name}</span>
                    <div className="flex gap-4 bg-black/20 px-3 py-0.5 rounded">
                        <span>TOTAL RECORDS: {table.getCoreRowModel().rows.length}</span>
                        <span>TOTAL AMOUNT: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalAllAmount)}</span>
                    </div>
                    {selectedRows.length > 0 && (
                        <div className="flex gap-4 bg-accent text-accent-foreground px-3 py-0.5 rounded animate-pulse">
                            <span>SELECTED: {selectedRows.length}</span>
                            <span>SELECTED AMT: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalSelectedAmount)}</span>
                        </div>
                    )}
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
                title="Billing & Claims Workbench" 
                description="Professional revenue cycle management center."
            />
            
            <Tabs defaultValue="insurance" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                    <TabsTrigger value="insurance">Insurance Billing</TabsTrigger>
                    <TabsTrigger value="patient">Patient Billing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="insurance" className="mt-4">
                    <InsuranceBillingWorkbench />
                </TabsContent>

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
            </Tabs>
        </div>
    )
}
