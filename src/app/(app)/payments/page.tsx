
'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { DollarSign, Search, Calendar, RefreshCw, MessageSquare, Save, X, ChevronRight, ChevronDown, ChevronsRight } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


type EncounterLine = {
    id: number;
    case: string;
    procCode: string;
    rCode?: string;
    dosFrom: string;
    dosTo: string;
    claimNum: string;
    charge: number;
    rem: number;
    coPayAmt: number;
    adj: number;
    reason: string;
    withHold: number;
    balance: number;
    nextAction: string;
    lineSubStatus: string;
    acctDate: string;
};

const initialEncounterLines: EncounterLine[] = [
    { id: 1, case: '765565887-4797', procCode: '12123', dosFrom: '09/23/2015', dosTo: '09/23/2015', claimNum: 'BI-19435', charge: 50.00, rem: -9.00, coPayAmt: 0.00, adj: 0.00, reason: 'ADJ SFS', withHold: 0.00, balance: -9.00, nextAction: 'ACCEPT_INSURANCE', lineSubStatus: 'INS. OVER PAYMEN', acctDate: '06/06/2024' },
    { id: 2, case: '765565887-4797', procCode: '99401', dosFrom: '08/08/2014', dosTo: '08/08/2014', claimNum: '156-13924', charge: 40.00, rem: 20.00, coPayAmt: 0.00, adj: 0.00, reason: 'ADJ SFS', withHold: 0.00, balance: 20.00, nextAction: '--Select--', lineSubStatus: '--Select--', acctDate: '06/06/2024' },
    { id: 3, case: '765565887-4797', procCode: '97120', dosFrom: '11/20/2015', dosTo: '11/20/2015', claimNum: 'AW-19630', charge: 125.00, rem: -25.00, coPayAmt: 0.00, adj: 0.00, reason: 'ADJ SFS', withHold: 0.00, balance: -25.00, nextAction: '--Select--', lineSubStatus: 'INS. OVER PAYMEN', acctDate: '06/06/2024' },
    { id: 4, case: '765565887-4797', procCode: '88330', dosFrom: '11/29/2015', dosTo: '11/29/2015', claimNum: 'tes-14800', charge: 150.00, rem: 142.00, coPayAmt: 0.00, adj: 0.00, reason: 'ADJ SFS', withHold: 0.00, balance: 142.00, nextAction: '--Select--', lineSubStatus: '--Select--', acctDate: '06/06/2024' },
    { id: 5, case: '765565887-4842', procCode: '97110', rCode: '0603', dosFrom: '12/05/2015', dosTo: '12/05/2015', claimNum: 'AP-19810', charge: 100.00, rem: 100.00, coPayAmt: 0.00, adj: 0.00, reason: 'ADJ SFS', withHold: 0.00, balance: 100.00, nextAction: '--Select--', lineSubStatus: '--Select--', acctDate: '06/06/2024' },
];


