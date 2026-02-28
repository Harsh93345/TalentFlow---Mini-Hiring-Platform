import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { type AssessmentSection, type AssessmentQuestion } from '@/lib/database';
import { QuestionBuilder } from './QuestionBuilder';

interface SectionBuilderProps {
  section: AssessmentSection;
  onUpdate: (updates: Partial<AssessmentSection>) => void;
  onRemove: () => void;
}

export function SectionBuilder({ section, onUpdate, onRemove }: SectionBuilderProps) {
  const addQuestion = () => {
    const newQuestion: AssessmentQuestion = {
      id: `question-${Date.now()}`,
      type: 'short-text',
      question: '',
      required: false,
      order: section.questions.length
    };
    onUpdate({ questions: [...section.questions, newQuestion] });
  };

  const updateQuestion = (questionId: string, updates: Partial<AssessmentQuestion>) => {
    onUpdate({
      questions: section.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      )
    });
  };

  const removeQuestion = (questionId: string) => {
    onUpdate({
      questions: section.questions.filter(q => q.id !== questionId)
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Input
              value={section.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="text-lg font-semibold mb-2"
              placeholder="Section Title"
            />
            <Textarea
              value={section.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Section description..."
              rows={2}
            />
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
      </CardHeader>
      <CardContent className="space-y-4">
        {section.questions.map((question) => (
          <QuestionBuilder
            key={question.id}
            question={question}
            onUpdate={(updates) => updateQuestion(question.id, updates)}
            onRemove={() => removeQuestion(question.id)}
            allQuestions={section.questions}
          />
        ))}
        
        <Button variant="outline" onClick={addQuestion} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </CardContent>
    </Card>
  );
}