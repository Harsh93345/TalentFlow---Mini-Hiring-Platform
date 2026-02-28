import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { type Candidate } from '@/lib/database';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Mail, Phone, Calendar, Eye, Edit, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VirtualizedCandidateListProps {
  candidates: Candidate[];
}

export function VirtualizedCandidateList({ candidates }: VirtualizedCandidateListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: candidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 10,
  });

  const getStageColor = (stage: Candidate['stage']) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-700 border-blue-200',
      screen: 'bg-purple-100 text-purple-700 border-purple-200',
      tech: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      offer: 'bg-green-100 text-green-700 border-green-200',
      hired: 'bg-green-200 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[stage] || 'bg-muted text-muted-foreground border-border';
  };

  const getStageLabel = (stage: Candidate['stage']) => {
    const labels = {
      applied: 'Applied',
      screen: 'Screening',
      tech: 'Technical',
      offer: 'Offer',
      hired: 'Hired',
      rejected: 'Rejected'
    };
    return labels[stage] || stage;
  };

  return (
    <div
      ref={parentRef}
      className="h-[calc(100vh-280px)] overflow-auto"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const candidate = candidates[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <Card className="group hover:shadow-md transition-all duration-200 mb-4">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {candidate.name}
                          </h3>
                          <Badge className={getStageColor(candidate.stage)}>
                            {getStageLabel(candidate.stage)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {candidate.email}
                          </div>
                          {candidate.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {candidate.phone}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Applied {new Date(candidate.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link to={`/candidates/${candidate.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                      </Link>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Candidate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Interview
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
