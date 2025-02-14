import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface ClickByDate {
  date: string;
  count: number;
}

interface OsType {
  osName: string;
  uniqueClicks: number;
}

interface DeviceType {
  deviceName: string;
  uniqueClicks: number;
}

interface AnalyticsData {
  totalUrls: number;
  totalClicks: number;
  uniqueUsers: number;
  clicksByDate: ClickByDate[];
  osType: OsType[];
  deviceType: DeviceType[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFF", "#FF6666"];

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/analytics/overall", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch analytics: ${response.statusText}`);
        }

        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        setError("Error fetching analytics data");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) return <div className="text-center p-4">Loading analytics...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!analyticsData) return <div className="text-center text-gray-500">No analytics data available</div>;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Analytics Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-6 rounded-lg text-center shadow-md">
          <h2 className="text-lg font-semibold">Total URLs</h2>
          <p className="text-2xl font-bold">{analyticsData.totalUrls}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg text-center shadow-md">
          <h2 className="text-lg font-semibold">Total Clicks</h2>
          <p className="text-2xl font-bold">{analyticsData.totalClicks}</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg text-center shadow-md">
          <h2 className="text-lg font-semibold">Unique Users</h2>
          <p className="text-2xl font-bold">{analyticsData.uniqueUsers}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Clicks by Date (Line Chart) */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold text-center">Clicks Over Time</h2>
          <div className="w-full h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.clicksByDate}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* OS Type Pie Chart */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold text-center">OS Distribution</h2>
          <div className="flex justify-center mt-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={analyticsData.osType} dataKey="uniqueClicks" nameKey="osName" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                  {analyticsData.osType.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Type Pie Chart */}
        <div className="md:col-span-2 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold text-center">Device Distribution</h2>
          <div className="flex justify-center mt-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={analyticsData.deviceType} dataKey="uniqueClicks" nameKey="deviceName" cx="50%" cy="50%" outerRadius={80} fill="#82ca9d">
                  {analyticsData.deviceType.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
