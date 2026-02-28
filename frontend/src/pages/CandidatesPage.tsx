import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, List, LayoutGrid } from 'lucide-react';
import { useCandidatesStore } from '@/stores/candidate-store';
import { type Candidate } from '@/lib/database';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VirtualizedCandidateList } from '@/components/candidates/VirtualizedCandidateList';
import { KanbanBoard } from '@/components/candidates/KanbanBoard';

const CandidatesPage = () => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const {
    candidates,
    loading,
    error,
    filters,
    pagination,
    setCandidates,
    setLoading,
    setError,
    updateFilters,
    setPagination,
    moveCandidateStage
  } = useCandidatesStore();

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search: filters.search,
        stage: filters.stage,
        page: filters.page.toString(),
        pageSize: filters.pageSize.toString(),
      });

      const response = await fetch(`/api/candidates?${params}`);
      if (!response.ok) throw new Error('Failed to fetch candidates');
      
      const data = await response.json();
      setCandidates(data.data);
      setError(null);
      setPagination({
        total: data.total,
        totalPages: data.totalPages
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [filters]);

  const handleSearch = (value: string) => {
    updateFilters({ search: value, page: 1 });
  };

  const handleStageFilter = (stage: string) => {
    updateFilters({ stage: stage === 'all' ? '' : stage, page: 1 });
  };

  const handleCandidateMove = (candidateId: string, newStage: Candidate['stage']) => {
    moveCandidateStage(candidateId, newStage);
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">Error: {error}</p>
            <Button onClick={fetchCandidates} className="mt-4">
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
          <h1 className="text-3xl font-bold text-foreground">Candidates</h1>
          <p className="text-muted-foreground mt-1">
            Manage candidate applications and pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'kanban')}>
            <TabsList>
              <TabsTrigger value="list">
                <List className="w-4 h-4 mr-2" />
                List
              </TabsTrigger>
              <TabsTrigger value="kanban">
                <LayoutGrid className="w-4 h-4 mr-2" />
                Kanban
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {/* <Button className="bg-primary hover:bg-primary-hover">
            <Plus className="w-4 h-4 mr-2" />
            Add Candidate
          </Button> */}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search candidates..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            <Select value={filters.stage || 'all'} onValueChange={handleStageFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="screen">Screening</SelectItem>
                <SelectItem value="tech">Technical</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button> */}
          </div>
        </CardContent>
      </Card>

      {/* Candidates Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </div>
                  <div className="h-6 bg-muted rounded w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : viewMode === 'list' ? (
        <VirtualizedCandidateList candidates={candidates} />
      ) : (
        <KanbanBoard 
          candidates={candidates} 
          onCandidateMove={handleCandidateMove}
        />
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(filters.page - 1) * filters.pageSize + 1} to {Math.min(filters.page * filters.pageSize, pagination.total)} of {pagination.total} candidates
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

export default CandidatesPage;