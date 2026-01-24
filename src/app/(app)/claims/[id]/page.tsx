
'use client'
import { PageHeader } from "@/components/page-header";
import { claims } from "@/lib/data";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, FileText, Lightbulb, Loader, User, DollarSign, Calendar, Stethoscope, Briefcase, FileWarning, Wrench } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const getStatusBadge = (status: (typeof claims)[0]["status"]) => {
  switch (status) {
    case "Paid":
      return <Badge className="bg-success text-success-foreground hover:bg-success/80">{status}</Badge>
    case "Denied":
      return <Badge variant="destructive">{status}</Badge>
    case "Pending":
      return <Badge className="bg-accent text-accent-foreground hover:bg-accent/80">{status}</Badge>
    case "Submitted":
      return <Badge variant="secondary">{status}</Badge>
    case "Scrubbing":
      return <Badge variant="outline" className="border-primary/50 text-primary">{status}</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

const getTimelineIcon = (status: string) => {
    switch (status.toLowerCase()) {
        case 'paid':
        case 'submitted':
            return <CheckCircle className="h-5 w-5 text-success" />;
        case 'denied':
            return <AlertCircle className="h-5 w-5 text-destructive" />;
        case 'pending':
        case 'scrubbing':
            return <Loader className="h-5 w-5 text-accent animate-spin" />;
        default:
            return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
}

export default function ClaimDetailPage({ params }: { params: { id: string } }) {
  const claim = claims.find(c => c.id === params.id);

  if (!claim) {
    notFound();
  }
  
  const denialRiskColor = claim.riskScore! > 75 ? 'text-destructive' : claim.riskScore! > 50 ? 'text-accent' : 'text-success';

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Claim ${claim.id}`} 
        description={`Details for claim submitted for ${claim.patient} on ${claim.date}.`}
        action={
            <div className="flex items-center gap-2">
                <Button variant="outline">Generate Appeal</Button>
                <Button>Triage Denial</Button>
            </div>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Claim Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                           <User className="w-4 h-4 text-muted-foreground" />
                           <div><span className="font-medium">Patient:</span> {claim.patient}</div>
                        </div>
                        <div className="flex items-center gap-2">
                           <Briefcase className="w-4 h-4 text-muted-foreground" />
                           <div><span className="font-medium">Payer:</span> {claim.payer}</div>
                        </div>
                         <div className="flex items-center gap-2">
                           <Stethoscope className="w-4 h-4 text-muted-foreground" />
                           <div><span className="font-medium">Provider:</span> {claim.provider}</div>
                        </div>
                        <div className="flex items-center gap-2">
                           <DollarSign className="w-4 h-4 text-muted-foreground" />
                           <div><span className="font-medium">Amount:</span> {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(claim.amount)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                           <Calendar className="w-4 h-4 text-muted-foreground" />
                           <div><span className="font-medium">Submitted:</span> {claim.date}</div>
                        </div>
                        <div className="flex items-center gap-2">
                           {getStatusBadge(claim.status)}
                        </div>
                    </div>
                     <Separator className="my-6" />
                     <div className="space-y-2 text-sm">
                        <h4 className="font-medium mb-2">Service Details</h4>
                        <p><span className="font-medium">Procedure:</span> {claim.procedure}</p>
                        <p><span className="font-medium">Diagnosis:</span> {claim.diagnosis}</p>
                     </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Claim History</CardTitle>
                    <CardDescription>Timeline of status changes and actions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative pl-6">
                        <div className="absolute left-6 top-0 bottom-0 w-px bg-border -translate-x-1/2"></div>
                        <ul className="space-y-8">
                        {claim.history.map((event, index) => (
                            <li key={index} className="flex items-start gap-4">
                                <div className="absolute left-6 -translate-x-1/2 bg-background p-1 rounded-full border">
                                    {getTimelineIcon(event.status)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{event.status}</p>
                                    <p className="text-sm text-muted-foreground">by {event.user} on {event.date}</p>
                                </div>
                            </li>
                        ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="text-accent" />
                        <span>AI Claim Scrubber</span>
                    </CardTitle>
                    <CardDescription>Automated analysis and suggestions to improve claim accuracy.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Denial Risk Score</p>
                        <p className={`text-6xl font-bold ${denialRiskColor}`}>{claim.riskScore}%</p>
                    </div>
                    {claim.denialReason && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Denial Reason: {claim.denialReason}</AlertTitle>
                        </Alert>
                    )}

                    {claim.aiSuggestions && claim.aiSuggestions.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2 text-sm">Actionable Suggestions:</h4>
                            <div className="space-y-3">
                                {claim.aiSuggestions.map((suggestion, index) => (
                                    <div key={index} className="text-sm p-3 border rounded-lg bg-muted/50">
                                        <p className="font-semibold mb-1">{suggestion.suggestion}</p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><FileWarning className="h-3 w-3" /> {suggestion.category}: {suggestion.field}</span>
                                            <span className="flex items-center gap-1"><Wrench className="h-3 w-3" /> Action: {suggestion.actionType}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!claim.denialReason && (!claim.aiSuggestions || claim.aiSuggestions.length === 0) && (
                         <Alert>
                            <CheckCircle className="h-4 w-4 text-success" />
                            <AlertTitle>No Issues Found</AlertTitle>
                            <AlertDescription>
                                The AI scrubber did not find any critical issues with this claim.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
