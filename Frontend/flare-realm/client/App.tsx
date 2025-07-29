import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Tracking from "./pages/Tracking";
import Login from "./pages/Login";
import Index from "./pages/Index";
import DriverDashboard from "./pages/DriverDashboard";
import DriverAcceptedRequest from "./pages/DriverAcceptedRequest";
import AdminDashboard from "./pages/AdminDashboard";
import BookingForm from "./pages/BookingForm";
import Profile from "./pages/Profile";
import FirstAid from "./pages/FirstAid";
import EmergencyContacts from "./pages/EmergencyContacts";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/index" element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
              <Index />
            </ProtectedRoute>
          } />
          <Route path="/booking" element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
              <BookingForm />
            </ProtectedRoute>
          } />
          <Route path="/tracking" element={
            <ProtectedRoute allowedRoles={["USER", "DRIVER", "ADMIN"]}>
              <Tracking />
            </ProtectedRoute>
          } />
          <Route path="/driver" element={
            <ProtectedRoute allowedRoles={["DRIVER", "ADMIN"]}>
              <DriverDashboard />
            </ProtectedRoute>
          } />
          <Route path="/driver/accepted" element={
            <ProtectedRoute allowedRoles={["DRIVER", "ADMIN"]}>
              <DriverAcceptedRequest />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={<Profile />} />
          <Route path="/first-aid" element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
              <FirstAid />
            </ProtectedRoute>
          } />
          <Route path="/emergency-contacts" element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
              <EmergencyContacts />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
