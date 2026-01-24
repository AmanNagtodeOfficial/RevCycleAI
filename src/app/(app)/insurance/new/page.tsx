'use client';

import { useState } from 'react';
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
import { Loader } from 'lucide-react';

export default function NewInsurancePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
        setIsSubmitting(false);
        toast({
            title: "Insurance Plan Added",
            description: "The new insurance plan has been successfully added to the system.",
        });
        router.push('/insurance');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Add New Insurance Plan" 
        description="Onboard a new payer plan and configure its details." 
      />
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Plan Details</CardTitle>
            <CardDescription>Enter the information for the new insurance plan below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="payer-name">Payer Name</Label>
                <Input id="payer-name" placeholder="e.g., Aetna" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input id="plan-name" placeholder="e.g., Aetna Choice® POS II" required />
              </div>
            </div>
             <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="plan-type">Plan Type</Label>
                     <Select required>
                        <SelectTrigger id="plan-type">
                            <SelectValue placeholder="Select a plan type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ppo">PPO</SelectItem>
                            <SelectItem value="hmo">HMO</SelectItem>
                            <SelectItem value="epo">EPO</SelectItem>
                            <SelectItem value="pos">POS</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                     <Select required defaultValue="active">
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="terminated">Terminated</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tfl">Timely Filing Limit (Days)</Label>
                <Input id="tfl" type="number" placeholder="e.g., 90" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ccfl">Claims Correction Limit (Days)</Label>
                <Input id="ccfl" type="number" placeholder="e.g., 180" required />
              </div>
            </div>
          </CardContent>
           <CardFooter className="flex justify-end gap-2 pt-6">
                <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    Add Plan
                </Button>
            </CardFooter>
        </Card>
      </form>
    </div>
  )
}
