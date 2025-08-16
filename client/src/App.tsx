import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import BlogPage from "@/pages/blog";
import BlogPostPage from "@/pages/blog-post";
import NotFound from "@/pages/not-found";
import Impressum from "@/pages/impressum";
import Datenschutz from "@/pages/datenschutz";
import PerformanceMonitor from "@/components/seo/PerformanceMonitor";
import CookieManager from "@/components/cookies/CookieManager";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/impressum" component={Impressum} />
      <Route path="/datenschutz" component={Datenschutz} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PerformanceMonitor />
        <CookieManager />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
