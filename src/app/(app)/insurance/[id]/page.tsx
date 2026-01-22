import { PageHeader } from "@/components/page-header";
import { insurancePlans } from "@/lib/insurance-data";
import { claims } from "@/lib/data";
import { columns as claimColumns } from "@/app/(app)/claims/columns";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileClock, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { DataTable } from "@/components/data-table";

// Mock data for detailed analytics
const planDetails = {
  benefits: {
    individualDeductible: { inNetwork: '$1,500', outOfNetwork: '$5,000' },
    familyDeductible: { inNetwork: '$3,000', outOfNetwork: '$10,000' },
    individualOOPMax: { inNetwork: '$6,000', outOfNetwork: '$15,000' },
    familyOOPMax: { inNetwork: '$12,000', outOfNetwork: '$30,000' },
  },
  coveredCpt: [
    { code: '99213', description: 'Office visit, established patient, 15-25 min', requiresAuth: false, notes: 'Standard coverage' },
    { code: '99214', description: 'Office visit, established patient, 25-39 min', requiresAuth: false, notes: 'Standard coverage' },
    { code: '99396', description: 'Preventive visit, established patient, 40-64 yrs', requiresAuth: false, notes: 'Covered once annually' },
    { code: '93000', description: 'Electrocardiogram, routine (EKG)', requiresAuth: false, notes: 'Covered if medically necessary' },
    { code: '71046', description: 'Chest X-Ray, 2 views', requiresAuth: true, notes: 'Prior authorization needed' },
    { code: '27447', description: 'Total knee arthroplasty', requiresAuth: true, notes: 'Prior auth & medical necessity review' },
  ],
  coveredDx: [
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'R05', description: 'Cough' },
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' },
  ]
};

export default function InsuranceDetailPage({ params }: { params: { id: string } }) {
  const plan = insurancePlans.find(p => p.id === params.id);

  if (!plan) {
    notFound();
  }

  const associatedClaims = claims.filter(c => c.payer === plan.payerName);

  return (
    <div className="space-y-6">
      <PageHeader 
        title={plan.planName} 
        description={`Detailed analytics for ${plan.payerName} plan.`}
      />
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Details</TabsTrigger>
          <TabsTrigger value="claims">Associated Claims</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Plan Type</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{plan.planType}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                        {plan.status === 'Active' ? <CheckCircle className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-destructive" />}
                    </CardHeader>
                    <CardContent>
                         <Badge variant={plan.status === 'Active' ? 'default' : 'destructive'} className={plan.status === 'Active' ? 'bg-success text-success-foreground' : ''}>{plan.status}</Badge>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Timely Filing Limit</CardTitle>
                        <FileClock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{plan.timelyFilingLimit} Days</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Corrected Claim Limit</CardTitle>
                        <FileClock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{plan.claimsCorrectionLimit} Days</div>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Key Benefits & Coverage</CardTitle>
                    <CardDescription>Individual and family deductibles and out-of-pocket maximums.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                             <h4 className="font-semibold mb-2">Deductibles</h4>
                             <div className="grid grid-cols-2 gap-2 text-sm">
                                 <p className="text-muted-foreground">Individual (In-Network)</p>
                                 <p className="font-medium text-right">{planDetails.benefits.individualDeductible.inNetwork}</p>
                                 <p className="text-muted-foreground">Individual (Out-of-Network)</p>
                                 <p className="font-medium text-right">{planDetails.benefits.individualDeductible.outOfNetwork}</p>
                                 <p className="text-muted-foreground">Family (In-Network)</p>
                                 <p className="font-medium text-right">{planDetails.benefits.familyDeductible.inNetwork}</p>
                                 <p className="text-muted-foreground">Family (Out-of-Network)</p>
                                 <p className="font-medium text-right">{planDetails.benefits.familyDeductible.outOfNetwork}</p>
                             </div>
                        </div>
                        <div>
                             <h4 className="font-semibold mb-2">Out-of-Pocket Max</h4>
                             <div className="grid grid-cols-2 gap-2 text-sm">
                                 <p className="text-muted-foreground">Individual (In-Network)</p>
                                 <p className="font-medium text-right">{planDetails.benefits.individualOOPMax.inNetwork}</p>
                                 <p className="text-muted-foreground">Individual (Out-of-Network)</p>
                                 <p className="font-medium text-right">{planDetails.benefits.individualOOPMax.outOfNetwork}</p>
                                 <p className="text-muted-foreground">Family (In-Network)</p>
                                 <p className="font-medium text-right">{planDetails.benefits.familyOOPMax.inNetwork}</p>
                                 <p className="text-muted-foreground">Family (Out-of-Network)</p>
                                 <p className="font-medium text-right">{planDetails.benefits.familyOOPMax.outOfNetwork}</p>
                             </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="coverage" className="space-y-6 mt-4">
             <Card>
                <CardHeader>
                    <CardTitle>Covered CPT Codes</CardTitle>
                    <CardDescription>A list of commonly billed CPT codes and their coverage status under this plan.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>CPT Code</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Requires Auth</TableHead>
                                <TableHead>Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {planDetails.coveredCpt.map(cpt => (
                                <TableRow key={cpt.code}>
                                    <TableCell className="font-medium">{cpt.code}</TableCell>
                                    <TableCell>{cpt.description}</TableCell>
                                    <TableCell>
                                        <Badge variant={cpt.requiresAuth ? "destructive" : "secondary"}>
                                            {cpt.requiresAuth ? 'Yes' : 'No'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{cpt.notes}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
             </Card>
              <Card>
                <CardHeader>
                    <CardTitle>Commonly Covered Diagnosis Codes (ICD-10)</CardTitle>
                     <CardDescription>This is not an exhaustive list. Always verify medical necessity.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>DX Code</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {planDetails.coveredDx.map(dx => (
                                <TableRow key={dx.code}>
                                    <TableCell className="font-medium">{dx.code}</TableCell>
                                    <TableCell>{dx.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
             </Card>
        </TabsContent>

        <TabsContent value="claims" className="mt-4">
            <DataTable columns={claimColumns} data={associatedClaims} filterColumn="patient" filterPlaceholder="Filter by patient..." />
        </TabsContent>
      </Tabs>
    </div>
  )
}
