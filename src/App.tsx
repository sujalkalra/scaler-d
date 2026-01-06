import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Index from "./pages/Index";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import FeaturedArticles from "./pages/FeaturedArticles";
import Practice from "./pages/Practice";
import AIGenerator from "./pages/AIGenerator";
import Roadmap from "./pages/Roadmap";
import RoadmapArticle from "./pages/RoadmapArticle";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/:id" element={<ArticleDetail />} />
      <Route path="/featured-articles" element={<FeaturedArticles />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/ai-generator" element={<AIGenerator />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/roadmap/:slug" element={<RoadmapArticle />} />
      <Route path="/profile" element={<Profile />} />
      <Route 
        path="/auth" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Auth />} 
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
