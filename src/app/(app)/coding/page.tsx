'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { suggestMedicalCodes, SuggestMedicalCodesOutput } from '@/ai/flows/suggest-medical-codes';
import { Loader, Wand2, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function CodingPage() {
  const [notes, setNotes] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestMedicalCodesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSuggestCodes = async () => {
    if (!notes.trim()) {
      toast({
        title: 'Clinical notes are empty',
        description: 'Please enter some clinical notes to get code suggestions.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await suggestMedicalCodes({ clinicalNotes: notes });
      setSuggestions(result);
    } catch (error) {
      console.error('Error suggesting medical codes:', error);
      toast({
        title: 'Error generating suggestions',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied to clipboard",
        description: `Code "${text}" has been copied.`,
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Coding Copilot"
        description="Generate accurate medical codes from clinical notes instantly."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Clinical Documentation</CardTitle>
            <CardDescription>
              Paste the clinical notes, operative report, or discharge summary below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Patient presents with a persistent cough and fever..."
              className="min-h-[300px] text-base"
            />
            <Button onClick={handleSuggestCodes} disabled={isLoading} className="w-full mt-4">
              {isLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
              )}
              Suggest Codes
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {isLoading && (
             <Card>
                <CardContent className="pt-6">
                     <div className="flex flex-col items-center justify-center space-y-4 h-[360px]">
                        <Loader className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-muted-foreground">Analyzing notes and generating codes...</p>
                    </div>
                </CardContent>
             </Card>
          )}
          {suggestions && (
            <Card>
              <CardHeader>
                <CardTitle>Suggested Codes</CardTitle>
                <CardDescription>
                  Review the AI-generated codes below. Confidence scores indicate the AI's certainty.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {suggestions.suggestedCodes.length > 0 ? (
                  <TooltipProvider>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {suggestions.suggestedCodes.map((code, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{code.code}</span>
                            <span className="text-xs text-muted-foreground">{code.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[250px] truncate">
                           <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-default">{code.explanation}</span>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" align="start" className="max-w-xs">
                                <p>{code.explanation}</p>
                              </TooltipContent>
                           </Tooltip>
                        </TableCell>
                        <TableCell>
                           <Badge
                            variant={code.confidence > 0.9 ? 'default' : 'secondary'}
                            className={code.confidence > 0.9 ? 'bg-success text-success-foreground' : ''}
                          >
                            {Math.round(code.confidence * 100)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(code.code)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy Code</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                  </Table>
                  </TooltipProvider>
                ) : (
                  <p className="text-muted-foreground text-center py-10">No codes could be suggested for the provided notes.</p>
                )}
              </CardContent>
            </Card>
          )}
           {!isLoading && !suggestions && (
             <Card>
                <CardContent className="pt-6">
                     <div className="flex flex-col items-center justify-center space-y-4 h-[360px]">
                        <Wand2 className="h-10 w-10 text-muted-foreground" />
                        <p className="text-muted-foreground">Your code suggestions will appear here.</p>
                    </div>
                </CardContent>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
}
