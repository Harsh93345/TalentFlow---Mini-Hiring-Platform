import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Eye, Save } from 'lucide-react';
import { type AssessmentSection } from '@/lib/database';
import { SectionBuilder } from './SectionBuilder';
import { AssessmentPreview } from './AssessmentPreview';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AssessmentBuilderProps {
  jobId: string;
  initialData?: {
    title: string;
    description?: string;
    sections: AssessmentSection[];
  };
}

export function AssessmentBuilder({ jobId, initialData }: AssessmentBuilderProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [sections, setSections] = useState<AssessmentSection[]>(initialData?.sections || []);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const addSection = () => {
    const newSection: AssessmentSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      description: '',
      questions: [],
      order: sections.length
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (sectionId: string, updates: Partial<AssessmentSection>) => {
    setSections(sections.map(s => 
      s.id === sectionId ? { ...s, ...updates } : s
    ));
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Assessment title is required',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/assessments/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          sections,
          isActive: true
        })
      });

      if (!response.ok) throw new Error('Failed to save assessment');

      toast({
        title: 'Assessment Saved',
        description: 'Your assessment has been saved successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save assessment',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Assessment Information</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPreview(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Assessment'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Assessment Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Frontend Developer Assessment"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this assessment evaluates..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Sections</h3>
            <Button onClick={addSection}>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>

          {sections.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No sections yet. Add a section to start building your assessment.
                </p>
                <Button onClick={addSection}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Section
                </Button>
              </CardContent>
            </Card>
          ) : (
            sections.map((section) => (
              <SectionBuilder
                key={section.id}
                section={section}
                onUpdate={(updates) => updateSection(section.id, updates)}
                onRemove={() => removeSection(section.id)}
              />
            ))
          )}
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assessment Preview</DialogTitle>
          </DialogHeader>
          <AssessmentPreview
            title={title}
            description={description}
            sections={sections}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}