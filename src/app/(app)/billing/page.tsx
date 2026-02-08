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
    Zap,
    RefreshCw,
    X,
    Minus,
    Square as Maximize,
    FileText,
    Settings,
    Briefcase,
    LayoutGrid,
    LineChart,
    ChevronDown,
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
        <div className="flex flex-col h-[calc(100vh-180px)] border bg-white overflow-hidden shadow-2xl rounded-sm">
            {/* Top Menu Bar (Legacy Style) */}
            <div className="bg-[#f0f0f0] border-b text-[10px] px-2 py-0.5 flex gap-4 font-normal">
                {['Action', 'View', 'Setup', 'Activities', 'Billing', 'Reports', 'Utilities', 'Windows', 'Help'].map(m => (
                    <span key={m} className="cursor-default hover:bg-primary/10 px-1">{m}</span>
                ))}
            </div>

            {/* Icon Toolbar (Legacy Style) */}
            <div className="bg-[#f0f0f0] border-b px-2 py-1 flex gap-2 overflow-x-auto">
                {[FileText, Settings, Briefcase, LayoutGrid, LineChart, Activity, Clock, MousePointer2, Database, ShieldAlert].map((Icon, idx) => (
                    <Button key={idx} variant="ghost" size="icon" className="h-6 w-6 text-primary hover:bg-white hover:shadow-inner border border-transparent hover:border-gray-300">
                        <Icon className="h-4 w-4" />
                    </Button>
                ))}
            </div>

            {/* Application Content Area */}
            <div className="flex-1 flex flex-col p-1 bg-[#d4d0c8]">
                <div className="flex-1 border-2 border-white shadow-inner bg-white flex flex-col overflow-hidden">
                    {/* Workbench Window Title Bar */}
                    <div className="bg-gradient-to-r from-[#0a246a] to-[#a6caf0] p-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-white p-0.5 rounded-sm">
                                <DollarSign className="h-2 w-2 text-[#0a246a]" strokeWidth={4} />
                            </div>
                            <span className="text-white text-[11px] font-bold">Claim(s)</span>
                        </div>
                        <div className="flex gap-0.5">
                            <Button variant="outline" className="h-4 w-4 p-0 bg-[#d4d0c8] border-none rounded-none"><Minus className="h-3 w-3" /></Button>
                            <Button variant="outline" className="h-4 w-4 p-0 bg-[#d4d0c8] border-none rounded-none"><Maximize className="h-2 w-2" /></Button>
                            <Button variant="outline" className="h-4 w-4 p-0 bg-[#d4d0c8] border-none rounded-none hover:bg-red-500 hover:text-white"><X className="h-3 w-3" /></Button>
                        </div>
                    </div>

                    {/* Filter Bar (Orange/Yellow Gradient) */}
                    <div className="bg-gradient-to-b from-[#f9c152] to-[#ff9900] p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2 items-end border-b border-gray-400">
                        <div className="lg:col-span-2 space-y-0.5">
                            <Label className="text-[9px] font-bold text-black uppercase">Provider:</Label>
                            <Select defaultValue="all">
                                <SelectTrigger className="h-5 text-[10px] bg-white border-gray-400 rounded-none p-1"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="all">All</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div className="lg:col-span-2 space-y-0.5">
                            <Label className="text-[9px] font-bold text-black uppercase">Insurance (?)</Label>
                            <Select defaultValue="all">
                                <SelectTrigger className="h-5 text-[10px] bg-white border-gray-400 rounded-none p-1"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="all">All</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div className="lg:col-span-2 space-y-0.5">
                            <Label className="text-[9px] font-bold text-black uppercase">Patient (?)</Label>
                            <Input className="h-5 text-[10px] bg-white border-gray-400 rounded-none p-1" />
                        </div>
                        <div className="lg:col-span-1 space-y-0.5">
                            <Label className="text-[9px] font-bold text-black">Charge From:</Label>
                            <Input className="h-5 text-[10px] bg-white border-gray-400 rounded-none p-1" defaultValue="00/00/00" />
                        </div>
                        <div className="lg:col-span-1 space-y-0.5">
                            <Label className="text-[9px] font-bold text-black">Charge To:</Label>
                            <Input className="h-5 text-[10px] bg-white border-gray-400 rounded-none p-1" defaultValue="01/05/13" />
                        </div>
                        <div className="lg:col-span-1 space-y-0.5">
                            <Label className="text-[9px] font-bold text-black">Priority:</Label>
                            <Select defaultValue="all">
                                <SelectTrigger className="h-5 text-[10px] bg-white border-gray-400 rounded-none p-1"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="all">All</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div className="lg:col-span-1 space-y-0.5">
                            <Label className="text-[9px] font-bold text-black">Type:</Label>
                            <Select defaultValue="both">
                                <SelectTrigger className="h-5 text-[10px] bg-white border-gray-400 rounded-none p-1"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="both">Both</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div className="lg:col-span-1 space-y-0.5">
                            <Label className="text-[9px] font-bold text-black">Form:</Label>
                            <Select defaultValue="all">
                                <SelectTrigger className="h-5 text-[10px] bg-white border-gray-400 rounded-none p-1"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="all">All</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div className="lg:col-span-1 flex items-center">
                            <Button className="h-6 text-[10px] bg-[#f0f0f0] text-black border border-gray-400 hover:bg-white px-2 py-0 shadow-sm rounded-none">
                                <Search className="mr-1 h-3 w-3 text-primary" /> Retrieve
                            </Button>
                        </div>
                    </div>

                    {/* Main Workspace Workspace */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Table Area */}
                        <div className="flex-1 overflow-auto border-r border-gray-300">
                            <Table className="text-[10px] border-collapse">
                                <TableHeader className="bg-[#d4d0c8] sticky top-0 z-10">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-gray-400">
                                            {headerGroup.headers.map((header) => (
                                                <TableHead key={header.id} className="h-6 whitespace-nowrap font-bold text-black uppercase text-[9px] border-r border-gray-400 last:border-r-0 px-2">
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
                                                className={idx % 2 === 1 ? "bg-[#eef6ff] h-7 border-b" : "h-7 border-b"}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id} className="py-0.5 px-2 whitespace-nowrap border-r border-gray-200 last:border-r-0">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={insuranceBillingColumns.length} className="h-24 text-center">No results retrieved.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Right Professional Sidebar */}
                        <div className="w-24 bg-[#f0f0f0] flex flex-col p-1 space-y-2 border-l border-gray-400 overflow-y-auto">
                            <div className="space-y-1">
                                <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center p-1 bg-white border-gray-400 shadow-sm" size="sm">
                                    <Zap className="h-5 w-5 text-success" />
                                    <span className="text-[8px] font-bold uppercase mt-0.5">Pre-Claim</span>
                                </Button>
                            </div>

                            <div className="space-y-1">
                                <p className="text-[8px] font-bold text-blue-800 uppercase text-center border-b border-gray-300">EMC:</p>
                                <div className="grid grid-cols-1 gap-1">
                                    <Button variant="ghost" className="w-full h-12 flex flex-col items-center justify-center p-1" size="sm">
                                        <Settings2 className="h-5 w-5 text-gray-500" />
                                        <span className="text-[8px] font-bold">Generate</span>
                                    </Button>
                                    <Button variant="ghost" className="w-full h-12 flex flex-col items-center justify-center p-1" size="sm">
                                        <Send className="h-5 w-5 text-green-600" />
                                        <span className="text-[8px] font-bold leading-tight">Send / Rece.</span>
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-[8px] font-bold text-blue-800 uppercase text-center border-b border-gray-300">Paper:</p>
                                <div className="grid grid-cols-2 gap-1">
                                    <Button variant="ghost" className="h-10 flex flex-col items-center justify-center p-0.5" size="sm">
                                        <Printer className="h-4 w-4" />
                                        <span className="text-[7px] font-bold">1500</span>
                                    </Button>
                                    <Button variant="ghost" className="h-10 flex flex-col items-center justify-center p-0.5" size="sm">
                                        <LayoutGrid className="h-4 w-4" />
                                        <span className="text-[7px] font-bold">CHDP</span>
                                    </Button>
                                    <Button variant="ghost" className="h-10 flex flex-col items-center justify-center p-0.5" size="sm">
                                        <FileCheck className="h-4 w-4" />
                                        <span className="text-[7px] font-bold">WC</span>
                                    </Button>
                                    <Button variant="ghost" className="h-10 flex flex-col items-center justify-center p-0.5" size="sm">
                                        <Database className="h-4 w-4" />
                                        <span className="text-[7px] font-bold">UB04</span>
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-1 pt-1 border-t border-gray-300">
                                <Button variant="ghost" className="w-full h-10 flex flex-col items-center justify-center p-1" size="sm">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    <span className="text-[8px] font-bold">Show Claim</span>
                                </Button>
                                <Button variant="ghost" className="w-full h-10 flex flex-col items-center justify-center p-1" size="sm">
                                    <RefreshCw className="h-4 w-4 text-green-600" />
                                    <span className="text-[8px] font-bold">Rebill</span>
                                </Button>
                                <Button variant="ghost" className="w-full h-10 flex flex-col items-center justify-center p-1" size="sm">
                                    <History className="h-4 w-4 text-primary" />
                                    <span className="text-[8px] font-bold">History</span>
                                </Button>
                            </div>

                            <div className="mt-auto space-y-1">
                                <Button variant="ghost" className="w-full h-10 flex flex-col items-center justify-center p-1" size="sm">
                                    <PauseCircle className="h-4 w-4 text-red-600" />
                                    <span className="text-[8px] font-bold uppercase">Hold</span>
                                </Button>
                                <div className="grid grid-cols-2 gap-1">
                                    <Button variant="ghost" className="h-8 flex flex-col items-center p-0.5" size="sm" onClick={() => table.toggleAllPageRowsSelected(true)}>
                                        <CheckSquare className="h-3 w-3" />
                                        <span className="text-[7px] font-bold">All</span>
                                    </Button>
                                    <Button variant="ghost" className="h-8 flex flex-col items-center p-0.5" size="sm" onClick={() => table.toggleAllPageRowsSelected(false)}>
                                        <Square className="h-3 w-3" />
                                        <span className="text-[7px] font-bold">None</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Professional Status Bar */}
                    <div className="bg-[#1e3a5f] text-white p-1 px-4 flex items-center justify-between text-[10px] font-normal shadow-inner">
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1"><ShieldAlert className="h-3 w-3 text-[#f9c152]" /> Overdue Claim Filing Days.</span>
                            <span className="flex items-center gap-1"><Briefcase className="h-3 w-3 text-[#f9c152]" /> = Worker's Compensation.</span>
                            <span className="flex items-center gap-1"><RefreshCw className="h-3 w-3 text-[#a6caf0]" /> = Scrubbing On</span>
                            <span className="bg-[#0a246a] px-2 rounded-sm border border-gray-500">Transaction on Hold (4)</span>
                        </div>
                        <div className="flex gap-8 items-center">
                            <div className="flex gap-6">
                                <span className="flex items-center gap-2">Total: <span className="font-bold">{table.getCoreRowModel().rows.length}</span></span>
                                <span className="font-bold">{new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(totalAllAmount)}</span>
                            </div>
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
