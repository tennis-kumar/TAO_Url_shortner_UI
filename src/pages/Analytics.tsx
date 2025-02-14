import { useState, useEffect } from "react";

interface ClickByDate {
  date: string;
  count: number;
}

interface OsType {
  osName: string;
  uniqueClicks: number;
  uniqueUsers: number;
}

interface DeviceType {
  deviceName: string;
  uniqueClicks: number;
  uniqueUsers: number;
}

interface AnalyticsData {
  totalUrls: number;
  totalClicks: number;
  uniqueUsers: number;
  clicksByDate: ClickByDate[];
  osType: OsType[];
  deviceType: DeviceType[];
}

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token"); // Retrieve token from localStorage (or wherever it's stored)
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total URLs</h2>
          <p className="text-xl font-bold">{analyticsData.totalUrls}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Clicks</h2>
          <p className="text-xl font-bold">{analyticsData.totalClicks}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Unique Users</h2>
          <p className="text-xl font-bold">{analyticsData.uniqueUsers}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-6">Clicks by Date (Last 7 Days)</h2>
      {analyticsData.clicksByDate.length > 0 ? (
        <ul className="list-disc list-inside">
          {analyticsData.clicksByDate.map(({ date, count }) => (
            <li key={date}>
              <strong>{date}:</strong> {count} clicks
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No data available</p>
      )}

      <h2 className="text-xl font-semibold mt-6">OS Type Analytics</h2>
      {analyticsData.osType.length > 0 ? (
        <ul className="list-disc list-inside">
          {analyticsData.osType.map(({ osName, uniqueClicks, uniqueUsers }) => (
            <li key={osName}>
              <strong>{osName}:</strong> {uniqueClicks} clicks, {uniqueUsers} users
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No OS data available</p>
      )}

      <h2 className="text-xl font-semibold mt-6">Device Type Analytics</h2>
      {analyticsData.deviceType.length > 0 ? (
        <ul className="list-disc list-inside">
          {analyticsData.deviceType.map(({ deviceName, uniqueClicks, uniqueUsers }) => (
            <li key={deviceName}>
              <strong>{deviceName}:</strong> {uniqueClicks} clicks, {uniqueUsers} users
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No device data available</p>
      )}
    </div>
  );
};

export default AnalyticsPage;
