import { useState } from 'react';
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { type Candidate } from '@/lib/database';
import { KanbanColumn } from './KanbanColumn';
import { CandidateCard } from './CandidateCard';
import { useToast } from '@/hooks/use-toast';

interface KanbanBoardProps {
  candidates: Candidate[];
  onCandidateMove: (candidateId: string, newStage: Candidate['stage']) => void;
}

const stages: Array<{ id: Candidate['stage']; label: string; color: string }> = [
  { id: 'applied', label: 'Applied', color: 'bg-blue-100' },
  { id: 'screen', label: 'Screening', color: 'bg-purple-100' },
  { id: 'tech', label: 'Technical', color: 'bg-yellow-100' },
  { id: 'offer', label: 'Offer', color: 'bg-green-100' },
  { id: 'hired', label: 'Hired', color: 'bg-green-200' },
  { id: 'rejected', label: 'Rejected', color: 'bg-red-100' },
];

export function KanbanBoard({ candidates, onCandidateMove }: KanbanBoardProps) {
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const candidate = candidates.find(c => c.id === event.active.id);
    setActiveCandidate(candidate || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCandidate(null);

    if (over && active.id !== over.id) {
      const candidateId = active.id as string;
      const newStage = over.id as Candidate['stage'];
      const candidate = candidates.find(c => c.id === candidateId);

      if (candidate && candidate.stage !== newStage) {
        try {
          onCandidateMove(candidateId, newStage);

          const response = await fetch(`/api/candidates/${candidateId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stage: newStage })
          });

          if (!response.ok) throw new Error('Failed to update stage');

          toast({
            title: 'Stage Updated',
            description: `${candidate.name} moved to ${stages.find(s => s.id === newStage)?.label}`
          });
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to update candidate stage',
            variant: 'destructive'
          });
        }
      }
    }
  };

  const getCandidatesByStage = (stage: Candidate['stage']) => {
    return candidates.filter(c => c.stage === stage);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            candidates={getCandidatesByStage(stage.id)}
          />
        ))}
      </div>
      
      <DragOverlay>
        {activeCandidate ? (
          <CandidateCard candidate={activeCandidate} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
