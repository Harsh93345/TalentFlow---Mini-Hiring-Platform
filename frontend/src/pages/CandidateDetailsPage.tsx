import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  FileText,
  MessageSquare,
  Edit,
  Download,
  User,
  Clock
} from 'lucide-react';
import { type Candidate, type CandidateTimeline } from '@/lib/database';
import { motion } from 'framer-motion';

const CandidateDetailsPage = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [timeline, setTimeline] = useState<CandidateTimeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const [candidateRes, timelineRes] = await Promise.all([
          fetch(`/api/candidates/${id}`),
          fetch(`/api/candidates/${id}/timeline`)
        ]);
        
        if (!candidateRes.ok) {
          throw new Error('Candidate not found');
        }
        
        const candidateData = await candidateRes.json();
        const timelineData = await timelineRes.json();
        
        setCandidate(candidateData);
        setTimeline(timelineData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch candidate');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateDetails();
  }, [id]);

  const getStageColor = (stage: Candidate['stage']) => {
    const colors = {
      applied: 'bg-stage-applied/10 text-stage-applied border-stage-applied/20',
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

  const getTimelineIcon = (type: CandidateTimeline['type']) => {
    switch (type) {
      case 'stage_change':
        return <User className="w-4 h-4" />;
      case 'note_added':
        return <MessageSquare className="w-4 h-4" />;
      case 'assessment_completed':
        return <FileText className="w-4 h-4" />;
      case 'interview_scheduled':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-32 bg-muted rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 bg-muted rounded" />
            <div className="h-48 bg-muted rounded" />
            <div className="h-48 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive mb-4">
              {error || 'Candidate not found'}
            </p>
            <Link to="/candidates">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Candidates
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link to="/candidates">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{candidate.name}</h1>
          <p className="text-muted-foreground mt-1">
            Candidate Profile and Timeline
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </motion.div>

      {/* Candidate Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    {candidate.name}
                  </h2>
                  <Badge className={getStageColor(candidate.stage)}>
                    {getStageLabel(candidate.stage)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${candidate.email}`} className="hover:text-primary">
                      {candidate.email}
                    </a>
                  </div>
                  
                  {candidate.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${candidate.phone}`} className="hover:text-primary">
                        {candidate.phone}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Applied {new Date(candidate.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    Last updated {new Date(candidate.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Resume
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Portfolio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeline.length > 0 ? (
                timeline.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {getTimelineIcon(event.type)}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {event.description}
                      </p>
                      {event.fromStage && event.toStage && (
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {getStageLabel(event.fromStage as Candidate['stage'])}
                          </Badge>
                          <span className="text-muted-foreground text-xs">→</span>
                          <Badge variant="outline" className="text-xs">
                            {getStageLabel(event.toStage as Candidate['stage'])}
                          </Badge>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(event.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No timeline events yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CandidateDetailsPage;