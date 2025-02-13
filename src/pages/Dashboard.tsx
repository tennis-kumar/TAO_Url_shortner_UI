import { useEffect, useState } from "react";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? <p>Welcome, {user.email}</p> : <p>Loading user data...</p>}
    </div>
  );
};

export default Dashboard;
