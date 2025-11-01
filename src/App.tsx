import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./contexts/DataContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import PageLoader from "./components/PageLoader";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Home from "./pages/Home";
import UpcomingActivities from "./pages/UpcomingActivities";
import ActivityDetail from "./pages/ActivityDetail";
import ActivityPhotos from "./pages/ActivityPhotos";
import PreviousActivities from "./pages/PreviousActivities";
import Winners from "./pages/Winners";
import WeeklyWinners from "./pages/WeeklyWinners";
import Gallery from "./pages/Gallery";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import StudentPerformance from "./pages/StudentPerformance";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PageLoader />;
  }

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
