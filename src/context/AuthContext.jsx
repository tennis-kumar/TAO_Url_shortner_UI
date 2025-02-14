import { createContext, useContext, useEffect, useState } from "react";

// Create Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      fetchUserDetails(token);
    }
  }, [token]);

  const fetchUserDetails = async (jwtToken) => {
    try {
      const res = await fetch("http://localhost:5000/auth/me", {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    }
  };

  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    fetchUserDetails(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Use Auth Context
export const useAuth = () => useContext(AuthContext);
