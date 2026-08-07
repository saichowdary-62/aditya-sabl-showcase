import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./contexts/DataContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import React, { Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import PageLoader from "./components/PageLoader";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

// Lazy load pages for code splitting
const Home = React.lazy(() => import("./pages/Home"));
const UpcomingActivities = React.lazy(() => import("./pages/UpcomingActivities"));
const ActivityDetail = React.lazy(() => import("./pages/ActivityDetail"));
const ActivityPhotos = React.lazy(() => import("./pages/ActivityPhotos"));
const PreviousActivities = React.lazy(() => import("./pages/PreviousActivities"));
const Winners = React.lazy(() => import("./pages/Winners"));
const WeeklyWinners = React.lazy(() => import("./pages/WeeklyWinners"));
const Gallery = React.lazy(() => import("./pages/Gallery"));
const Admin = React.lazy(() => import("./pages/Admin"));
const AdminLogin = React.lazy(() => import("./pages/AdminLogin"));
const StudentPerformance = React.lazy(() => import("./pages/StudentPerformance"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Register = React.lazy(() => import("./pages/Register"));
const About = React.lazy(() => import("./pages/About"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AdminAuthProvider>
            <DataProvider>
              <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/upcoming" element={<UpcomingActivities />} />
                      <Route path="/activity/:id" element={<ActivityDetail />} />
                      <Route path="/activity/:id/photos" element={<ActivityPhotos />} />
                      <Route path="/previous" element={<PreviousActivities />} />
                      <Route path="/winners" element={<Winners />} />
                      <Route path="/weekly-winners" element={<WeeklyWinners />} />
                      <Route path="/gallery" element={<Gallery />} />
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/admin" element={
                        <ProtectedAdminRoute>
                          <Admin />
                        </ProtectedAdminRoute>
                      } />
                      <Route path="/performance" element={<StudentPerformance />} />
                      <Route path="/register/:id" element={<Register />} />
                      <Route path="/about" element={<About />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </DataProvider>
          </AdminAuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
