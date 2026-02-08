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
    CheckSquare, 
    Square,
    Zap,
    RefreshCw,
    X,
    Minus,
    FileText,
    Settings,
    Briefcase,
    LayoutGrid,
    LineChart,
    Activity,
    Clock,
    MousePointer2,
    Database,
    ShieldAlert
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

    const totalSelectedAmount = table.getSelectedRowModel().rows.reduce((total, row) => total + row.original.amount, 0);
    const totalAllAmount = table.getCoreRowModel().rows.reduce((acc, row) => acc + row.original.amount, 0);

    if (isLoading) return <div className="p-8 text-center"><Loader className="h-8 w-8 animate-spin mx-auto text-primary" /></div>;

    return (
        <div className="flex flex-col h-[calc(100vh-180px)] border bg-background overflow-hidden shadow-sm rounded-lg border-border">
            {/* Mock Application Toolbar */}
            <div className="bg-muted/30 border-b text-[10px] px-3 py-1 flex items-center gap-4 font-medium text-muted-foreground">
                <div className="flex gap-3">
                    {['Action', 'View', 'Setup', 'Activities', 'Billing', 'Reports', 'Utilities', 'Help'].map(m => (
                        <span key={m} className="cursor-pointer hover:text-foreground transition-colors">{m}</span>
                    ))}
                </div>
                <div className="flex items-center gap-1 border-l pl-4">
                    {[FileText, Settings, Briefcase, LayoutGrid, LineChart, Activity, Clock, MousePointer2, Database].map((Icon, idx) => (
                        <Button key={idx} variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary">
                            <Icon className="h-3.5 w-3.5" />
                        </Button>
                    ))}
                </div>
            </div>

            {/* Workbench Internal Content */}
            <div className="flex-1 flex flex-col p-1 gap-1">
                {/* Internal Title Bar */}
                <div className="bg-primary text-primary-foreground px-3 py-1 flex items-center justify-between rounded-t-md shadow-sm">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Claims Workbench</span>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" className="h-4 w-4 p-0 hover:bg-white/20 text-white"><Minus className="h-3 w-3" /></Button>
                        <Button variant="ghost" className="h-4 w-4 p-0 hover:bg-white/20 text-white"><X className="h-3 w-3" /></Button>
                    </div>
                </div>

                {/* Dense Filter Bar */}
                <div className="bg-card border rounded-md p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-end shadow-sm">
                    <div className="lg:col-span-2 space-y-1">
                        <Label className="text-[9px] font-bold uppercase">Provider:</Label>
                        <Select defaultValue="all">
                            <SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="all">All Rendering</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="lg:col-span-2 space-y-1">
                        <Label className="text-[9px] font-bold uppercase">Insurance:</Label>
                        <Select defaultValue="all">
                            <SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="all">All Payers</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="lg:col-span-2 space-y-1">
                        <Label className="text-[9px] font-bold uppercase">Patient:</Label>
                        <Input className="h-7 text-[10px]" placeholder="Search patient..." />
                    </div>
                    <div className="lg:col-span-1 space-y-1">
                        <Label className="text-[9px] font-bold uppercase">From:</Label>
                        <Input className="h-7 text-[10px]" type="date" />
                    </div>
                    <div className="lg:col-span-1 space-y-1">
                        <Label className="text-[9px] font-bold uppercase">To:</Label>
                        <Input className="h-7 text-[10px]" type="date" />
                    </div>
                    <div className="lg:col-span-1 space-y-1">
                        <Label className="text-[9px] font-bold uppercase">Priority:</Label>
                        <Select defaultValue="all">
                            <SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="all">Any</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="lg:col-span-1 space-y-1">
                        <Label className="text-[9px] font-bold uppercase">Form:</Label>
                        <Select defaultValue="all">
                            <SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="all">Any</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="lg:col-span-2 flex gap-1">
                        <Button className="h-7 text-[10px] flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                            <Search className="mr-1 h-3 w-3" /> Retrieve
                        </Button>
                        <Button variant="outline" className="h-7 w-7 p-0" title="Refresh">
                            <RefreshCw className="h-3 w-3" />
                        </Button>
                    </div>
                </div>

                {/* Main Workspace Workspace */}
                <div className="flex flex-1 overflow-hidden gap-1">
                    {/* Table Area */}
                    <div className="flex-1 bg-card border rounded-md overflow-auto shadow-inner">
                        <Table className="text-[10px]">
                            <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} className="h-8 whitespace-nowrap font-bold text-[9px] uppercase border-r border-border/50 last:border-r-0 px-2">
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row, idx) => (
                                        <TableRow 
                                            key={row.id} 
                                            data-state={row.getIsSelected() && "selected"} 
                                            className={idx % 2 === 1 ? "bg-muted/20 h-8" : "h-8"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="py-1 px-2 whitespace-nowrap border-r border-border/20 last:border-r-0">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={insuranceBillingColumns.length} className="h-32 text-center text-muted-foreground italic">No results found for the current criteria.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Functional Sidebar */}
                    <div className="w-28 flex flex-col gap-2 p-1 border-l bg-muted/10">
                        <div className="space-y-1">
                            <p className="text-[8px] font-bold text-muted-foreground uppercase pl-1 border-b pb-0.5">EMC Process</p>
                            <Button variant="outline" className="w-full h-14 flex flex-col items-center justify-center p-1 bg-background" size="sm">
                                <Settings2 className="h-5 w-5 text-primary" />
                                <span className="text-[8px] font-bold mt-1">Generate</span>
                            </Button>
                            <Button variant="outline" className="w-full h-14 flex flex-col items-center justify-center p-1 bg-background" size="sm">
                                <Send className="h-5 w-5 text-success" />
                                <span className="text-[8px] font-bold mt-1">Transmit</span>
                            </Button>
                        </div>

                        <div className="space-y-1 mt-2">
                            <p className="text-[8px] font-bold text-muted-foreground uppercase pl-1 border-b pb-0.5">Paper Claims</p>
                            <div className="grid grid-cols-2 gap-1">
                                <Button variant="ghost" className="h-10 border flex flex-col items-center justify-center p-0.5 bg-background" size="sm">
                                    <Printer className="h-4 w-4" />
                                    <span className="text-[7px] font-bold">CMS 1500</span>
                                </Button>
                                <Button variant="ghost" className="h-10 border flex flex-col items-center justify-center p-0.5 bg-background" size="sm">
                                    <Database className="h-4 w-4" />
                                    <span className="text-[7px] font-bold">UB04</span>
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-1 mt-2">
                            <p className="text-[8px] font-bold text-muted-foreground uppercase pl-1 border-b pb-0.5">Workflow</p>
                            <Button variant="ghost" className="w-full h-10 flex flex-col items-center justify-center border bg-background" size="sm">
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="text-[8px] font-bold">Review</span>
                            </Button>
                            <Button variant="ghost" className="w-full h-10 flex flex-col items-center justify-center border bg-background" size="sm">
                                <RefreshCw className="h-4 w-4 text-success" />
                                <span className="text-[8px] font-bold">Rebill</span>
                            </Button>
                            <Button variant="ghost" className="w-full h-10 flex flex-col items-center justify-center border bg-background" size="sm">
                                <PauseCircle className="h-4 w-4 text-destructive" />
                                <span className="text-[8px] font-bold">Hold</span>
                            </Button>
                        </div>

                        <div className="mt-auto space-y-1">
                            <div className="grid grid-cols-2 gap-1">
                                <Button variant="outline" className="h-8 flex flex-col items-center p-0.5 bg-background" size="sm" onClick={() => table.toggleAllPageRowsSelected(true)}>
                                    <CheckSquare className="h-3 w-3" />
                                    <span className="text-[7px] font-bold">All</span>
                                </Button>
                                <Button variant="outline" className="h-8 flex flex-col items-center p-0.5 bg-background" size="sm" onClick={() => table.toggleAllPageRowsSelected(false)}>
                                    <Square className="h-3 w-3" />
                                    <span className="text-[7px] font-bold">None</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Status Bar */}
                <div className="bg-primary text-primary-foreground p-1 px-4 flex items-center justify-between text-[10px] font-medium rounded-b-md shadow-lg border-t border-white/10">
                    <div className="flex gap-4 items-center">
                        <span className="flex items-center gap-1.5"><ShieldAlert className="h-3 w-3 text-accent" /> Overdue Filing Alert</span>
                        <span className="flex items-center gap-1.5"><Briefcase className="h-3 w-3 text-accent" /> Worker's Comp</span>
                        <span className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-white" /> AI Scrubbing Enabled</span>
                    </div>
                    <div className="flex gap-8 items-center border-l border-white/20 pl-6 h-full py-1">
                        <div className="flex gap-6 items-center">
                            <span className="flex items-center gap-2">Records: <span className="font-bold text-accent">{table.getCoreRowModel().rows.length}</span></span>
                            <span className="flex items-center gap-2">Total Amount: <span className="font-bold text-accent">{new Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(totalAllAmount)}</span></span>
                        </div>
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
                title="Billing & Claims Center" 
                description="Professional revenue cycle management and patient ledger."
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
                            <Button variant="outline">Batch Reminders</Button>
                             <Button asChild>
                                <Link href="/billing/statements">New Statement Run</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total A/R</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.outstanding)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Aging (Overdue)</CardTitle>
                                <FileWarning className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.overdue}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Unsent Drafts</CardTitle>
                                <Mail className="h-4 w-4 text-accent" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.draft}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Payments (MTD)</CardTitle>
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
