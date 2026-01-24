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
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader, UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function EraPostingPage() {
  const [isPosting, setIsPosting] = useState(false);
  const [fileName, setFileName] = useState('');
  const [postResult, setPostResult] = useState<{success: boolean, message: string, details?: any} | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName('');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fileName) {
        toast({
            title: "No file selected",
            description: "Please select an ERA file to post.",
            variant: "destructive",
        });
        return;
    }
    setIsPosting(true);
    setPostResult(null);

    // Simulate API call for ERA posting
    setTimeout(() => {
        setIsPosting(false);
        const postSuccess = Math.random() > 0.2; // 80% success rate
        if (postSuccess) {
            setPostResult({
                success: true,
                message: `Successfully posted ERA file: ${fileName}`,
                details: {
                    totalPayments: 5,
                    totalPosted: 12345.67,
                    claimsAffected: ['C20240715001', 'C20240709005', 'C20240701008', 'C20240708006', 'C20240714002']
                }
            });
            toast({
                title: "ERA Posted Successfully",
                description: `Processed ${fileName} and applied payments.`,
            });
        } else {
            setPostResult({
                success: false,
                message: `Failed to post ERA file: ${fileName}.`,
                details: {
                    error: "File format not recognized or contains errors.",
                    line: 42,
                }
            });
             toast({
                title: "ERA Posting Failed",
                description: "There was an error processing the ERA file.",
                variant: 'destructive'
            });
        }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Post Electronic Remittance Advice (ERA)" 
        description="Upload and automatically post payments from an ERA file (ANSI 835) received from a clearinghouse." 
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Upload ERA File</CardTitle>
              <CardDescription>Select the ERA file you want to post. The system will automatically parse it and apply payments to the corresponding claims.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="era-file">ERA File (ANSI 835)</Label>
                    <Input id="era-file" type="file" accept=".x12,.835,.txt" onChange={handleFileChange} />
                </div>
                {fileName && <p className="text-sm text-muted-foreground">Selected file: {fileName}</p>}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isPosting || !fileName}>
                 {isPosting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                 Post ERA
              </Button>
            </CardFooter>
          </form>
        </Card>

        {postResult && (
            <Card>
                <CardHeader>
                    <CardTitle>Posting Results</CardTitle>
                    <CardDescription>Summary of the ERA posting process.</CardDescription>
                </CardHeader>
                 <CardContent>
                    {postResult.success ? (
                        <Alert variant="default" className="bg-success/10 border-success/50">
                            <CheckCircle className="h-4 w-4 text-success" />
                            <AlertTitle className="text-success">Posting Successful</AlertTitle>
                            <AlertDescription className="text-success/90">
                                <p className="font-semibold">{postResult.message}</p>
                                <div className="mt-2 space-y-1 text-sm">
                                    <p><strong>Total Payments:</strong> {postResult.details.totalPayments}</p>
                                    <p><strong>Total Amount Posted:</strong> {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(postResult.details.totalPosted)}</p>
                                    <p><strong>Claims Affected:</strong> {postResult.details.claimsAffected.length}</p>
                                </div>
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Posting Failed</AlertTitle>
                            <AlertDescription>
                                 <p className="font-semibold">{postResult.message}</p>
                                 <div className="mt-2 space-y-1 text-sm">
                                    <p><strong>Error:</strong> {postResult.details.error}</p>
                                    <p><strong>Approximate Location:</strong> Line {postResult.details.line}</p>
                                 </div>
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  )
}
