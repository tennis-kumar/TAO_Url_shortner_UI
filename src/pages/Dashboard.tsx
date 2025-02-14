import { useState, useEffect } from "react";

const Dashboard = () => {
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [topic, setTopic] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    fetchUrlsByTopic();
  }, []);

  const token = localStorage.getItem("token");

  // Fetch URLs by topic
  const fetchUrlsByTopic = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user/urls", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setUrls(data.urls || []);
      else throw new Error(data.message || "Failed to fetch URLs");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle URL Shortening
  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      const response = await fetch("http://localhost:5000/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ longUrl, customAlias, topic }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      setShortUrl(`${window.location.origin}/${data.shortUrl}`);
      fetchUrlsByTopic(); // Refresh URL list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a URL
  const handleDelete = async (shortUrl: string) => {
    if (!window.confirm("Are you sure you want to delete this URL?")) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/shorten/${shortUrl}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete URL");
      setUrls(urls.filter((url) => url.shortUrl !== shortUrl));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Shorten a URL</h2>
      <form onSubmit={handleShorten} className="space-y-4">
        <input
          type="url"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Custom Alias (optional)"
          value={customAlias}
          onChange={(e) => setCustomAlias(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Topic (optional)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {shortUrl && (
        <p className="mt-4">
          Shortened URL:{" "}
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {shortUrl}
          </a>
        </p>
      )}

      <h2 className="text-xl font-semibold mt-8">Your Shortened URLs</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Short URL</th>
              <th className="border p-2">Long URL</th>
              <th className="border p-2">Topic</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {urls.length > 0 ? (
              urls.map((url) => (
                <tr key={url.shortUrl} className="border-t">
                  <td className="border p-2">
                    <a
                      href={`http://localhost:5000/api/shorten/${url.shortUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800 hover:scale-105 transition duration-150 cursor-pointer"
                    >
                      {url.shortUrl}
                    </a>
                  </td>
                  <td className="border p-2">{url.longUrl}</td>
                  <td className="border p-2">{url.topic || "N/A"}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(url)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 transition transform hover:scale-105 hover:bg-yellow-600 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(url.shortUrl)}
                      className="bg-red-500 text-white px-2 py-1 rounded transition transform hover:scale-105 hover:bg-red-600 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No URLs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
