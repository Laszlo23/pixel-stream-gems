import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Web3Provider } from "@/providers/Web3Provider";
import Index from "./vite-pages/Index.tsx";
import LiveRoom from "./vite-pages/LiveRoom.tsx";
import NotFound from "./vite-pages/NotFound.tsx";
import CreatorDashboard from "./vite-pages/CreatorDashboard.tsx";
import FanProfile from "./vite-pages/FanProfile.tsx";
import CreatorPublicProfile from "./vite-pages/CreatorPublicProfile.tsx";
import Safety from "./vite-pages/Safety.tsx";
import Competitions from "./vite-pages/Competitions.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Web3Provider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/live/:id" element={<LiveRoom />} />
            <Route path="/u/:id" element={<CreatorPublicProfile />} />
            <Route path="/creator" element={<CreatorDashboard />} />
            <Route path="/profile" element={<FanProfile />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </Web3Provider>
  </QueryClientProvider>
);

export default App;
