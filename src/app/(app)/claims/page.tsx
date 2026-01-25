
'use client';

import React, { useState, useMemo } from 'react';
import { claims, Claim } from "@/lib/data"
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
import { DollarSign, FileText, AlertTriangle, CheckCircle, Loader, FileWarning, Wrench } from "lucide-react"
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


type PayerARSummary = {
    payerName: string;
    age_0_30: number;
    age_31_60: number;
    age_61_90: number;
    age_over_90: number;
    balance: number;
};

function renderClaimSubComponent({ row }: { row: Row<Claim> }) {
  const claim = row.original;

  return (
      <div className="p-4 bg-muted/50 text-sm space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Service Details</h4>
            <p><span className="text-muted-foreground w-28 inline-block">Procedure:</span> {claim.procedure}</p>
            <p><span className="text-muted-foreground w-28 inline-block">Diagnosis:</span> {claim.diagnosis}</p>
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
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Denial Reason: {claim.denialReason}</AlertTitle>
              </Alert>
          )}
      </div>
  )
}

function ARSummaryByInsurance({ data, onPayerSelect, selectedPayer }: { data: Claim[]; onPayerSelect: (payer: string) => void; selectedPayer: string | null; }) {
    const arSummaryData: PayerARSummary[] = useMemo(() => {
        const daysSince = (dateString: string): number => {
            const date = new Date(dateString);
            const today = new Date();
            const differenceInTime = today.getTime() - date.getTime();
            return Math.floor(differenceInTime / (1000 * 3600 * 24));
        };
        
        const outstandingClaims = data.filter(c => c.status !== 'Paid');
        
        const arDataByPayer = outstandingClaims.reduce((acc, claim) => {
            const payerData: PayerARSummary = acc[claim.payer] || {
                payerName: claim.payer,
                age_0_30: 0,
                age_31_60: 0,
                age_61_90: 0,
                age_over_90: 0,
                balance: 0,
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
            
            acc[claim.payer] = payerData;
            return acc;
        }, {} as Record<string, PayerARSummary>);

        return Object.values(arDataByPayer).sort((a,b) => b.balance - a.balance);
    }, [data]);

    const totals = useMemo(() => {
        return arSummaryData.reduce((acc, row) => {
            acc.age_0_30 += row.age_0_30;
            acc.age_31_60 += row.age_31_60;
            acc.age_61_90 += row.age_61_90;
            acc.age_over_90 += row.age_over_90;
            acc.balance += row.balance;
            return acc;
        }, { age_0_30: 0, age_31_60: 0, age_61_90: 0, age_over_90: 0, balance: 0 });
    }, [arSummaryData]);
    
    const formatCurrency = (amount: number) => {
      if (amount === 0) return '$0.00';
      return '$' + new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>A/R Activities</CardTitle>
                <CardDescription>Main Summary by Insurance. Click a row to filter claims below.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px] pl-4">Insurance</TableHead>
                                <TableHead className="text-right">0-30</TableHead>
                                <TableHead className="text-right">31-60</TableHead>
                                <TableHead className="text-right">61-90</TableHead>
                                <TableHead className="text-right">&gt; 90</TableHead>
                                <TableHead className="text-right pr-4">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {arSummaryData.length > 0 ? arSummaryData.map((row) => (
                                <TableRow 
                                    key={row.payerName}
                                    onClick={() => onPayerSelect(row.payerName)}
                                    className={cn(
                                        "cursor-pointer",
                                        selectedPayer === row.payerName && "bg-accent/50 hover:bg-accent/60"
                                    )}
                                >
                                    <TableCell className="font-medium pl-4">{row.payerName}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(row.age_0_30)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(row.age_31_60)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(row.age_61_90)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(row.age_over_90)}</TableCell>
                                    <TableCell className="text-right font-bold pr-4">{formatCurrency(row.balance)}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No A/R data for this view.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        {arSummaryData.length > 0 && (
                            <TableFooter>
                                <TableRow>
                                    <TableHead className="pl-4">Total</TableHead>
                                    <TableHead className="text-right">{formatCurrency(totals.age_0_30)}</TableHead>
                                    <TableHead className="text-right">{formatCurrency(totals.age_31_60)}</TableHead>
                                    <TableHead className="text-right">{formatCurrency(totals.age_61_90)}</TableHead>
                                    <TableHead className="text-right">{formatCurrency(totals.age_over_90)}</TableHead>
                                    <TableHead className="text-right font-bold pr-4">{formatCurrency(totals.balance)}</TableHead>
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
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPayer, setSelectedPayer] = useState<string | null>(null);

  const handlePayerSelect = (payerName: string) => {
    setSelectedPayer(current => current === payerName ? null : payerName);
  };

  const claimsForTab = useMemo(() => {
    switch(activeTab) {
        case 'attention':
            return claims.filter(c => c.status === 'Denied' || c.status === 'Scrubbing');
        case 'in-process':
            return claims.filter(c => c.status === 'Pending' || c.status === 'Submitted');
        case 'paid':
            return claims.filter(c => c.status === 'Paid');
        case 'all':
        default:
            return claims;
    }
  }, [activeTab]);

  const filteredClaims = useMemo(() => {
    if (!selectedPayer) return claimsForTab;
    return claimsForTab.filter(c => c.payer === selectedPayer);
  }, [claimsForTab, selectedPayer]);
  
  const stats = {
      total: claims.length,
      paid: claims.filter(c => c.status === 'Paid').length,
      pending: claims.filter(c => c.status === 'Pending' || c.status === 'Submitted' || c.status === 'Scrubbing').length,
      denied: claims.filter(c => c.status === 'Denied').length
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Claims"
        description="Track, manage, and resolve all your medical claims."
        action={
            <Link href="/claims/new" passHref>
                <Button>New Claim</Button>
            </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid</CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.paid}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Process</CardTitle>
                <Loader className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
        </Card>
        <Card>
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
            <TabsList>
                <TabsTrigger value="all">All Claims</TabsTrigger>
                <TabsTrigger value="attention">Attention Needed</TabsTrigger>
                <TabsTrigger value="in-process">In Process</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-4 space-y-6">
                <ARSummaryByInsurance 
                    data={claimsForTab}
                    selectedPayer={selectedPayer}
                    onPayerSelect={handlePayerSelect}
                />
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {selectedPayer ? `Claims for ${selectedPayer}` : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Claims`}
                    </h2>
                    {selectedPayer && (
                        <Button variant="outline" onClick={() => setSelectedPayer(null)}>Show All Payers</Button>
                    )}
                </div>
                <DataTable 
                    columns={columns} 
                    data={filteredClaims} 
                    filterColumn="patient" 
                    filterPlaceholder="Filter by patient name..."
                    renderSubComponent={renderClaimSubComponent}
                />
            </TabsContent>
        </Tabs>
    </div>
  )
}
