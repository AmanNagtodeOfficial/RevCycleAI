
'use client';

import React, { useMemo, useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { notFound, useParams } from "next/navigation";
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
} from "@/ui/tabs";
import { DataTable } from "@/components/data-table";
import { columns as claimColumns } from "@/app/(app)/claims/columns";
import { columns as statementColumns } from "@/app/(app)/billing/columns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Cake, Phone, Mail, Shield, Home, Users, Briefcase, Loader, FileText, Filter, Download, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EditPatientDialog } from "./edit-patient-dialog";
import { Separator } from "@/components/ui/separator";
import { usePractice } from '@/context/practice-context';
import { useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, collection, query, where, Timestamp, addDoc, serverTimestamp } from 'firebase/firestore';
import { Patient, Claim, Statement, PatientDocument } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function AddDocumentDialog({ patientId, practiceId, patientName }: { patientId: string, practiceId: string, patientName: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const firestore = useFirestore();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!firestore) return;

        setIsSaving(true);
        const formData = new FormData(event.currentTarget);
        
        const newDoc = {
            patientId,
            practiceId,
            name: formData.get('name'),
            category: formData.get('category'),
            dateUploaded: serverTimestamp(),
            url: 'https://placehold.co/600x400?text=Patient+Document' // Placeholder for actual file upload
        };

        try {
            await addDoc(collection(firestore, 'patientDocuments'), newDoc);
            
            // Log activity
            await addDoc(collection(firestore, 'recentActivity'), {
                user: 'Admin',
                avatar: 'https://picsum.photos/seed/admin/40/40',
                action: 'uploaded a new document for',
                target: patientName,
                time: 'Just now',
                practiceId: practiceId,
                createdAt: serverTimestamp()
            });

            setIsOpen(false);
        } catch (e: any) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Add Document</Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Patient Document</DialogTitle>
                        <DialogDescription>Attach a new record or file to this patient's profile.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="doc-name">Document Name</Label>
                            <Input id="doc-name" name="name" placeholder="e.g., Blood Test Results" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="doc-category">Category</Label>
                            <Select name="category" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Medical Record">Medical Record</SelectItem>
                                    <SelectItem value="Progress Note">Progress Note</SelectItem>
                                    <SelectItem value="Insurance Card">Insurance Card</SelectItem>
                                    <SelectItem value="Authorization">Authorization</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="doc-file">Select File</Label>
                            <Input id="doc-file" type="file" className="cursor-pointer" />
                            <p className="text-[10px] text-muted-foreground">Note: Files are stored as metadata in this prototype.</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            Save Document
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DocumentsTab({ documents, patientId, practiceId, patientName }: { documents: PatientDocument[], patientId: string, practiceId: string, patientName: string }) {
    const [filter, setFilter] = useState<string>('all');

    const filteredDocs = useMemo(() => {
        if (filter === 'all') return documents;
        return documents.filter(d => d.category === filter);
    }, [documents, filter]);

    const formatDate = (val: any) => {
        if (val instanceof Timestamp) return val.toDate().toLocaleDateString();
        return val || 'N/A';
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Patient Documents</h3>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Documents</SelectItem>
                            <SelectItem value="Medical Record">Medical Records</SelectItem>
                            <SelectItem value="Progress Note">Progress Notes</SelectItem>
                            <SelectItem value="Insurance Card">Insurance Cards</SelectItem>
                            <SelectItem value="Authorization">Authorizations</SelectItem>
                        </SelectContent>
                    </Select>
                    <AddDocumentDialog patientId={patientId} practiceId={practiceId} patientName={patientName} />
                </div>
            </div>

            <div className="grid gap-4">
                {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc) => (
                        <Card key={doc.id}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-muted rounded-lg">
                                        <FileText className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{doc.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Badge variant="secondary" className="text-[10px] py-0">{doc.category}</Badge>
                                            <span>•</span>
                                            <span>Uploaded on {formatDate(doc.dateUploaded)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No documents found for this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PatientDetailPage() {
  const { id } = useParams() as { id: string };
  const { selectedPractice } = usePractice();
  const firestore = useFirestore();

  const patientRef = useMemo(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'patients', id);
  }, [firestore, id]);

  const { data: patient, isLoading: patientLoading } = useDoc<Patient>(patientRef);

  const claimsQuery = useMemo(() => {
    if (!firestore || !id) return null;
    return query(collection(firestore, 'claims'), where('patientId', '==', id));
  }, [firestore, id]);
  const { data: patientClaims, isLoading: claimsLoading } = useCollection<Claim>(claimsQuery);

  const statementsQuery = useMemo(() => {
    if (!firestore || !id) return null;
    return query(collection(firestore, 'statements'), where('patientId', '==', id));
  }, [firestore, id]);
  const { data: patientStatements, isLoading: statementsLoading } = useCollection<Statement>(statementsQuery);

  const docsQuery = useMemo(() => {
    if (!firestore || !id) return null;
    return query(collection(firestore, 'patientDocuments'), where('patientId', '==', id));
  }, [firestore, id]);
  const { data: patientDocs, isLoading: docsLoading } = useCollection<PatientDocument>(docsQuery);

  if (patientLoading || claimsLoading || statementsLoading || docsLoading) {
    return <div className="flex h-[80vh] items-center justify-center"><Loader className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!patient || (selectedPractice && patient.practiceId !== selectedPractice.id)) {
    notFound();
  }

  const totalBilled = patientClaims?.reduce((acc, claim) => acc + claim.amount, 0) || 0;
  const outstandingBalance = patientStatements?.filter(s => s.status === 'Sent' || s.status === 'Overdue').reduce((acc, s) => acc + s.amountDue, 0) || 0;

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
                <EditPatientDialog patient={patient} />
                <Button asChild><Link href="/claims/new">New Claim</Link></Button>
            </div>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
                   <div className="flex flex-col space-y-2">
                        <h4 className="font-medium">Patient Info</h4>
                        <div className="flex items-center gap-3">
                            <Cake className="w-4 h-4 text-muted-foreground" />
                            <span>Born on {patient.dob}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-4 h-4 flex items-center justify-center text-muted-foreground font-bold">G</span>
                            <span>{patient.gender}</span>
                        </div>
                   </div>
                   <Separator />
                   <div className="flex flex-col space-y-2">
                        <h4 className="font-medium">Contact Information</h4>
                         <div className="flex items-start gap-3">
                            <Home className="w-4 h-4 text-muted-foreground mt-1" />
                            <span>{patient.address},<br/>{patient.city}, {patient.state} {patient.zip}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{patient.phone}</span>
                        </div>
                         <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{patient.email}</span>
                        </div>
                   </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Insurance & Subscriber</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex flex-col space-y-2">
                        <h4 className="font-medium flex items-center gap-2"><Users className="w-4 h-4"/>Subscriber: {patient.subscriberName} ({patient.subscriberRelationship})</h4>
                         <div className="flex items-center gap-3 pl-6">
                            <Cake className="w-4 h-4 text-muted-foreground" />
                            <span>Born on {patient.subscriberDob}</span>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col space-y-2">
                        <h4 className="font-medium flex items-center gap-2"><Briefcase className="w-4 h-4" />Primary Insurance</h4>
                        <div className="pl-6 space-y-1">
                            <div className="flex items-center gap-3"><Shield className="w-4 h-4 text-muted-foreground" />{patient.primaryInsuranceProvider}</div>
                            <div className="flex items-center gap-3"><span className="text-muted-foreground text-xs w-16">Policy #:</span><span>{patient.primaryInsuranceId}</span></div>
                            <div className="flex items-center gap-3"><span className="text-muted-foreground text-xs w-16">Group #:</span><span>{patient.primaryInsuranceGroup}</span></div>
                        </div>
                    </div>
                     {patient.secondaryInsuranceProvider && (
                        <>
                         <Separator />
                         <div className="flex flex-col space-y-2">
                            <h4 className="font-medium flex items-center gap-2"><Briefcase className="w-4 h-4" />Secondary Insurance</h4>
                            <div className="pl-6 space-y-1">
                                <div className="flex items-center gap-3"><Shield className="w-4 h-4 text-muted-foreground" />{patient.secondaryInsuranceProvider}</div>
                                <div className="flex items-center gap-3"><span className="text-muted-foreground text-xs w-16">Policy #:</span><span>{patient.secondaryInsuranceId}</span></div>
                                <div className="flex items-center gap-3"><span className="text-muted-foreground text-xs w-16">Group #:</span><span>{patient.secondaryInsuranceGroup}</span></div>
                            </div>
                        </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
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
            <Tabs defaultValue="claims" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="claims">Claims History</TabsTrigger>
                    <TabsTrigger value="billing">Billing & Statements</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                <TabsContent value="claims" className="mt-4">
                    <DataTable columns={claimColumns} data={patientClaims || []} filterColumn="status" filterPlaceholder="Filter by status..." />
                </TabsContent>
                <TabsContent value="billing" className="mt-4">
                     <DataTable columns={statementColumns} data={patientStatements || []} filterColumn="status" filterPlaceholder="Filter by status..." />
                </TabsContent>
                <TabsContent value="documents" className="mt-4">
                    <DocumentsTab documents={patientDocs || []} patientId={patient.id} practiceId={patient.practiceId} patientName={patient.name} />
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  )
}
