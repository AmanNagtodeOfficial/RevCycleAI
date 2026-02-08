'use client';

import React, { useMemo, useState } from "react";
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { CalendarPlus, Loader, List, Calendar as CalendarIcon, MapPin, User as UserIcon, Clock } from "lucide-react"
import Link from "next/link";
import { usePractice } from "@/context/practice-context";
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { Appointment } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

function TimelineView({ appointments }: { appointments: Appointment[] }) {
    const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);
    
    const providers = useMemo(() => {
        const defaults = ['Dr. Evelyn Reed', 'Dr. Ben Carter', 'Dr. Samira Khan', 'Dr. Egon Spengler', 'Dr. Ray Stantz'];
        const uniqueProviders = [...new Set(appointments.map(a => a.provider))];
        return Array.from(new Set([...uniqueProviders, ...defaults])).slice(0, 5);
    }, [appointments]);

    const filteredAppointments = useMemo(() => {
        return appointments.filter(app => {
            const appDate = app.date instanceof Timestamp ? app.date.toDate().toISOString().split('T')[0] : app.date;
            return appDate === viewDate;
        });
    }, [appointments, viewDate]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <Input 
                        type="date" 
                        value={viewDate} 
                        onChange={(e) => setViewDate(e.target.value)} 
                        className="w-40 h-9"
                    />
                </div>
                <p className="text-sm text-muted-foreground font-medium">Sorted by Provider</p>
            </div>

            <Card className="overflow-hidden border-none shadow-none">
                <CardContent className="p-0 border rounded-lg overflow-x-auto">
                    <div className="min-w-[800px]">
                        <div className="grid grid-cols-[100px_repeat(5,1fr)] bg-muted/50 border-b">
                            <div className="p-3 border-r text-xs font-bold text-muted-foreground uppercase text-center">Time</div>
                            {providers.map(provider => (
                                <div key={provider} className="p-3 border-r text-xs font-bold text-center flex flex-col items-center gap-1">
                                    <UserIcon className="h-3 w-3 text-primary" />
                                    {provider}
                                </div>
                            ))}
                        </div>
                        {TIME_SLOTS.map(slot => (
                            <div key={slot} className="grid grid-cols-[100px_repeat(5,1fr)] border-b hover:bg-muted/5 transition-colors">
                                <div className="p-2 border-r text-xs text-muted-foreground font-mono flex items-center justify-center">{slot}</div>
                                {providers.map(provider => {
                                    const app = filteredAppointments.find(a => a.provider === provider && a.time === slot);
                                    return (
                                        <div key={provider} className="p-1 border-r h-16 min-h-[64px]">
                                            {app ? (
                                                <div className={cn(
                                                    "h-full w-full rounded-md p-2 shadow-sm border-l-4 overflow-hidden",
                                                    app.status === 'Checked Out' ? "bg-success/10 border-success" : "bg-primary/10 border-primary"
                                                )}>
                                                    <p className="text-[10px] font-bold truncate leading-tight">{app.patientName}</p>
                                                    <p className="text-[9px] text-muted-foreground mt-1 truncate flex items-center gap-1">
                                                        <Clock className="h-2 w-2" /> {app.procedure}
                                                    </p>
                                                    <p className="text-[9px] text-muted-foreground truncate flex items-center gap-1">
                                                        <MapPin className="h-2 w-2" /> {app.room || 'No Room'}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="sm" asChild className="h-6 text-[10px]">
                                                        <Link href={`/appointments/new?provider=${encodeURIComponent(provider)}&time=${slot}&date=${viewDate}`}>
                                                            + Slot
                                                        </Link>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function AppointmentsPage() {
  const { selectedPractice } = usePractice();
  const firestore = useFirestore();
  const [activeTab, setActiveTab] = useState('list');

  const appointmentsQuery = useMemo(() => {
    if (!firestore || !selectedPractice) return null;
    return query(
      collection(firestore, 'appointments'),
      where('practiceId', '==', selectedPractice.id)
    );
  }, [firestore, selectedPractice]);

  const { data: appointments, isLoading } = useCollection<Appointment>(appointmentsQuery);

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
        title="Appointments"
        description="Manage the clinic flow with interactive timelines and detailed lists."
        action={
            <Button asChild className="shadow-md">
                <Link href="/appointments/new">
                    <CalendarPlus className="mr-2 h-4 w-4" /> New Appointment
                </Link>
            </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" /> List View
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" /> Scheduler View
            </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
            <DataTable 
                columns={columns} 
                data={appointments || []} 
                filterColumn="patientName" 
                filterPlaceholder="Search patients..."
            />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
            <TimelineView appointments={appointments || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
