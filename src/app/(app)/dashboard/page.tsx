'use client'

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, FileText, CheckCircle, XCircle, Loader } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePractice } from '@/context/practice-context';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { Claim, RecentActivity } from '@/lib/data';

export default function DashboardPage() {
  const { selectedPractice } = usePractice();
  const firestore = useFirestore();

  // Real-time Claims
  const claimsQuery = useMemo(() => {
    if (!firestore || !selectedPractice) return null;
    return query(
      collection(firestore, 'claims'),
      where('practiceId', '==', selectedPractice.id)
    );
  }, [firestore, selectedPractice]);
  const { data: claims, isLoading: claimsLoading } = useCollection<Claim>(claimsQuery);

  // Real-time Recent Activity
  const activityQuery = useMemo(() => {
    if (!firestore || !selectedPractice) return null;
    return query(
      collection(firestore, 'recentActivity'),
      where('practiceId', '==', selectedPractice.id),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
  }, [firestore, selectedPractice]);
  const { data: activity, isLoading: activityLoading } = useCollection<RecentActivity>(activityQuery);

  // Derived KPI Data
  const kpiData = useMemo(() => {
    if (!claims) return [];
    
    const totalCollections = claims
      .filter(c => c.status === 'Paid')
      .reduce((sum, c) => sum + c.amount, 0);
    
    const cleanClaims = claims.filter(c => c.riskScore !== undefined && c.riskScore <= 20).length;
    const cleanClaimRate = claims.length > 0 ? (cleanClaims / claims.length) * 100 : 0;
    
    const deniedClaims = claims.filter(c => c.status === 'Denied').length;
    const denialRate = claims.length > 0 ? (deniedClaims / claims.length) * 100 : 0;
    
    // Simplified Days in A/R calculation
    const outstandingClaims = claims.filter(c => c.status !== 'Paid');
    const totalOutstandingAmount = outstandingClaims.reduce((sum, c) => sum + c.amount, 0);
    const totalBilled = claims.reduce((sum, c) => sum + c.amount, 0);
    const avgDailyCharges = totalBilled / 30;
    const daysInAR = avgDailyCharges > 0 ? totalOutstandingAmount / avgDailyCharges : 0;

    return [
      { title: 'Net Collections', value: `$${(totalCollections / 1000).toFixed(1)}K`, change: '+12.5%', Icon: DollarSign, changeType: 'positive' },
      { title: 'Clean Claim Rate', value: `${cleanClaimRate.toFixed(1)}%`, change: '+1.5%', Icon: CheckCircle, changeType: 'positive' },
      { title: 'Denial Rate', value: `${denialRate.toFixed(1)}%`, change: '-2.1%', Icon: XCircle, changeType: 'negative' },
      { title: 'Days in A/R', value: `${daysInAR.toFixed(0)}`, change: '-3 days', Icon: FileText, changeType: 'positive' },
    ];
  }, [claims]);

  // Derived Revenue Analytics (Mocking the monthly split based on real totals for visualization)
  const revenueData = useMemo(() => {
    if (!claims) return [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const totalPaid = claims.filter(c => c.status === 'Paid').reduce((sum, c) => sum + c.amount, 0) / 1000;
    
    // Just a basic distribution for the chart
    return months.map((month, idx) => ({
      month,
      revenue: (totalPaid / months.length) * (idx + 1) * 0.8,
      forecast: (totalPaid / months.length) * (idx + 1)
    }));
  }, [claims]);

  const atRiskClaims = useMemo(() => {
    if (!claims) return [];
    return claims
      .filter(c => c.riskScore !== undefined && c.riskScore > 60)
      .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
      .slice(0, 5);
  }, [claims]);

  if (claimsLoading || activityLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description='Overview of your revenue cycle performance and key metrics.'
        action={
          <Link href="/claims/new" passHref>
            <Button>New Claim</Button>
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className={`text-xs flex items-center ${kpi.changeType === 'positive' ? 'text-success' : 'text-destructive'}`}>
                {kpi.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>Monthly collections (in thousands) and forecast.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2 pt-4">
             <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}k`}/>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "var(--radius)",
                        }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="forecast" stroke="hsl(var(--muted-foreground))" fillOpacity={1} fill="url(#colorForecast)" />
                </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates for {selectedPractice?.name}.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activity?.map(act => (
                        <div key={act.id} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8 border">
                                <AvatarImage src={act.avatar} />
                                <AvatarFallback>{act.user.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                                <p className="text-muted-foreground">
                                    <span className="font-medium text-foreground">{act.user}</span> {act.action} <span className="font-medium text-primary">{act.target}</span>
                                </p>
                                <p className="text-xs text-muted-foreground">{act.time}</p>
                            </div>
                        </div>
                    ))}
                    {(!activity || activity.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">No recent activity found.</p>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
      <Card>
          <CardHeader>
            <CardTitle>Claims at Risk</CardTitle>
            <CardDescription>Top claims with the highest denial risk scores needing review.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {atRiskClaims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">{claim.id}</TableCell>
                    <TableCell>{claim.patient}</TableCell>
                    <TableCell>{claim.provider}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={claim.riskScore! > 90 ? 'destructive' : 'default'} 
                        className={claim.riskScore! > 75 && claim.riskScore! <=90 ? 'bg-accent text-accent-foreground hover:bg-accent/80' : '' }>
                        {claim.riskScore! > 90 ? 'High' : claim.riskScore! > 75 ? 'Medium' : 'Low'} ({claim.riskScore}%)
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="outline" size="sm" asChild>
                         <Link href={`/claims/${claim.id}`}>Review</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                 {atRiskClaims.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">No at-risk claims for this practice.</TableCell>
                    </TableRow>
                 )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}
