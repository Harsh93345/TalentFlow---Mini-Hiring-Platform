import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type Job } from '@/lib/database';
import { GripVertical, MoreVertical, Eye, Edit, Archive, MapPin, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SortableJobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onArchive: (job: Job) => void;
}

export function SortableJobCard({ job, onEdit, onArchive }: SortableJobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStatusColor = (status: Job['status']) => {
    return status === 'active' 
      ? 'bg-success-light text-success border-success' 
      : 'bg-muted text-muted-foreground border-border';
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="group hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 flex items-start gap-2">
              <button
                className="mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">
                  {job.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getStatusColor(job.status)}>
                    {job.status}
                  </Badge>
                  {job.department && (
                    <Badge variant="outline">
                      {job.department}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/jobs/${job.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(job)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Job
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onArchive(job)}>
                  <Archive className="w-4 h-4 mr-2" />
                  {job.status === 'active' ? 'Archive' : 'Activate'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {job.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <MapPin className="w-4 h-4" />
              {job.location}
            </div>
          )}
          
          {job.description && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {job.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-1 mb-4">
            {job.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {job.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{job.tags.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>12 applicants</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}