
'use client';

import React, { useMemo } from 'react';
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { PageHeader } from "@/components/page-header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Briefcase, Users, UserPlus, CheckCircle, Loader } from "lucide-react"
import { useFirestore, useCollection } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { InsurancePlan } from '@/lib/insurance-data';

export default function InsurancePage() {
  const firestore = useFirestore();

  const plansQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'insurancePlans'));
  }, [firestore]);

  const { data: plans, isLoading } = useCollection<InsurancePlan>(plansQuery);

  const stats = useMemo(() => {
      const data = plans || [];
      return {
          totalPlans: data.length,
          activePlans: data.filter(p => p.status === 'Active').length,
          totalMembers: data.reduce((acc, p) => acc + (p.memberCount || 0), 0),
      }
  }, [plans]);

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
        title="Insurance Plans"
        description="Manage payer contracts, fee schedules, and plan details."
        action={
            <Link href="/insurance/new" passHref>
                <Button><UserPlus className="mr-2 h-4 w-4" /> Add Plan</Button>
            </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.totalPlans}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.activePlans}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members Covered</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{new Intl.NumberFormat().format(stats.totalMembers)}</div>
            </CardContent>
        </Card>
      </div>

      <DataTable 
        columns={columns} 
        data={plans || []} 
        filterColumn="payerName" 
        filterPlaceholder="Filter by payer..."
      />
    </div>
  )
}
