'use client';

import React, { useMemo } from 'react';
import { claims } from "@/lib/data"
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
import { DollarSign, FileText, AlertTriangle, CheckCircle, Loader } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
  } from "@/components/ui/table"

type PayerARSummary = {
    payerName: string;
    age_0_30: number;
    age_31_60: number;
    age_61_90: number;
    age_over_90: number;
    balance: number;
};

function ARSummaryByInsurance() {
    const arSummaryData: PayerARSummary[] = useMemo(() => {
        const daysSince = (dateString: string): number => {
            const date = new Date(dateString);
            const today = new Date();
            const differenceInTime = today.getTime() - date.getTime();
            return Math.floor(differenceInTime / (1000 * 3600 * 24));
        };
        
        const outstandingClaims = claims.filter(c => c.status !== 'Paid');
        
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
    }, []);

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
      if (amount === 0) return '0.00';
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>A/R Activities</CardTitle>
                <CardDescription>Main Summary by Insurance</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px]">Insurance</TableHead>
                            <TableHead className="text-right">0-30</TableHead>
                            <TableHead className="text-right">31-60</TableHead>
                            <TableHead className="text-right">61-90</TableHead>
                            <TableHead className="text-right">&gt; 90</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {arSummaryData.map((row) => (
                            <TableRow key={row.payerName}>
                                <TableCell className="font-medium">{row.payerName}</TableCell>
                                <TableCell className="text-right">{formatCurrency(row.age_0_30)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(row.age_31_60)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(row.age_61_90)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(row.age_over_90)}</TableCell>
                                <TableCell className="text-right font-bold">{formatCurrency(row.balance)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableHead>Total</TableHead>
                            <TableHead className="text-right">{formatCurrency(totals.age_0_30)}</TableHead>
                            <TableHead className="text-right">{formatCurrency(totals.age_31_60)}</TableHead>
                            <TableHead className="text-right">{formatCurrency(totals.age_61_90)}</TableHead>
                            <TableHead className="text-right">{formatCurrency(totals.age_over_90)}</TableHead>
                            <TableHead className="text-right font-bold">{formatCurrency(totals.balance)}</TableHead>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardContent>
        </Card>
    );
}

export default function ClaimsPage() {
  const data = claims;

  const stats = {
      total: data.length,
      paid: data.filter(c => c.status === 'Paid').length,
      pending: data.filter(c => c.status === 'Pending' || c.status === 'Submitted' || c.status === 'Scrubbing').length,
      denied: data.filter(c => c.status === 'Denied').length
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
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Loader className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Denied</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.denied}</div>
            </CardContent>
        </Card>
      </div>
        <ARSummaryByInsurance />
    </div>
  )
}
