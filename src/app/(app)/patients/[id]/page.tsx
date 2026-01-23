
'use client';

import { PageHeader } from "@/components/page-header";
import { patients, claims, statements } from "@/lib/data";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { DataTable } from "@/components/data-table";
import { columns as claimColumns } from "@/app/(app)/claims/columns";
import { columns as statementColumns } from "@/app/(app)/billing/columns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Cake, VenetianMask, Phone, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = patients.find(p => p.id === params.id);

  if (!patient) {
    notFound();
  }

  const patientClaims = claims.filter(c => c.patientId === patient.id);
  const patientStatements = statements.filter(s => s.patientId === patient.id);

  const totalBilled = patientClaims.reduce((acc, claim) => acc + claim.amount, 0);
  const outstandingBalance = patientStatements.filter(s => s.status === 'Sent' || s.status === 'Overdue').reduce((acc, s) => acc + s.amountDue, 0);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`;
    }
    return name.substring(0, 2);
  }


  return (
    <div className="space-y-6">
      <PageHeader 
        title={patient.name} 
        description={`Demographics and financial history for patient ID ${patient.id}.`}
        action={
            <div className="flex gap-2">
                <Button variant="outline">Edit Patient</Button>
                <Button asChild><Link href="/claims/new">New Claim</Link></Button>
            </div>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-16 w-16 border">
                        <AvatarImage src={`https://picsum.photos/seed/${patient.id}/100/100`} data-ai-hint="profile picture" />
                        <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                    </Avatar>
                     <div>
                        <CardTitle className="text-2xl">{patient.name}</CardTitle>
                        <CardDescription>
                            <Badge variant={patient.status === 'Active' ? 'default' : 'secondary'} className={patient.status === 'Active' ? 'bg-success text-success-foreground' : ''}>
                                {patient.status}
                            </Badge>
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                        <Cake className="w-4 h-4 text-muted-foreground" />
                        <span>Born on {patient.dob}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <VenetianMask className="w-4 h-4 text-muted-foreground" />
                        <span>{patient.gender}</span>
                    </div>
                     <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        <span>{patient.insuranceProvider} ({patient.insuranceId})</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>(555) 123-4567</span>
                    </div>
                     <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{patient.name.toLowerCase().replace(' ', '.')}@example.com</span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Billed</span>
                        <span className="font-bold text-lg">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalBilled)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Outstanding Balance</span>
                        <span className="font-bold text-lg text-destructive">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(outstandingBalance)}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Last Visit</span>
                        <span className="font-medium">{patient.lastVisit}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Tabs defaultValue="claims" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="claims">Claims History</TabsTrigger>
                    <TabsTrigger value="billing">Billing & Statements</TabsTrigger>
                </TabsList>
                <TabsContent value="claims" className="mt-4">
                    <DataTable columns={claimColumns} data={patientClaims} filterColumn="status" filterPlaceholder="Filter by status..." />
                </TabsContent>
                <TabsContent value="billing" className="mt-4">
                     <DataTable columns={statementColumns} data={patientStatements} filterColumn="status" filterPlaceholder="Filter by status..." />
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  )
}
