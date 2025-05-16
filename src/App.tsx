
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RoleProvider } from "./contexts/RoleContext";
import { RoleBasedRoute } from "./components/roles/RoleBasedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile"; 
import Employees from "./pages/Employees";
import AttendancePage from "./pages/Attendance";
import LeaveManagement from "./pages/LeaveManagement";
import Payroll from "./pages/Payroll";
import ISP from "./pages/ISP";
import ISPSettings from "./pages/ISPSettings";
import Documents from "./pages/Documents";
import RolesPermissions from "./pages/RolesPermissions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RoleProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Protected routes with role-based access */}
              <Route path="/dashboard" element={<RoleBasedRoute path="/dashboard" />}>
                <Route index element={<Dashboard />} />
              </Route>
              
              <Route path="/profile" element={<RoleBasedRoute path="/profile" />}>
                <Route index element={<Profile />} />
              </Route>
              
              <Route path="/employees" element={<RoleBasedRoute path="/employees" />}>
                <Route index element={<Employees />} />
              </Route>
              
              <Route path="/attendance" element={<RoleBasedRoute path="/attendance" />}>
                <Route index element={<AttendancePage />} />
              </Route>
              
              <Route path="/leave" element={<RoleBasedRoute path="/leave" />}>
                <Route index element={<LeaveManagement />} />
              </Route>
              
              <Route path="/payroll" element={<RoleBasedRoute path="/payroll" />}>
                <Route index element={<Payroll />} />
              </Route>
              
              <Route path="/isp" element={<RoleBasedRoute path="/isp" />}>
                <Route index element={<ISP />} />
              </Route>
              
              <Route path="/isp/settings" element={<RoleBasedRoute path="/isp/settings" />}>
                <Route index element={<ISPSettings />} />
              </Route>
              
              <Route path="/documents" element={<RoleBasedRoute path="/documents" />}>
                <Route index element={<Documents />} />
              </Route>
              
              <Route path="/roles-permissions" element={<RoleBasedRoute path="/roles-permissions" />}>
                <Route index element={<RolesPermissions />} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RoleProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