// Main Page Component
export default function PaymentsPage() {
    const [paymentOption, setPaymentOption] = useState('search');
    const [encounterLines, setEncounterLines] = useState(initialEncounterLines);

    const handleLineChange = (id: number, field: keyof EncounterLine, value: any) => {
        setEncounterLines(lines => lines.map(line => line.id === id ? { ...line, [field]: value } : line));
    };

    const groupedLines = useMemo(() => {
        return encounterLines.reduce((acc, line) => {
            (acc[line.case] = acc[line.case] || []).push(line);
            return acc;
        }, {} as Record<string, EncounterLine[]>);
    }, [encounterLines]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US").format(amount);
    }

    const totals = useMemo(() => {
        return encounterLines.reduce((acc, line) => {
            acc.charge += line.charge;
            acc.rem += line.rem;
            acc.coPayAmt += line.coPayAmt;
            acc.adj += line.adj;
            acc.withHold += line.withHold;
            acc.balance += line.balance;
            return acc;
        }, { charge: 0, rem: 0, coPayAmt: 0, adj: 0, withHold: 0, balance: 0 });
    }, [encounterLines]);

    return (
        <div className="space-y-4">
             <PageHeader 
                title="Payment Posting" 
                description="Post new payments or search existing ones." 
            />
            <div className="bg-card border rounded-lg p-4 space-y-4 text-sm">
                {/* Top bar */}
                <div className="flex flex-wrap items-center gap-4 border-b pb-3">
                    <Label>Payment:</Label>
                    <RadioGroup defaultValue="search" className="flex items-center gap-4" value={paymentOption} onValueChange={setPaymentOption}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="new" id="new" />
                            <Label htmlFor="new">New</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="search" id="search" />
                            <Label htmlFor="search">Search</Label>
                        </div>
                    </RadioGroup>
                    <div className="flex items-center gap-2">
                        <Label>Patient</Label>
                        <Input defaultValue="sam" className="w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Label>Pmt. Date From:</Label>
                        <Input type="date" className="w-40" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Label>To:</Label>
                        <Input type="date" className="w-40" />
                    </div>
                    <Button variant="outline" size="sm">Search</Button>
                    <Button variant="outline" size="sm">Close</Button>
                </div>

                {/* Payment Header */}
                <div className="flex flex-wrap gap-4 border-b pb-3">
                    <div className="flex-grow space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="flex items-center gap-2"><Label className="w-24">Legal Entity</Label><Select defaultValue="pediatrics"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="pediatrics">Pediatrics</SelectItem></SelectContent></Select></div>
                            <div className="flex items-center gap-2"><Label className="w-20">Provider</Label><Select defaultValue="acme"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="acme">ACME Provider, ACME [Pediatrics]</SelectItem></SelectContent></Select></div>
                            <div className="flex items-center gap-2"><Label className="w-16">Status</Label><Select defaultValue="new"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="new">NEW</SelectItem></SelectContent></Select></div>
                             <div className="flex items-center gap-2"><Label className="w-16">PSTS#</Label><Input/></div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="flex items-center gap-2"><Label className="w-24">Acct. Date</Label><Input type="date" defaultValue="2024-06-06"/></div>
                            <div className="flex items-center gap-2"><Label className="w-20">Entry Date</Label><Input type="date" defaultValue="2024-06-06"/></div>
                            <div className="flex items-center gap-2"><Label className="w-16">Pmt. Date</Label><Input type="date" defaultValue="2024-06-06"/></div>
                            <div className="flex items-center gap-2"><Label className="w-20">Collected by</Label><Select defaultValue="front-office"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="front-office">FRONT OFFICE</SelectItem></SelectContent></Select></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="flex items-center gap-2"><Label className="w-24">Pmt. Type</Label><Select defaultValue="copay"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="copay">COPAY</SelectItem></SelectContent></Select></div>
                            <div className="flex items-center gap-2"><Label className="w-20">Payor</Label><Select defaultValue="patient"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="patient">PATIENT</SelectItem></SelectContent></Select></div>
                            <div className="flex items-center gap-2"><Label className="w-16">Code:</Label><Input value="sam, freddy" readOnly/></div>
                            <div className="flex items-center gap-2"><Label className="w-20">Payer ID</Label><Input/></div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="flex items-center gap-2"><Label className="w-24">Method</Label><Select defaultValue="cash"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="cash">CASH</SelectItem></SelectContent></Select></div>
                            <div className="flex items-center gap-2"><Label className="w-20">Default Adj. Code</Label><Input defaultValue="ADJ SFS"/><Button size="icon" variant="outline"><ChevronsRight/></Button></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Card className="bg-muted p-2 w-full md:w-60">
                             <div className="grid grid-cols-2 items-center">
                                 <Label>Payment#</Label>
                                 <Input className="text-right bg-white" value="6-15950" readOnly/>
                                 <Label>Total Amt.:</Label>
                                 <Input className="text-right" defaultValue="10.00"/>
                                 <Label>Applied Amt.:</Label>
                                 <Input className="text-right" value="0.00" readOnly/>
                                 <Label>On Account Amt.:</Label>
                                 <Input className="text-right" value="10.00" readOnly/>
                             </div>
                        </Card>
                    </div>
                </div>

                {/* Search Encounter Lines */}
                <Card className="p-3 bg-muted/50">
                    <div className="flex flex-wrap items-center gap-4">
                        <Label>Search Encounter Lines</Label>
                        <div className="flex items-center gap-2">
                            <Label>Patient:</Label>
                            <Input className="bg-white" value="sam, freddy Account($3667.68)" readOnly />
                        </div>
                        <div className="flex items-center gap-2">
                            <Label>Claim #:</Label>
                            <Input className="w-24" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Label>DOS From:</Label>
                            <Input type="date" className="w-32" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Label>To:</Label>
                            <Input type="date" className="w-32" />
                        </div>
                         <div className="flex items-center gap-2">
                            <Checkbox id="show-closed"/>
                            <Label htmlFor="show-closed">Show Closed Lines</Label>
                        </div>
                         <div className="flex items-center gap-2">
                            <Checkbox id="show-all"/>
                            <Label htmlFor="show-all">Show All Lines</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="auto-populate"/>
                            <Label htmlFor="auto-populate">Auto Populate Paid Amount</Label>
                        </div>
                        <Button size="sm">Search</Button>
                    </div>
                </Card>

                {/* Encounter Lines Table */}
                <div className="overflow-x-auto border rounded-md">
                     <Table className="text-xs whitespace-nowrap">
                        <TableHeader>
                            <TableRow className="bg-muted">
                                <TableHead className="p-1">#</TableHead>
                                <TableHead className="p-1">Proc. Code</TableHead>
                                <TableHead className="p-1">R.Code</TableHead>
                                <TableHead className="p-1">DOS From</TableHead>
                                <TableHead className="p-1">DOS To</TableHead>
                                <TableHead className="p-1">Claim#</TableHead>
                                <TableHead className="p-1 text-right">Charge</TableHead>
                                <TableHead className="p-1 text-right">Rem.</TableHead>
                                <TableHead className="p-1 text-right">Co-Pay Amt.</TableHead>
                                <TableHead className="p-1 text-right">Adj.</TableHead>
                                <TableHead className="p-1">Reason</TableHead>
                                <TableHead className="p-1 text-right">With Hold</TableHead>
                                <TableHead className="p-1 text-right">Balance</TableHead>
                                <TableHead className="p-1">Next Action?</TableHead>
                                <TableHead className="p-1">Line Sub Status</TableHead>
                                <TableHead className="p-1">Acct.Date</TableHead>
                                <TableHead className="p-1">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(groupedLines).map(([caseNum, lines]) => (
                                <React.Fragment key={caseNum}>
                                    <TableRow className="bg-muted/50 font-bold">
                                        <TableCell className="p-1" colSpan={17}>Case #: {caseNum}</TableCell>
                                    </TableRow>
                                    {lines.map((line, index) => (
                                        <TableRow key={line.id}>
                                            <TableCell className="p-1">{index + 1}</TableCell>
                                            <TableCell className="p-1">{line.procCode}</TableCell>
                                            <TableCell className="p-1">{line.rCode}</TableCell>
                                            <TableCell className="p-1">{line.dosFrom}</TableCell>
                                            <TableCell className="p-1">{line.dosTo}</TableCell>
                                            <TableCell className="p-1">{line.claimNum}</TableCell>
                                            <TableCell className="p-1 text-right">{formatCurrency(line.charge)}</TableCell>
                                            <TableCell className="p-1 text-right">{formatCurrency(line.rem)}</TableCell>
                                            <TableCell className="p-0"><Input type="number" value={line.coPayAmt} onChange={e => handleLineChange(line.id, 'coPayAmt', e.target.value)} className="h-6 text-right"/></TableCell>
                                            <TableCell className="p-1 text-right">{formatCurrency(line.adj)}</TableCell>
                                            <TableCell className="p-1">{line.reason}</TableCell>
                                            <TableCell className="p-1 text-right">{formatCurrency(line.withHold)}</TableCell>
                                            <TableCell className="p-1 text-right">{formatCurrency(line.balance)}</TableCell>
                                            <TableCell className="p-0"><Select value={line.nextAction} onValueChange={v => handleLineChange(line.id, 'nextAction', v)}><SelectTrigger className="h-6 text-xs w-32"/><SelectContent><SelectItem value="--Select--">--Select--</SelectItem><SelectItem value="ACCEPT_INSURANCE">ACCEPT_INSURANCE</SelectItem></SelectContent></Select></TableCell>
                                            <TableCell className="p-0"><Select value={line.lineSubStatus} onValueChange={v => handleLineChange(line.id, 'lineSubStatus', v)}><SelectTrigger className="h-6 text-xs w-32"/><SelectContent><SelectItem value="--Select--">--Select--</SelectItem><SelectItem value="INS. OVER PAYMEN">INS. OVER PAYMEN</SelectItem></SelectContent></Select></TableCell>
                                            <TableCell className="p-1">{line.acctDate} <Button variant="ghost" size="icon" className="h-5 w-5"><Calendar className="h-4 w-4"/></Button></TableCell>
                                            <TableCell className="p-1">
                                                <div className="flex">
                                                    <Button variant="ghost" size="icon" className="h-5 w-5"><RefreshCw className="h-3 w-3"/></Button>
                                                    <Button variant="ghost" size="icon" className="h-5 w-5"><MessageSquare className="h-3 w-3"/></Button>
                                                    <Button variant="ghost" size="icon" className="h-5 w-5"><Save className="h-3 w-3"/></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                             <TableRow className="bg-muted font-bold">
                                <TableCell className="p-1 text-right" colSpan={6}>Total:</TableCell>
                                <TableCell className="p-1 text-right">{formatCurrency(totals.charge)}</TableCell>
                                <TableCell className="p-1 text-right">{formatCurrency(totals.rem)}</TableCell>
                                <TableCell className="p-1 text-right">{formatCurrency(totals.coPayAmt)}</TableCell>
                                <TableCell className="p-1 text-right">{formatCurrency(totals.adj)}</TableCell>
                                <TableCell className="p-1" colSpan={1}></TableCell>
                                <TableCell className="p-1 text-right">{formatCurrency(totals.withHold)}</TableCell>
                                <TableCell className="p-1 text-right">{formatCurrency(totals.balance)}</TableCell>
                                <TableCell className="p-1" colSpan={4}></TableCell>
                            </TableRow>
                        </TableBody>
                     </Table>
                </div>

                {/* Footer */}
                <div className="flex flex-wrap gap-4 pt-3 border-t">
                    <div className="flex-grow space-y-2">
                        <Tabs defaultValue="payer-remark" className="w-full">
                            <TabsList>
                                <TabsTrigger value="payer-remark">Payer Remark</TabsTrigger>
                                <TabsTrigger value="line-activity">Line Activity</TabsTrigger>
                            </TabsList>
                            <TabsContent value="payer-remark" className="pt-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label>Category Code:</Label>
                                        <Input/>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>EOB Page#</Label>
                                        <Input/>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Remark:</Label>
                                        <Input/>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Remark To Pat. Stmt.:</Label>
                                        <Input/>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                     <div className="flex items-end gap-2">
                        <Button>Post</Button>
                        <Button variant="outline">Reset</Button>
                        <Button variant="destructive">Cancel</Button>
                    </div>
                </div>

            </div>
        </div>
    )
}
