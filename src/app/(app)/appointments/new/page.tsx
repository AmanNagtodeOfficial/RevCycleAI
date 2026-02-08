'use client';

import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader, Calendar as CalendarIcon, Clock, MapPin, CheckCircle2, User as UserIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { usePractice } from '@/context/practice-context';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, query, where, Timestamp } from 'firebase/firestore';
import { Patient, Appointment } from '@/lib/data';
import { cn } from '@/lib/utils';

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:13', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export default function NewAppointmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const router = useRouter();
  const { selectedPractice } = usePractice();
  const firestore = useFirestore();

  // Fetch Patients
  const patientsQuery = useMemo(() => {
    if (!firestore || !selectedPractice) return null;
    return query(collection(firestore, 'patients'), where('practiceId', '==', selectedPractice.id));
  }, [firestore, selectedPractice]);
  const { data: patients, isLoading: patientsLoading } = useCollection<Patient>(patientsQuery);

  // Fetch Appointments for the selected date to show availability
  const appointmentsQuery = useMemo(() => {
    if (!firestore || !selectedPractice) return null;
    return query(
        collection(firestore, 'appointments'), 
        where('practiceId', '==', selectedPractice.id)
    );
  }, [firestore, selectedPractice]);
  const { data: allAppointments, isLoading: appointmentsLoading } = useCollection<Appointment>(appointmentsQuery);

  const providers = useMemo(() => {
    const defaults = ['Dr. Evelyn Reed', 'Dr. Ben Carter', 'Dr. Samira Khan', 'Dr. Egon Spengler', 'Dr. Ray Stantz'];
    if (!allAppointments) return defaults;
    const uniqueProviders = [...new Set(allAppointments.map(a => a.provider))];
    return Array.from(new Set([...uniqueProviders, ...defaults]));
  }, [allAppointments]);

  const appointmentsForDate = useMemo(() => {
    if (!allAppointments) return [];
    return allAppointments.filter(app => {
        const appDate = app.date instanceof Timestamp ? app.date.toDate().toISOString().split('T')[0] : app.date;
        return appDate === selectedDate;
    });
  }, [allAppointments, selectedDate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore || !selectedPractice) return;

    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const patientId = formData.get('patientId') as string;
    const patient = patients?.find(p => p.id === patientId);

    const newAppointment = {
        patientId: patientId,
        patientName: patient?.name || 'Unknown Patient',
        provider: selectedProvider || formData.get('provider'),
        date: selectedDate,
        time: selectedTime || formData.get('time'),
        procedure: formData.get('procedure'),
        room: formData.get('room'),
        notes: formData.get('notes'),
        practiceId: selectedPractice.id,
        status: 'Scheduled',
    };

    try {
        await addDoc(collection(firestore, 'appointments'), newAppointment);
        toast({
            title: "Appointment Scheduled",
            description: `Successfully scheduled ${newAppointment.patientName} with ${newAppointment.provider}.`,
        });
        router.push('/appointments');
    } catch (error: any) {
        toast({
            title: "Error scheduling appointment",
            description: error.message,
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  if (patientsLoading || appointmentsLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interactive Scheduler"
        description="View doctor timelines and pick available slots to schedule a new visit."
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Provider Timelines</CardTitle>
                        <CardDescription>Appointments for {selectedDate}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="date-nav" className="sr-only">Date</Label>
                        <Input 
                            id="date-nav" 
                            type="date" 
                            value={selectedDate} 
                            onChange={(e) => setSelectedDate(e.target.value)} 
                            className="w-40"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <div className="min-w-[800px] border-t">
                            <div className="grid grid-cols-[100px_repeat(5,1fr)] bg-muted/30">
                                <div className="p-3 border-r text-xs font-bold text-muted-foreground uppercase text-center flex items-center justify-center">Time</div>
                                {providers.slice(0, 5).map(provider => (
                                    <div key={provider} className="p-3 border-r text-sm font-bold text-center flex flex-col items-center gap-1">
                                        <UserIcon className="h-4 w-4 text-primary" />
                                        {provider}
                                    </div>
                                ))}
                            </div>
                            {TIME_SLOTS.map(slot => (
                                <div key={slot} className="grid grid-cols-[100px_repeat(5,1fr)] border-t hover:bg-muted/5 transition-colors group">
                                    <div className="p-2 border-r text-xs text-muted-foreground font-mono flex items-center justify-center">{slot}</div>
                                    {providers.slice(0, 5).map(provider => {
                                        const app = appointmentsForDate.find(a => a.provider === provider && a.time === slot);
                                        const isSelected = selectedProvider === provider && selectedTime === slot;
                                        
                                        if (app) {
                                            return (
                                                <div key={provider} className="p-1 border-r h-14">
                                                    <div className="h-full w-full bg-primary/10 border-l-4 border-primary rounded-sm p-1.5 overflow-hidden shadow-sm">
                                                        <p className="text-[10px] font-bold truncate leading-tight">{app.patientName}</p>
                                                        <p className="text-[9px] text-muted-foreground truncate leading-tight flex items-center gap-1">
                                                            <MapPin className="h-2 w-2" /> {app.room || 'No Room'}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div 
                                                key={provider} 
                                                className={cn(
                                                    "p-1 border-r h-14 cursor-pointer transition-all",
                                                    isSelected ? "bg-accent/20" : "hover:bg-accent/10"
                                                )}
                                                onClick={() => {
                                                    setSelectedProvider(provider);
                                                    setSelectedTime(slot);
                                                }}
                                            >
                                                {isSelected && (
                                                    <div className="h-full w-full border-2 border-dashed border-accent rounded-sm flex items-center justify-center gap-1 text-accent animate-pulse">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        <span className="text-[10px] font-bold">SELECTED</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <form onSubmit={handleSubmit}>
                <Card className="sticky top-6 shadow-lg border-primary/20">
                    <CardHeader className="bg-primary/5">
                        <CardTitle className="text-lg">Appointment Details</CardTitle>
                        <CardDescription>Complete the form to save.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="patientId">Patient</Label>
                            <Select name="patientId" required>
                                <SelectTrigger id="patientId">
                                    <SelectValue placeholder="Select patient..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {patients?.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="provider">Provider</Label>
                            <Input name="provider" value={selectedProvider} onChange={e => setSelectedProvider(e.target.value)} required placeholder="Select a slot or type..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input id="date" name="date" type="date" value={selectedDate} readOnly className="bg-muted" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time</Label>
                                <Input id="time" name="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} required placeholder="00:00" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="procedure">Procedure</Label>
                            <Input id="procedure" name="procedure" placeholder="e.g., Annual Physical" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="room">Room</Label>
                            <Input id="room" name="room" placeholder="e.g., Exam 1" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea id="notes" name="notes" placeholder="Any special instructions..." className="h-20" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 bg-muted/30 pt-4 pb-6">
                        <Button type="submit" className="w-full" disabled={isSubmitting || !selectedProvider || !selectedTime}>
                            {isSubmitting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                            Confirm Appointment
                        </Button>
                        <Button variant="ghost" type="button" className="w-full" onClick={() => router.back()}>Cancel</Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
      </div>
    </div>
  );
}
