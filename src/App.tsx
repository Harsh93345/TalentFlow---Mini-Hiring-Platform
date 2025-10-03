// import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { useEffect } from "react";
import { enableMocking } from "./lib/mswSetup";
import { checkAndSeedDatabase } from "./lib/seedData";

// Pages
import Dashboard from "./pages/Dashboard.tsx";
import JobsPage from "./pages/JobsPage.tsx";
import JobDetailsPage from "./pages/JobDetailsPage.tsx";
import CandidatesPage from "./pages/CandidatesPage.tsx";
import CandidateDetailsPage from "./pages/CandidateDetailsPage.tsx";
import AssessmentsPage from "./pages/AssessmentsPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const initializeApp = async () => {
      // Enable MSW for API mocking
      await enableMocking();
      
      // Check and seed database if needed
      await checkAndSeedDatabase();
    };

    initializeApp();
  }, []);

  return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* <Toaster /> */}
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="jobs" element={<JobsPage />} />
                <Route path="jobs/:jobId" element={<JobDetailsPage />} />
                <Route path="candidates" element={<CandidatesPage />} />
                <Route path="candidates/:id" element={<CandidateDetailsPage />} />
                <Route path="assessments" element={<AssessmentsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    
  );
};

export default App;