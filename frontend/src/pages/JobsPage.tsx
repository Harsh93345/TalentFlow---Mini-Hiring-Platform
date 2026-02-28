import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useJobsStore } from '@/stores/jobs-store.ts';
import { type Job } from '@/lib/database';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateJobDialog } from '@/components/jobs/CreateJobDialog';
import { DraggableJobList } from '@/components/jobs/DraggableJobList';
import { useToast } from '@/hooks/use-toast';

const JobsPage = () => {
  const {
    jobs,
    loading,
    error,
    filters,
    pagination,
    setJobs,
    setLoading,
    setError,
    updateFilters,
    setPagination,
    updateJob
  } = useJobsStore();
  const { toast } = useToast();
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search: filters.search,
        status: filters.status,
        page: filters.page.toString(),
        pageSize: filters.pageSize.toString(),
        sort: 'order'
      });
      console.log("PRINTING PARAMS: ",params);

      const response = await fetch(`/api/jobs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      
      const data = await response.json();
      setJobs(data.data);
      setError(null);
      setPagination({
        total: data.total,
        totalPages: data.totalPages
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleSearch = (value: string) => {
    updateFilters({ search: value, page: 1 });
  };

  const handleStatusFilter = (status: string) => {
    updateFilters({ status: status === 'all' ? '' : status, page: 1 });
  };

  const handleJobsReorder = (reorderedJobs: Job[]) => {
    setJobs(reorderedJobs);
  };

  const handleEdit = () => {
    toast({
      title: 'Edit Job',
      description: 'Edit functionality would open here'
    });
  };

  const handleArchive = async (job: Job) => {
    const newStatus = job.status === 'active' ? 'archived' : 'active';
    
    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      updateJob(job.id, { status: newStatus });
      toast({
        title: 'Job Updated',
        description: `Job ${newStatus === 'active' ? 'activated' : 'archived'} successfully`
      });
      
      fetchJobs();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update job status',
        variant: 'destructive'
      });
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">Error: {error}</p>
            <Button onClick={fetchJobs} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Jobs</h1>
          <p className="text-muted-foreground mt-1">
            Manage your job postings and track applications
          </p>
        </div>
        <CreateJobDialog onJobCreated={fetchJobs} />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search jobs..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            <Select value={filters.status || 'all'} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button> */}
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid with Drag-and-Drop */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <DraggableJobList
          jobs={jobs}
          onJobsReorder={handleJobsReorder}
          onEdit={handleEdit}
          onArchive={handleArchive}
        />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No jobs found</p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(filters.page - 1) * filters.pageSize + 1} to {Math.min(filters.page * filters.pageSize, pagination.total)} of {pagination.total} jobs
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => updateFilters({ page: filters.page - 1 })}
                  disabled={filters.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateFilters({ page: filters.page + 1 })}
                  disabled={filters.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobsPage;