import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AuthSuccess from "./pages/AuthSuccess";
import AnalyticsPage from "./pages/Analytics";
import { TopicAnalyticsPage, UrlAnalyticsPage } from "./pages/UrlAnalytics";


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth-success" element={<AuthSuccess />}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/analytics/topic" element={<TopicAnalyticsPage />} /> 
        <Route path="/analytics/url" element={<UrlAnalyticsPage />} /> 
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
