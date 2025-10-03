import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, X } from 'lucide-react';
import { type AssessmentQuestion } from '@/lib/database';
// import { Badge } from '@/components/ui/badge';

interface QuestionBuilderProps {
  question: AssessmentQuestion;
  onUpdate: (updates: Partial<AssessmentQuestion>) => void;
  onRemove: () => void;
  allQuestions: AssessmentQuestion[];
}

export function QuestionBuilder({ question, onUpdate, onRemove }: QuestionBuilderProps) {
  const addOption = () => {
    const options = question.options || [];
    onUpdate({ options: [...options, ''] });
  };

  const updateOption = (index: number, value: string) => {
    const options = [...(question.options || [])];
    options[index] = value;
    onUpdate({ options });
  };

  const removeOption = (index: number) => {
    const options = question.options?.filter((_, i) => i !== index);
    onUpdate({ options });
  };

  const needsOptions = ['single-choice', 'multi-choice'].includes(question.type);

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Question Type</Label>
                <Select
                  value={question.type}
                  onValueChange={(value) => onUpdate({ type: value as AssessmentQuestion['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-choice">Single Choice</SelectItem>
                    <SelectItem value="multi-choice">Multiple Choice</SelectItem>
                    <SelectItem value="short-text">Short Text</SelectItem>
                    <SelectItem value="long-text">Long Text</SelectItem>
                    <SelectItem value="numeric">Numeric</SelectItem>
                    <SelectItem value="file-upload">File Upload</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={question.required}
                  onCheckedChange={(checked) => onUpdate({ required: checked })}
                />
                <Label>Required</Label>
              </div>
            </div>

            <div>
              <Label>Question</Label>
              <Input
                value={question.question}
                onChange={(e) => onUpdate({ question: e.target.value })}
                placeholder="Enter your question..."
              />
            </div>

            {question.description !== undefined && (
              <div>
                <Label>Description (optional)</Label>
                <Textarea
                  value={question.description}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  placeholder="Add additional context..."
                  rows={2}
                />
              </div>
            )}

            {needsOptions && (
              <div>
                <Label>Answer Options</Label>
                <div className="space-y-2 mt-2">
                  {(question.options || []).map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addOption}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}

            {question.conditionalLogic && (
              <div className="p-3 bg-muted rounded-lg">
                <Label className="text-xs">Conditional Logic</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Show when: Question {question.conditionalLogic.dependsOnQuestionId} = {question.conditionalLogic.showWhen}
                </p>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="ml-4"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}