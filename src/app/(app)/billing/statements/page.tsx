
'use client'

import React from 'react'
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { columns, PatientForStatement } from './columns'
import { usePractice } from '@/context/practice-context'
import { useFirestore, useCollection } from '@/firebase'
import { collection, query, where } from 'firebase/firestore'
import { Patient } from '@/lib/data'
import { Loader } from 'lucide-react'

export default function GenerateStatementsPage() {
    const { selectedPractice } = usePractice();
    const firestore = useFirestore();

    const patientsQuery = React.useMemo(() => {
        if (!firestore || !selectedPractice) return null;
        return query(collection(firestore, 'patients'), where('practiceId', '==', selectedPractice.id));
    }, [firestore, selectedPractice]);

    const { data: patients, isLoading } = useCollection<Patient>(patientsQuery);

    const patientsForStatement: PatientForStatement[] = React.useMemo(() => {
        if (!patients) return [];
        return patients.map(p => ({
            id: p.id,
            chartNo: p.id,
            patientName: p.name,
            dob: p.dob,
            address: `${p.address}, ${p.city}, ${p.state} ${p.zip}`,
            phone: p.phone,
            credit: 0.00,
            balance: 0, // In a real app, this would be computed from ledger entries
            insBalance: 0,
            patientOpeningBal: 0,
            insOpeningBal: 0.00,
            email: p.email,
        }));
    }, [patients]);

    if (isLoading) {
        return <div className="flex h-[80vh] items-center justify-center"><Loader className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Patient Statement"
                description="Generate and print statements for patients based on selected criteria."
            />

            <Card>
                <CardHeader>
                    <CardTitle>Selection Criteria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 text-sm">
                        <div className="space-y-2">
                            <Label>Selection</Label>
                            <RadioGroup defaultValue="range" className="flex gap-4 pt-2">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="range" id="range" /><Label htmlFor="range">Range</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="single" id="single" /><Label htmlFor="single">Single</Label></div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2">
                            <Label>Last Name</Label>
                            <div className="flex gap-2">
                                <Input placeholder="From" defaultValue="A" />
                                <Input placeholder="To" defaultValue="Z" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Date Range</Label>
                             <div className="flex gap-2 items-center">
                                <Input type="date" defaultValue="2024-07-01" />
                                <span>-</span>
                                <Input type="date" defaultValue="2024-07-31"/>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label>Office</Label>
                            <Select><SelectTrigger><SelectValue placeholder="All" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem></SelectContent></Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Provider</Label>
                            <Select><SelectTrigger><SelectValue placeholder="All" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem></SelectContent></Select>
                        </div>
                         <div className="flex items-end">
                            <Button className="w-full">Search</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <DataTable 
                columns={columns} 
                data={patientsForStatement} 
                filterColumn="patientName" 
                filterPlaceholder="Filter by patient name..." 
                showFooter={true} 
            />
        </div>
    )
}
