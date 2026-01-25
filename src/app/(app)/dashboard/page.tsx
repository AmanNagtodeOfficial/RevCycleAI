
'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, FileText, Percent, TrendingUp, CheckCircle, XCircle, Activity } from 'lucide-react';
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
import { claims } from '@/lib/data';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const kpiData = [
  { title: 'Net Collections', value: '$1.2M', change: '+12.5%', Icon: DollarSign, changeType: 'positive' },
  { title: 'Clean Claim Rate', value: '96.2%', change: '+1.5%', Icon: CheckCircle, changeType: 'positive' },
  { title: 'Denial Rate', value: '3.4%', change: '-2.1%', Icon: XCircle, changeType: 'negative' },
  { title: 'Days in A/R', value: '28', change: '-3 days', Icon: FileText, changeType: 'positive' },
];

const atRiskClaims = claims.filter(c => c.riskScore && c.riskScore > 60).sort((a,b) => (b.riskScore || 0) - (a.riskScore || 0)).slice(0, 5);

const revenueData = [
    { month: 'Jan', revenue: 100, forecast: 90 },
    { month: 'Feb', revenue: 120, forecast: 110 },
    { month: 'Mar', revenue: 150, forecast: 140 },
    { month: 'Apr', revenue: 130, forecast: 135 },
    { month: 'May', revenue: 180, forecast: 170 },
    { month: 'Jun', revenue: 210, forecast: 200 },
    { month: 'Jul', revenue: 240, forecast: 250 },
]

const recentActivity = [
    { id: 1, user: 'Admin', avatar: 'https://picsum.photos/seed/admin/40/40', action: 'submitted claim', target: 'C20240715001', time: '2h ago' },
    { id: 2, user: 'AI System', avatar: 'https://picsum.photos/seed/ai/40/40', action: 'flagged claim for review', target: 'C20240714002', time: '3h ago' },
    { id: 3, user: 'Admin', avatar: 'https://picsum.photos/seed/admin/40/40', action: 'updated patient info for', target: 'Seraphina Moon', time: '5h ago' },
    { id: 4, user: 'System', avatar: 'https://picsum.photos/seed/sys/40/40', action: 'received payment for claim', target: 'C20240709005', time: '1d ago' },
    { id: 5, user: 'AI System', avatar: 'https://picsum.photos/seed/ai/40/40', action: 'identified scrubbing issue on', target: 'C20240710004', time: '2d ago' },
]

export default function DashboardPage() {
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
                <CardDescription>Latest updates across your organization.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentActivity.map(activity => (
                        <div key={activity.id} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8 border">
                                <AvatarImage src={activity.avatar} />
                                <AvatarFallback>{activity.user.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                                <p className="text-muted-foreground">
                                    <span className="font-medium text-foreground">{activity.user}</span> {activity.action} <Link href="#" className="font-medium text-primary hover:underline">{activity.target}</Link>
                                </p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                        </div>
                    ))}
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
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}
