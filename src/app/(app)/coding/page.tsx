'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { suggestMedicalCodes, SuggestMedicalCodesOutput } from '@/ai/flows/suggest-medical-codes';
import { Loader, Wand2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Coder"
        description="Generate accurate medical codes from clinical notes instantly."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          </CardContent>
        </Card>

        <div className="space-y-6">
           <Card>
                <CardHeader>
                    <CardTitle>Generate Suggestions</CardTitle>
                    <CardDescription>Click the button to let our AI analyze the notes and suggest relevant medical codes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSuggestCodes} disabled={isLoading} className="w-full">
                    {isLoading ? (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    Suggest Codes
                    </Button>
                </CardContent>
            </Card>
          {isLoading && (
             <Card>
                <CardContent className="pt-6">
                     <div className="flex flex-col items-center justify-center space-y-4">
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
                  <ul className="space-y-4">
                    {suggestions.suggestedCodes.map((code, index) => (
                      <li key={index} className="p-4 border rounded-lg bg-background">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-lg">{code.code}</p>
                            <p className="text-sm text-muted-foreground">{code.explanation}</p>
                          </div>
                          <Badge
                            variant={code.confidence > 0.9 ? 'default' : 'secondary'}
                            className={code.confidence > 0.9 ? 'bg-success text-success-foreground' : ''}
                          >
                            {Math.round(code.confidence * 100)}% Confidence
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No codes could be suggested for the provided notes.</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
