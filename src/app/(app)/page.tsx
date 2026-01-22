import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, FileText, Percent, TrendingUp, TrendingDown } from 'lucide-react';
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

const kpiData = [
  { title: 'Net Collections', value: '$1.2M', change: '+12.5%', icon: DollarSign, changeType: 'positive' },
  { title: 'Denial Rate', value: '3.4%', change: '-2.1%', icon: Percent, changeType: 'positive' },
  { title: 'Days in A/R', value: '28', change: '-3 days', icon: FileText, changeType: 'positive' },
];

const atRiskClaims = claims.filter(c => c.riskScore && c.riskScore > 60).sort((a,b) => (b.riskScore || 0) - (a.riskScore || 0)).slice(0, 5);

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        action={
          <Link href="/claims/new" passHref>
            <Button>New Claim</Button>
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {kpi.changeType === 'positive' ? <TrendingUp className="text-success h-4 w-4 mr-1" /> : <TrendingDown className="text-destructive h-4 w-4 mr-1" />}
                <span className={kpi.changeType === 'positive' ? 'text-success' : 'text-destructive'}>{kpi.change}</span>
                &nbsp;from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Claims at Risk</CardTitle>
            <CardDescription>Top 5 claims with the highest denial risk.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {atRiskClaims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">{claim.id}</TableCell>
                    <TableCell>{claim.patient}</TableCell>
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
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>Monthly collections and forecast.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground bg-card rounded-md border border-dashed">
              <p>Analytics Chart Coming Soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
