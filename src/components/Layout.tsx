import { useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiLogOut,
  FiHome,
  FiPieChart,
  FiLink,
  FiTag
} from "react-icons/fi";

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navItems = [
    { path: "/app/dashboard", icon: <FiHome size={20} />, label: "Dashboard" },
    { path: "/app/analytics", icon: <FiPieChart size={20} />, label: "Analytics" },
    { path: "/app/url-analytics", icon: <FiLink size={20} />, label: "URL Analytics" },
    { path: "/app/topic-analytics", icon: <FiTag size={20} />, label: "Topic Analytics" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Using a softer purple */}
      <div
        className={`bg-violet-600 text-white h-screen transition-all duration-300 fixed ${
          isCollapsed ? "w-16" : "w-60"
        } z-20`}
      >
        <div className="p-4">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="w-full flex justify-end mt-4 mb-4 hover:text-violet-200 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <FiChevronRight size={24} /> : <FiChevronLeft size={24} />}
          </button>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-2 py-2 rounded-lg hover:bg-violet-500 transition-colors ${
                  isCollapsed ? "justify-center" : "justify-start"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <span className="flex-shrink-0 text-violet-100">{item.icon}</span>
                {!isCollapsed && (
                  <span className="ml-3 text-violet-50">{item.label}</span>
                )}
              </Link>
            ))}
            <button 
              onClick={handleLogout} 
              className={`text-rose-200 flex items-center px-2 py-2 rounded-lg hover:bg-violet-500 transition-colors w-full ${
                isCollapsed ? "justify-center" : "justify-start"
              }`}
              title={isCollapsed ? "Logout" : ""}
            >
              <FiLogOut size={20} />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-60"}`}>
        {/* Top Bar */}
        <div 
          className="bg-white text-violet-700 fixed top-0 h-16 flex items-center justify-center transition-all duration-300 shadow-sm"
          style={{
            left: isCollapsed ? "4rem" : "15rem",
            right: 0
          }}
        >
          <h1 className="text-lg font-bold">Custom URL Shortener</h1>
        </div>

        {/* Page Content */}
        <div className="mt-16 p-4 flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;