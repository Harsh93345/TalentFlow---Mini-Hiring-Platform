import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { type Candidate } from '@/lib/database';
import { CandidateCard } from './CandidateCard';
import { Card } from '@/components/ui/card';

interface KanbanColumnProps {
  stage: {
    id: Candidate['stage'];
    label: string;
    color: string;
  };
  candidates: Candidate[];
}

export function KanbanColumn({ stage, candidates }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  return (
    <div className="flex-shrink-0 w-80">
      <div className={`p-3 rounded-t-lg ${stage.color} border-b-2 border-border`}>
        <h3 className="font-semibold text-foreground flex items-center justify-between">
          {stage.label}
          <span className="text-sm bg-white rounded-full px-2 py-1">
            {candidates.length}
          </span>
        </h3>
      </div>
      
      <Card
        ref={setNodeRef}
        className={`min-h-[500px] p-4 space-y-3 rounded-t-none transition-colors ${
          isOver ? 'bg-muted/50' : ''
        }`}
      >
        <SortableContext
          items={candidates.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </SortableContext>
      </Card>
    </div>
  );
}