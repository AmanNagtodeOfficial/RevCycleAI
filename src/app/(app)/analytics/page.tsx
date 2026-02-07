
'use client'

import React from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { usePractice } from '@/context/practice-context';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Claim } from '@/lib/data';
import { Loader } from 'lucide-react';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function AnalyticsPage() {
    const { selectedPractice } = usePractice();
    const firestore = useFirestore();

    const claimsQuery = React.useMemo(() => {
        if (!firestore || !selectedPractice) return null;
        return query(collection(firestore, 'claims'), where('practiceId', '==', selectedPractice.id));
    }, [firestore, selectedPractice]);

    const { data: practiceClaims, isLoading } = useCollection<Claim>(claimsQuery);
    
    // Aggregate data for charts
    const claimStatusChartData = React.useMemo(() => {
        if (!practiceClaims) return [];
        const data = practiceClaims.reduce((acc, claim) => {
            acc[claim.status] = (acc[claim.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(data).map(([name, value]) => ({ name, value }));
    }, [practiceClaims]);


    const denialChartData = React.useMemo(() => {
        if (!practiceClaims) return [];
        const data = practiceClaims.filter(c => c.status === 'Denied' && c.denialReason).reduce((acc, claim) => {
            acc[claim.denialReason!] = (acc[claim.denialReason!] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(data).map(([name, value]) => ({ name, value }));
    }, [practiceClaims]);

    const payerTableData = React.useMemo(() => {
        if (!practiceClaims) return [];
        const data = practiceClaims.reduce((acc, claim) => {
            if (!acc[claim.payer]) {
                acc[claim.payer] = { name: claim.payer, total: 0, paid: 0, denied: 0, totalAmount: 0 };
            }
            acc[claim.payer].total++;
            acc[claim.payer].totalAmount += claim.amount;
            if (claim.status === 'Paid') acc[claim.payer].paid++;
            if (claim.status === 'Denied') acc[claim.payer].denied++;
            return acc;
        }, {} as Record<string, any>);
        return Object.values(data).map(p => ({
            ...p,
            paidRate: p.total > 0 ? (p.paid / p.total * 100).toFixed(1) + '%' : '0.0%',
            denialRate: p.total > 0 ? (p.denied / p.total * 100).toFixed(1) + '%' : '0.0%',
        }));
    }, [practiceClaims]);

    if (isLoading) {
        return <div className="flex h-[80vh] items-center justify-center"><Loader className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader title="Analytics Dashboard" description={`Insights for ${selectedPractice?.name || 'Medical Practice'}.`} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Claim Status Distribution</CardTitle>
                        <CardDescription>A snapshot of all claims by their current status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={claimStatusChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {claimStatusChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Top Denial Reasons</CardTitle>
                         <CardDescription>Understanding why claims are being denied.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={denialChartData} layout="vertical" margin={{ left: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                                <Bar dataKey="value" fill="hsl(var(--chart-4))" barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Payer Performance Analysis</CardTitle>
                    <CardDescription>Comparison of key metrics across different payers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b">
                                <tr className="text-left text-muted-foreground">
                                    <th className="p-2">Payer</th>
                                    <th className="p-2">Total Claims</th>
                                    <th className="p-2">Total Billed</th>
                                    <th className="p-2">Paid Rate</th>
                                    <th className="p-2">Denial Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payerTableData.map(payer => (
                                    <tr key={payer.name} className="border-b">
                                        <td className="p-2 font-medium">{payer.name}</td>
                                        <td className="p-2">{payer.total}</td>
                                        <td className="p-2">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(payer.totalAmount)}</td>
                                        <td className="p-2"><Badge className="bg-success text-success-foreground">{payer.paidRate}</Badge></td>
                                        <td className="p-2"><Badge variant="destructive">{payer.denialRate}</Badge></td>
                                    </tr>
                                ))}
                                {payerTableData.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-muted-foreground">No data available for this practice.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
