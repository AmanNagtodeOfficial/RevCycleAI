'use client';

import { Firestore, doc, writeBatch, Timestamp } from 'firebase/firestore';
import { practices, patients, claims, appointments, statements, insurancePlans, payments, recentActivity } from './dummy-data';
import { toast } from '@/hooks/use-toast';

export async function seedDatabase(firestore: Firestore) {
  if (!firestore) {
    toast({ title: 'Firestore not available', variant: 'destructive' });
    return;
  }

  const batch = writeBatch(firestore);

  try {
    toast({ title: 'Seeding database...', description: 'Please wait.' });

    practices.forEach(practice => {
      const docRef = doc(firestore, 'practices', practice.id);
      batch.set(docRef, practice);
    });

    patients.forEach(patient => {
      const docRef = doc(firestore, 'patients', patient.id);
      batch.set(docRef, patient);
    });

    appointments.forEach(appointment => {
      const docRef = doc(firestore, 'appointments', appointment.id);
      batch.set(docRef, { ...appointment, date: new Date(appointment.date) });
    });

    claims.forEach(claim => {
      const docRef = doc(firestore, 'claims', claim.id);
      const claimData = {
          ...claim,
          date: Timestamp.fromDate(new Date(claim.date)),
          dateOfService: Timestamp.fromDate(new Date(claim.dateOfService)),
          lastActivity: Timestamp.fromDate(new Date(claim.lastActivity)),
      }
      batch.set(docRef, claimData);
    });
    
    statements.forEach(statement => {
        const docRef = doc(firestore, 'statements', statement.id);
        batch.set(docRef, statement);
    });

    insurancePlans.forEach(plan => {
        const docRef = doc(firestore, 'insurancePlans', plan.id);
        batch.set(docRef, plan);
    });

    payments.forEach(payment => {
        const docRef = doc(firestore, 'payments', payment.id);
        batch.set(docRef, payment);
    });

    recentActivity.forEach(activity => {
        const docRef = doc(firestore, 'recentActivity', activity.id);
        const activityData = { ...activity, createdAt: Timestamp.fromDate(new Date(activity.createdAt)) };
        batch.set(docRef, activityData);
    });

    await batch.commit();

    toast({ title: 'Database Seeded!', description: 'Dummy data has been added to Firestore.' });
  } catch (error: any) {
    toast({
      title: 'Error seeding database',
      description: error.message,
      variant: 'destructive',
    });
  }
}
