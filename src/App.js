import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// PROTECTED
import ProtectedRoute from "./components/ProtectedRoute";

// LAYOUTS
import AdminLayout from "./layouts/adminLayout";
import SuperAdminLayout from "./layouts/SuperAdminLayout";

// PUBLIC PAGES
import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import NewsDetail from "./pages/NewsDetail"; // ✅ TAMBAH INI
import LoginPage from "./pages/LoginPage";
import ContactUsPage from "./pages/ContactUsPage";
import OurTeamPage from "./pages/OurTeamPage";
import ProjectPage from "./pages/ProjectPage";
import PublicationPage from "./pages/PublicationPage";

// ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";
import NewsManagement from "./pages/admin/NewsManagement";
import TeamsManagement from "./pages/admin/TeamsManagement";
import PublicationManagement from "./pages/admin/PublicationManagement";
import HomepageManagement from "./pages/admin/HomepageManagement";
import HeroSliderManagement from "./pages/admin/HeroSliderManagement";
import VisionMissionManagement from "./pages/admin/VisionMissionManagement";
import ProjectManagement from "./pages/admin/ProjectManagement";
import AimsManagement from "./pages/admin/AimsManagement";

// SUPER ADMIN
import SuperAdminDashboard from "./pages/superAdmin/SuperAdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== PUBLIC ===== */}
        <Route path="/" element={<HomePage />} />

        {/* NEWS */}
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetail />} /> {/* ✅ FIX UTAMA */}

        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/team" element={<OurTeamPage />} />
        <Route path="/project" element={<ProjectPage />} />

        {/* PUBLICATIONS */}
        <Route path="/publications" element={<PublicationPage />} />
        <Route
          path="/publication"
          element={<Navigate to="/publications" replace />}
        />

        <Route path="/login" element={<LoginPage />} />

        {/* ===== ADMIN ===== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="news" element={<NewsManagement />} />
          <Route path="teams" element={<TeamsManagement />} />
          <Route path="publications" element={<PublicationManagement />} />
          <Route path="homepage" element={<HomepageManagement />} />
          <Route path="hero" element={<HeroSliderManagement />} />
          <Route path="aims" element={<AimsManagement />} />
          <Route path="vision-mission" element={<VisionMissionManagement />} />
          <Route path="projects" element={<ProjectManagement />} />
        </Route>

        {/* ===== SUPER ADMIN ===== */}
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute role="superadmin">
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="teams" element={<TeamsManagement />} />
          <Route path="publications" element={<PublicationManagement />} />
        </Route>

        {/* ===== 404 ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}