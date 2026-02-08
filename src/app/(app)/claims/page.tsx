
'use client';

import React, { useState, useMemo } from 'react';
import { Claim } from "@/lib/data"
import { PageHeader } from "@/components/page-header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { DollarSign, FileText, AlertTriangle, CheckCircle, Loader, FileWarning, Wrench, AlertCircle, ArrowRight } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
  } from "@/components/ui/table"
import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import { cn } from '@/lib/utils';
import type { Row } from '@tanstack/react-table';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePractice } from '@/context/practice-context';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, Timestamp } from 'firebase/firestore';

function renderClaimSubComponent({ row }: { row: Row<Claim> }) {
  const claim = row.original;

  return (
      <div className="p-4 bg-muted/50 text-sm space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Service Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><span className="text-muted-foreground w-28 inline-block">Procedure:</span> {claim.procedure}</div>
                <div><span className="text-muted-foreground w-28 inline-block">Diagnosis:</span> {claim.diagnosis}</div>
                <div><span className="text-muted-foreground w-28 inline-block">Submission:</span> {claim.submissionType} ({claim.formType})</div>
                <div><span className="text-muted-foreground w-28 inline-block">Priority:</span> {claim.priority}</div>
            </div>
          </div>
          {claim.aiSuggestions && claim.aiSuggestions.length > 0 && (
              <div>
                  <h4 className="font-semibold mb-2">AI Suggestions</h4>
                   <div className="space-y-2">
                      {claim.aiSuggestions.map((suggestion, index) => (
                          <div key={index} className="text-xs p-2 border rounded-lg bg-background">
                              <p className="font-semibold mb-1">{suggestion.suggestion}</p>
                              <div className="flex items-center gap-4 text-muted-foreground">
                                  <span className="flex items-center gap-1"><FileWarning className="h-3 w-3" /> {suggestion.category}: {suggestion.field}</span>
                                  <span className="flex items-center gap-1"><Wrench className="h-3 w-3" /> Action: {suggestion.actionType}</span>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}
          {claim.denialReason && (
               <Alert variant="destructive" className="max-w-md">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Denial Reason: {claim.denialReason}</AlertTitle>
              </Alert>
          )}
      </div>
  )
}

function ARSummaryByInsurance({ data, onPayerSelect, selectedPayer }: { data: Claim[]; onPayerSelect: (payer: string) => void; selectedPayer: string | null; }) {
    const arSummaryData = useMemo(() => {
        const daysSince = (val: any): number => {
            const date = val instanceof Timestamp ? val.toDate() : new Date(val);
            if (isNaN(date.getTime())) return 0;
            const today = new Date();
            const differenceInTime = today.getTime() - date.getTime();
            return Math.floor(differenceInTime / (1000 * 3600 * 24));
        };
        
        // Aging only makes sense for unpaid claims
        const outstandingClaims = data.filter(c => c.status !== 'Paid');
        
        const arDataByPayer = outstandingClaims.reduce((acc, claim) => {
            const payerName = claim.payer || 'Unknown Payer';
            const payerData = acc[payerName] || {
                payerName: payerName,
                age_0_30: 0,
                age_31_60: 0,
                age_61_90: 0,
                age_over_90: 0,
                balance: 0,
                count: 0
            };

            const age = daysSince(claim.date);

            if (age <= 30) {
                payerData.age_0_30 += claim.amount;
            } else if (age <= 60) {
                payerData.age_31_60 += claim.amount;
            } else if (age <= 90) {
                payerData.age_61_90 += claim.amount;
            } else {
                payerData.age_over_90 += claim.amount;
            }

            payerData.balance += claim.amount;
            payerData.count += 1;
            
            acc[payerName] = payerData;
            return acc;
        }, {} as Record<string, any>);

        return Object.values(arDataByPayer).sort((a: any, b: any) => b.balance - a.balance);
    }, [data]);

    const totals = useMemo(() => {
        return arSummaryData.reduce((acc, row: any) => {
            acc.age_0_30 += row.age_0_30;
            acc.age_31_60 += row.age_31_60;
            acc.age_61_90 += row.age_61_90;
            acc.age_over_90 += row.age_over_90;
            acc.balance += row.balance;
            return acc;
        }, { age_0_30: 0, age_31_60: 0, age_61_90: 0, age_over_90: 0, balance: 0 });
    }, [arSummaryData]);
    
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-US", {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
    };

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Accounts Receivable Summary</CardTitle>
                <CardDescription>Main Summary by Insurance. Click a payer row to filter the claims list below.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead className="w-[200px] pl-4">Insurance Payer</TableHead>
                                <TableHead className="text-right">0-30 Days</TableHead>
                                <TableHead className="text-right">31-60 Days</TableHead>
                                <TableHead className="text-right">61-90 Days</TableHead>
                                <TableHead className="text-right">&gt; 90 Days</TableHead>
                                <TableHead className="text-right pr-4 font-bold">Total Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {arSummaryData.length > 0 ? arSummaryData.map((row: any) => (
                                <TableRow 
                                    key={row.payerName}
                                    onClick={() => onPayerSelect(row.payerName)}
                                    className={cn(
                                        "cursor-pointer transition-colors group",
                                        selectedPayer === row.payerName ? "bg-primary/10 hover:bg-primary/15" : "hover:bg-muted/50"
                                    )}
                                >
                                    <TableCell className="font-medium pl-4 flex items-center gap-2">
                                        {row.payerName}
                                        {selectedPayer === row.payerName && <ArrowRight className="h-3 w-3 text-primary animate-pulse" />}
                                    </TableCell>
                                    <TableCell className="text-right">{formatCurrency(row.age_0_30)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(row.age_31_60)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(row.age_61_90)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(row.age_over_90)}</TableCell>
                                    <TableCell className="text-right font-bold pr-4">{formatCurrency(row.balance)}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                        No outstanding balances found for this view.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        {arSummaryData.length > 0 && (
                            <TableFooter className="bg-muted/20">
                                <TableRow>
                                    <TableCell className="pl-4 font-bold">Grand Total</TableCell>
                                    <TableCell className="text-right font-semibold">{formatCurrency(totals.age_0_30)}</TableCell>
                                    <TableCell className="text-right font-semibold">{formatCurrency(totals.age_31_60)}</TableCell>
                                    <TableCell className="text-right font-semibold">{formatCurrency(totals.age_61_90)}</TableCell>
                                    <TableCell className="text-right font-semibold">{formatCurrency(totals.age_over_90)}</TableCell>
                                    <TableCell className="text-right font-bold pr-4 text-primary">{formatCurrency(totals.balance)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        )}
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ClaimsPage() {
  const { selectedPractice } = usePractice();
  const firestore = useFirestore();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPayer, setSelectedPayer] = useState<string | null>(null);

  const claimsQuery = useMemo(() => {
    if (!firestore || !selectedPractice) return null;
    return query(
      collection(firestore, 'claims'),
      where('practiceId', '==', selectedPractice.id)
    );
  }, [firestore, selectedPractice]);

  const { data: practiceClaims, isLoading } = useCollection<Claim>(claimsQuery);

  const handlePayerSelect = (payerName: string) => {
    setSelectedPayer(current => current === payerName ? null : payerName);
    // Optional: smooth scroll to the results header
    const resultsHeader = document.getElementById('claims-results-header');
    if (resultsHeader) {
        resultsHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const claimsForTab = useMemo(() => {
    const data = practiceClaims || [];
    switch(activeTab) {
        case 'attention':
            return data.filter(c => c.status === 'Denied' || c.status === 'Scrubbing');
        case 'in-process':
            return data.filter(c => c.status === 'Pending' || c.status === 'Submitted');
        case 'paid':
            return data.filter(c => c.status === 'Paid');
        case 'all':
        default:
            return data;
    }
  }, [activeTab, practiceClaims]);

  const filteredClaims = useMemo(() => {
    if (!selectedPayer) return claimsForTab;
    return claimsForTab.filter(c => c.payer === selectedPayer);
  }, [claimsForTab, selectedPayer]);
  
  const stats = useMemo(() => {
      const data = practiceClaims || [];
      return {
          total: data.length,
          paid: data.filter(c => c.status === 'Paid').length,
          pending: data.filter(c => c.status === 'Pending' || c.status === 'Submitted' || c.status === 'Scrubbing').length,
          denied: data.filter(c => c.status === 'Denied').length
      }
  }, [practiceClaims]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Claims Workbench"
        description="Track, manage, and resolve all your medical claims in real-time."
        action={
            <Button asChild>
                <Link href="/claims/new">
                    <FileText className="mr-2 h-4 w-4" /> New Claim
                </Link>
            </Button>
        }
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-success/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid</CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.paid}</div>
            </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Process</CardTitle>
                <Loader className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-destructive/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attention Needed</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.denied}</div>
            </CardContent>
        </Card>
      </div>

       <Tabs defaultValue="all" value={activeTab} onValueChange={(tab) => { setActiveTab(tab); setSelectedPayer(null); }} className="w-full">
            <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="all">All Claims</TabsTrigger>
                <TabsTrigger value="attention" className="data-[state=active]:text-destructive">Attention Needed</TabsTrigger>
                <TabsTrigger value="in-process">In Process</TabsTrigger>
                <TabsTrigger value="paid" className="data-[state=active]:text-success">Paid</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6 space-y-8">
                <ARSummaryByInsurance 
                    data={claimsForTab}
                    selectedPayer={selectedPayer}
                    onPayerSelect={handlePayerSelect}
                />
                
                <div className="space-y-4">
                    <div id="claims-results-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight">
                                {selectedPayer ? `Claims for ${selectedPayer}` : `${activeTab === 'all' ? 'Detailed' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Claims List`}
                            </h2>
                            <p className="text-sm text-muted-foreground">Showing {filteredClaims.length} records</p>
                        </div>
                        {selectedPayer && (
                            <Button variant="outline" size="sm" onClick={() => setSelectedPayer(null)}>
                                <XCircle className="mr-2 h-4 w-4" /> Clear Payer Filter
                            </Button>
                        )}
                    </div>
                    
                    <DataTable 
                        columns={columns} 
                        data={filteredClaims} 
                        filterColumn="patient" 
                        filterPlaceholder="Search by patient name..."
                        renderSubComponent={renderClaimSubComponent}
                    />
                </div>
            </TabsContent>
        </Tabs>
    </div>
  )
}

function XCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
        </svg>
    )
}
