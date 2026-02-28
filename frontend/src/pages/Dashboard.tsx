import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
import { 
  Users, 
  Briefcase, 
  ClipboardList, 
  TrendingUp, 
  Plus,
  Calendar,
  Clock,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCandidates: 0,
    totalAssessments: 0,
    activeJobs: 0
  });

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const [jobsRes, candidatesRes] = await Promise.all([
          fetch('/api/jobs?pageSize=1000'),
          fetch('/api/candidates?pageSize=1000')
        ]);

        const jobsData = await jobsRes.json();
        const candidatesData = await candidatesRes.json();

        setStats({
          totalJobs: jobsData.total,
          totalCandidates: candidatesData.total,
          totalAssessments: 3, // Static for now
          activeJobs: jobsData.data.filter((job: any) => job.status === 'active').length
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      change: '+12%',
      icon: Briefcase,
      color: 'text-primary',
      bgColor: 'bg-primary-light'
    },
    {
      title: 'Active Candidates',
      value: stats.totalCandidates,
      change: '+8%',
      icon: Users,
      color: 'text-accent',
      bgColor: 'bg-accent-light'
    },
    {
      title: 'Assessments',
      value: stats.totalAssessments,
      change: '+3%',
      icon: ClipboardList,
      color: 'text-warning',
      bgColor: 'bg-warning-light'
    },
    {
      title: 'Open Positions',
      value: stats.activeJobs,
      change: '+5%',
      icon: Target,
      color: 'text-success',
      bgColor: 'bg-success-light'
    }
  ];

  const quickActions = [
    {
      title: 'Post New Job',
      description: 'Create a new job posting',
      icon: Plus,
      href: '/jobs?action=create',
      color: 'bg-primary hover:bg-primary-hover'
    },
    {
      title: 'Review Candidates',
      description: 'Review pending applications',
      icon: Users,
      href: '/candidates?stage=screen',
      color: 'bg-accent hover:bg-accent'
    },
    {
      title: 'Schedule Interviews',
      description: 'Manage upcoming interviews',
      icon: Calendar,
      href: '/candidates?stage=tech',
      color: 'bg-warning hover:bg-warning'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your hiring pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-3 h-3 text-success" />
                      <span className="text-xs text-success font-medium">
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        from last month
                      </span>
                    </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Link to={action.href}>
                    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className={`p-3 rounded-full ${action.color} text-white group-hover:scale-110 transition-transform`}>
                            <action.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: 'New candidate applied',
                  details: 'Sarah Johnson → Senior Frontend Developer',
                  time: '2 minutes ago',
                  type: 'candidate'
                },
                {
                  action: 'Interview scheduled',
                  details: 'Mike Chen → Technical Interview',
                  time: '1 hour ago',
                  type: 'interview'
                },
                {
                  action: 'Job published',
                  details: 'Senior Backend Engineer position',
                  time: '3 hours ago',
                  type: 'job'
                },
                {
                  action: 'Assessment completed',
                  details: 'Frontend Developer Assessment',
                  time: '5 hours ago',
                  type: 'assessment'
                }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.details}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;