
'use client'

import React from 'react'
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { columns, PatientForStatement } from './columns'
import { patients } from '@/lib/data'
import { Separator } from '@/components/ui/separator'

// Augment patient data with mock financial details for the statement generation view
const patientsForStatement: PatientForStatement[] = patients.map(p => ({
  id: p.id,
  chartNo: p.id,
  patientName: p.name,
  dob: p.dob,
  address: `${p.address}, ${p.city}, ${p.state} ${p.zip}`,
  phone: p.phone,
  credit: 0.00,
  balance: Math.random() * 500,
  insBalance: Math.random() > 0.7 ? Math.random() * 100 : 0,
  patientOpeningBal: Math.random() * 200,
  insOpeningBal: 0.00,
  email: p.email,
}))

export default function GenerateStatementsPage() {
    const [data, setData] = React.useState(patientsForStatement)

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
                        <div className="space-y-2">
                            <Label>Case Type</Label>
                            <Select><SelectTrigger><SelectValue placeholder="All" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem></SelectContent></Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Patient Type</Label>
                            <Select><SelectTrigger><SelectValue placeholder="All" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem></SelectContent></Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Minimum Balance</Label>
                            <Input type="number" defaultValue="10.00" />
                        </div>
                        <div className="space-y-2">
                            <Label>Aging Range</Label>
                            <div className="flex gap-4 items-center h-10">
                                <div className="flex items-center space-x-2"><Checkbox id="age30" /><Label htmlFor="age30">30</Label></div>
                                <div className="flex items-center space-x-2"><Checkbox id="age60" /><Label htmlFor="age60">60</Label></div>
                                <div className="flex items-center space-x-2"><Checkbox id="age90" /><Label htmlFor="age90">90</Label></div>
                            </div>
                        </div>
                         <div className="flex items-end">
                            <Button className="w-full">Search</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <DataTable 
                columns={columns} 
                data={data} 
                filterColumn="patientName" 
                filterPlaceholder="Filter by patient name..." 
                showFooter={true} 
            />
        </div>
    )
}
