import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AuthSuccess from "./pages/AuthSuccess";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import { TopicAnalyticsPage, UrlAnalyticsPage } from "./pages/UrlAnalytics";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/auth-success" element={<AuthSuccess />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/app/dashboard" element={<Dashboard />} />
            <Route path="/app/analytics" element={<Analytics />} />
            <Route path="/app/url-analytics" element={<UrlAnalyticsPage />} />
            <Route path="/app/topic-analytics" element={<TopicAnalyticsPage />} />
          </Route>
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
