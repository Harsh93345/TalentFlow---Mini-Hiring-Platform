import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { type Job } from '@/lib/database';
import { SortableJobCard } from './SortableJobCard';
import { useToast } from '@/hooks/use-toast';

interface DraggableJobListProps {
  jobs: Job[];
  onJobsReorder: (jobs: Job[]) => void;
  onEdit: (job: Job) => void;
  onArchive: (job: Job) => void;
}

export function DraggableJobList({ jobs, onJobsReorder, onEdit, onArchive }: DraggableJobListProps) {
  const [items, setItems] = useState(jobs);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      
      // Optimistic update
      setItems(newItems);
      onJobsReorder(newItems);

      try {
        const job = items[oldIndex];
        const response = await fetch(`/api/jobs/${job.id}/reorder`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fromOrder: job.order,
            toOrder: items[newIndex].order
          })
        });

        if (!response.ok) throw new Error('Failed to reorder');

        toast({
          title: 'Order Updated',
          description: 'Job position has been updated.'
        });
      } catch (error) {
        // Rollback on error
        setItems(items);
        onJobsReorder(items);
        
        toast({
          title: 'Error',
          description: 'Failed to update order. Changes reverted.',
          variant: 'destructive'
        });
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(job => job.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((job) => (
            <SortableJobCard
              key={job.id}
              job={job}
              onEdit={onEdit}
              onArchive={onArchive}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
