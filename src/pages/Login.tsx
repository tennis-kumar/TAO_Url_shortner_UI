import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the JWT token
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          console.log("Token expired. Redirecting to login.");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          navigate("/app/dashboard");
        }
      } catch (error) {
        console.error("Invalid token. Clearing storage.");
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  }, [navigate]);

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to the URL Shortener</h1>
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;
