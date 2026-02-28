import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { type AssessmentSection, type AssessmentQuestion } from '@/lib/database';
import { Badge } from '@/components/ui/badge';

interface AssessmentPreviewProps {
  title: string;
  description?: string;
  sections: AssessmentSection[];
}

export function AssessmentPreview({ title, description, sections }: AssessmentPreviewProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});

  const updateResponse = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const shouldShowQuestion = (question: AssessmentQuestion): boolean => {
    if (!question.conditionalLogic) return true;
    
    const dependentValue = responses[question.conditionalLogic.dependsOnQuestionId];
    const showWhen = question.conditionalLogic.showWhen;
    
    if (Array.isArray(showWhen)) {
      return showWhen.includes(dependentValue);
    }
    return dependentValue === showWhen;
  };

  const renderQuestion = (question: AssessmentQuestion) => {
    if (!shouldShowQuestion(question)) return null;

    return (
      <div key={question.id} className="space-y-3">
        <Label className="flex items-center gap-2">
          {question.question}
          {question.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
        </Label>
        
        {question.description && (
          <p className="text-sm text-muted-foreground">{question.description}</p>
        )}

        {question.type === 'single-choice' && (
          <RadioGroup
            value={responses[question.id]}
            onValueChange={(value) => updateResponse(question.id, value)}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === 'multi-choice' && (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  checked={responses[question.id]?.includes(option)}
                  onCheckedChange={(checked) => {
                    const current = responses[question.id] || [];
                    const updated = checked
                      ? [...current, option]
                      : current.filter((o: string) => o !== option);
                    updateResponse(question.id, updated);
                  }}
                  id={`${question.id}-${index}`}
                />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        )}

        {question.type === 'short-text' && (
          <Input
            value={responses[question.id] || ''}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            placeholder="Your answer..."
            maxLength={question.validation?.maxLength}
          />
        )}

        {question.type === 'long-text' && (
          <Textarea
            value={responses[question.id] || ''}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            placeholder="Your answer..."
            rows={4}
            maxLength={question.validation?.maxLength}
          />
        )}

        {question.type === 'numeric' && (
          <Input
            type="number"
            value={responses[question.id] || ''}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            min={question.validation?.min}
            max={question.validation?.max}
          />
        )}

        {question.type === 'file-upload' && (
          <Input
            type="file"
            onChange={(e) => updateResponse(question.id, e.target.files?.[0])}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>

      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            {section.description && (
              <p className="text-sm text-muted-foreground">{section.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {section.questions.map(renderQuestion)}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button size="lg">
          Submit Assessment
        </Button>
      </div>
    </div>
  );
}