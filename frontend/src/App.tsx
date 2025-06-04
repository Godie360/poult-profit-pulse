
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/layouts/DashboardLayout";
import NotFound from "./pages/NotFound";
import Pens from "./pages/dashboard/Pens";
import Records from "./pages/dashboard/Records";
import Reports from "./pages/dashboard/Reports";
import Team from "./pages/Team";
import PoultryWorker from "./pages/PoultryWorker";
import VetDashboard from "./pages/VetDashboard";
import VetList from "./pages/VetList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="pens" element={<Pens />} />
            <Route path="records" element={<Records />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Team Management Route */}
          <Route path="/team" element={<DashboardLayout />}>
            <Route index element={<Team />} />
          </Route>

          {/* Role-specific Routes */}
          <Route path="/worker" element={<DashboardLayout />}>
            <Route index element={<PoultryWorker />} />
            <Route path="vets" element={<VetList />} />
          </Route>

          <Route path="/vet" element={<DashboardLayout />}>
            <Route index element={<VetDashboard />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
