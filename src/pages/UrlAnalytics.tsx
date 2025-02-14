import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f", "#ff69b4"];

const TopicAnalyticsPage = () => {
  const [topic, setTopic] = useState("");
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopicAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/analytics/topic/${topic}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch topic analytics");
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      setError("Error fetching topic analytics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Topic Analytics</h1>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Enter Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="border p-2 rounded-md flex-1"
        />
        <button onClick={fetchTopicAnalytics} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Fetch Topic Analytics
        </button>
      </div>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {analyticsData && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Total Clicks: {analyticsData.totalClicks}</h2>
          <h2 className="text-lg font-semibold mb-2">URLs under this topic:</h2>
          <ul className="mb-4">
            {analyticsData.urls.map((url: any, index: number) => (
              <li key={index} className="text-blue-600 underline">{url.shortUrl} - {url.totalClicks} Clicks</li>
            ))}
          </ul>

          {/* Responsive Grid for Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white shadow-lg p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Clicks Per URL</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.urls}>
                  <XAxis dataKey="shortUrl" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalClicks" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white shadow-lg p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Click Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.urls}
                    dataKey="totalClicks"
                    nameKey="shortUrl"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {analyticsData.urls.map((_: any, index: number) => (
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
      )}
    </div>
  );
};

const UrlAnalyticsPage = () => {
  const [urlInput, setUrlInput] = useState("");
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUrlAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/analytics/url/${encodeURIComponent(urlInput)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch URL analytics");
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      setError("Error fetching URL analytics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">URL Analytics</h1>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Enter Short URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="border p-2 rounded-md flex-1"
        />
        <button onClick={fetchUrlAnalytics} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Fetch URL Analytics
        </button>
      </div>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {analyticsData && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Total Clicks: {analyticsData.totalClicks}</h2>
          <h2 className="text-lg font-semibold mb-2">Unique Users: {analyticsData.uniqueUsers}</h2>

          {/* Responsive Grid for Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Line Chart */}
            <div className="bg-white shadow-lg p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Clicks Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={Object.entries(analyticsData.clicksByDate).map(([date, count]) => ({ date, count }))}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white shadow-lg p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">OS Type Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(analyticsData.osType).map(([os, count]) => ({ name: os, value: count }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {Object.entries(analyticsData.osType).map(([_, __], index) => (
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
      )}
    </div>
  );
};

export { TopicAnalyticsPage, UrlAnalyticsPage };
