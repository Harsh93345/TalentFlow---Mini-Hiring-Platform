import { useState, useEffect} from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, Plus, Eye, Edit, BarChart3, Users, Calendar, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AssessmentBuilder } from '@/components/assessments/AssessmentBuilder';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AssessmentForm } from './AssessmentResponsePage';
import { db, type Assessment } from '@/lib/database';


const AssessmentsPage = () => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [previewAssessmentId, setPreviewAssessmentId] = useState<string | null>(null);
//   // Mock data for assessments
//   const assessments = [
//     {
//       id: '1',
//       title: 'Frontend Developer Assessment',
//       description: 'Comprehensive assessment for frontend development skills',
//       sections: 2,
//       questions: 15,
//       completions: 42,
//       averageScore: 78,
//       createdAt: new Date('2024-01-15'),
//       isActive: true
//     },
//     {
//       id: '2',
//       title: 'Backend Developer Assessment',
//       description: 'Assessment focusing on server-side development and system design',
//       sections: 3,
//       questions: 22,
//       completions: 28,
//       averageScore: 85,
//       createdAt: new Date('2024-01-10'),
//       isActive: true
//     },
//     {
//       id: '3',
//       title: 'Product Manager Assessment',
//       description: 'Assessment for product management skills and strategic thinking',
//       sections: 2,
//       questions: 18,
//       completions: 15,
//       averageScore: 72,
//       createdAt: new Date('2024-01-05'),
//       isActive: false
//     }
//   ];
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchAssessments = async () => {
        const data = await db.assessments.toArray();
        setAssessments(data);
        setLoading(false);
    };

    fetchAssessments();
    }, []);
    const selectedAssessment:any = assessments.find(a => a.id === previewAssessmentId);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading assessments...</p>;
  }
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assessments</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage job-specific assessments
          </p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary-hover"
          onClick={() => {
            setSelectedJobId('job-1');
            setShowBuilder(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Assessment
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Assessments',
            value: '3',
            change: '+1 this month',
            icon: ClipboardList,
            color: 'text-primary',
            bgColor: 'bg-primary-light'
          },
          {
            title: 'Total Completions',
            value: '85',
            change: '+12 this week',
            icon: CheckCircle,
            color: 'text-success',
            bgColor: 'bg-success-light'
          },
          {
            title: 'Average Score',
            value: '78%',
            change: '+3% vs last month',
            icon: BarChart3,
            color: 'text-accent',
            bgColor: 'bg-accent-light'
          },
          {
            title: 'Active Candidates',
            value: '24',
            change: 'Currently taking assessments',
            icon: Users,
            color: 'text-warning',
            bgColor: 'bg-warning-light'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Assessments List */}
      <div className="space-y-4">
        {assessments.map((assessment, index) => (
          <motion.div
            key={assessment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Card className="group hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {assessment.title}
                      </h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assessment.isActive 
                          ? 'bg-success-light text-success' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {assessment.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">
                      {assessment.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-muted-foreground" />
                        <span>{assessment.sections.length} sections</span>
                      </div>
                      {/* <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <span>{assessment.sections.question} questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{assessment.completions} completions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        <span>{assessment.averageScore}% avg score</span>
                      </div> */}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Created {assessment.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-6">
                    <Button variant="outline" size="sm" onClick={() => setPreviewAssessmentId(assessment.id)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Results
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={showBuilder} onOpenChange={setShowBuilder}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assessment Builder</DialogTitle>
          </DialogHeader>
          {selectedJobId && (
            <AssessmentBuilder jobId={selectedJobId} />
          )}
        </DialogContent>
      </Dialog>

        <Dialog open={!!previewAssessmentId} onOpenChange={() => setPreviewAssessmentId(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Live Assessment Preview</DialogTitle>
                </DialogHeader>
                {previewAssessmentId && (
                <AssessmentForm assessment={selectedAssessment} setPreviewAssessmentId={setPreviewAssessmentId}/>
                )}
        </DialogContent>
        </Dialog>
    </div>
  );
};

export default AssessmentsPage;