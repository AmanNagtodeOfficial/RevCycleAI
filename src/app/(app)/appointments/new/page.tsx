'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
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
import { Loader } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { usePractice } from '@/context/practice-context';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, query, where } from 'firebase/firestore';
import { Patient, Appointment } from '@/lib/data';

export default function NewAppointmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { selectedPractice } = usePractice();
  const firestore = useFirestore();

  const patientsQuery = useMemo(() => {
    if (!firestore || !selectedPractice) return null;
    return query(collection(firestore, 'patients'), where('practiceId', '==', selectedPractice.id));
  }, [firestore, selectedPractice]);
  const { data: patients, isLoading: patientsLoading } = useCollection<Patient>(patientsQuery);

  const appointmentsQuery = useMemo(() => {
    if (!firestore || !selectedPractice) return null;
    return query(collection(firestore, 'appointments'), where('practiceId', '==', selectedPractice.id));
  }, [firestore, selectedPractice]);
  const { data: appointments, isLoading: appointmentsLoading } = useCollection<Appointment>(appointmentsQuery);

  const providers = useMemo(() => {
    if (!appointments) return [];
    // Get providers from the appointments in the current practice
    const uniqueProviders = [...new Set(appointments.map(a => a.provider))];
    // Add some default/other providers for the new practice if it has no appointments yet
    const allProviders = new Set([...uniqueProviders, 'Dr. Evelyn Reed', 'Dr. Ben Carter', 'Dr. Samira Khan', 'Dr. Egon Spengler', 'Dr. Ray Stantz']);
    return Array.from(allProviders);
  }, [appointments]);


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
        provider: formData.get('provider'),
        date: formData.get('date'),
        time: formData.get('time'),
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
            description: `An appointment for ${newAppointment.patientName} has been scheduled successfully.`,
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
    return <div className="flex h-screen items-center justify-center"><Loader className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule New Appointment"
        description="Fill in the details to add a new appointment to the calendar."
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient</Label>
                <Select name="patientId" required>
                  <SelectTrigger id="patientId">
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients?.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} (ID: {patient.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                 <Select name="provider" required>
                    <SelectTrigger id="provider">
                        <SelectValue placeholder="Select a provider" />
                    </SelectTrigger>
                    <SelectContent>
                        {providers.map(provider => (
                            <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" name="time" type="time" required />
                </div>
            </div>
             <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="procedure">Procedure / Reason for Visit</Label>
                    <Input id="procedure" name="procedure" placeholder="e.g., Annual Checkup" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="room">Room</Label>
                    <Input id="room" name="room" placeholder="e.g., Exam Room 3" />
                </div>
             </div>
             <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea id="notes" name="notes" placeholder="e.g., Patient called to confirm." />
             </div>
          </CardContent>
           <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    Schedule Appointment
                </Button>
            </CardFooter>
        </Card>
      </form>
    </div>
  );
}
