import { useState, useEffect, FormEvent, useCallback, useMemo } from "react";
import { UrlService } from "../services/urlService";
import type { Url } from "../services/types";
import debounce from "lodash/debounce";

const Dashboard = () => {
  // Form state
  const [formData, setFormData] = useState({
    longUrl: "",
    customAlias: "",
    topic: "",
  });

  // App state
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [editingUrl, setEditingUrl] = useState<Url | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch URLs on mount
  useEffect(() => {
    fetchUrls();
  }, []);

  // Auto-hide notification
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // Memoized filtered URLs
  const filteredUrls = useMemo(() => {
    if (!searchTerm) return urls;
    const lowerSearch = searchTerm.toLowerCase();
    return urls.filter(
      (url) =>
        url.longUrl.toLowerCase().includes(lowerSearch) ||
        url.shortUrl.toLowerCase().includes(lowerSearch) ||
        url.topic?.toLowerCase().includes(lowerSearch)
    );
  }, [urls, searchTerm]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((term: string) => setSearchTerm(term), 300),
    []
  );

  const showNotificationMessage = (
    message: string,
    success: boolean = true
  ) => {
    setNotificationMessage(message);
    setIsSuccess(success);
    setShowNotification(true);
  };

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const fetchedUrls = await UrlService.fetchUrls(token);
      setUrls(fetchedUrls);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (editingUrl) {
        // Prepare update data
        const updates = Object.entries(formData).reduce((acc, [key, value]) => {
          if (value !== editingUrl[key as keyof Url]) {
            acc[key as keyof Url] = value;
          }
          return acc;
        }, {} as Record<string, string>);

        if (Object.keys(updates).length === 0) {
          showNotificationMessage(
            "Please make some changes before updating.",
            false
          );
          return;
        }

        await UrlService.updateUrl(token, editingUrl.shortUrl, updates);
        showNotificationMessage("URL updated successfully");
      } else {
        const shortUrl = await UrlService.createShortUrl(token, formData);
        showNotificationMessage(
          `URL shortened: ${window.location.origin}/${shortUrl}`
        );
      }

      // Reset form and refresh URLs
      resetForm();
      fetchUrls();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (shortUrl: string) => {
    if (!window.confirm("Are you sure you want to delete this URL?")) return;

    try {
      setLoading(true);
      await UrlService.deleteUrl(token, shortUrl);
      setUrls((prev) => prev.filter((url) => url.shortUrl !== shortUrl));
      showNotificationMessage("URL deleted successfully");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (url: Url) => {
    setFormData({
      longUrl: url.longUrl,
      customAlias: url.customAlias || "",
      topic: url.topic || "",
    });
    setEditingUrl(url);
  };

  const resetForm = () => {
    setFormData({ longUrl: "", customAlias: "", topic: "" });
    setEditingUrl(null);
    setError("");
  };

  const handleError = (err: unknown) => {
    const message = err instanceof Error ? err.message : "An error occurred";
    setError(message);
    showNotificationMessage(message, false);
  };

  const handleRedirect = (shortUrl: string) => {
    window.open(`http://localhost:5000/api/shorten/${shortUrl}?t=${Date.now()}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      {/* Notification */}
      {showNotification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded shadow-lg ${
            isSuccess ? "bg-green-500" : "bg-red-500"
          } text-white transition-opacity duration-300`}
        >
          {notificationMessage}
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">
        {editingUrl ? "Edit URL" : "Shorten a URL"}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="url"
          name="longUrl"
          placeholder="Enter long URL"
          value={formData.longUrl}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="customAlias"
          placeholder="Custom Alias (optional)"
          value={formData.customAlias}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="topic"
          placeholder="Topic (optional)"
          value={formData.topic}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : editingUrl
              ? "Update URL"
              : "Shorten URL"}
          </button>
          {editingUrl && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Shortened URLs</h2>
          <input
            type="search"
            placeholder="Search URLs..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="max-w-xs p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
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
              {filteredUrls.length > 0 ? (
                filteredUrls.map((url) => (
                  <tr key={url.shortUrl} className="border-t hover:bg-gray-50">
                    <td
                      className="border p-2 max-w-md truncate"
                      title={url.shortUrl}
                    >
                      {/* <a
                        href={`http://localhost:5000/api/shorten/${url.shortUrl}?t=${Date.now()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800 transition-colors duration-150"
                      >
                        {url.shortUrl}
                      </a> */}
                      {/* <button
                        onClick={() => handleRedirect(url.shortUrl)}
                        className="text-blue-600 hover:underline"
                      >
                        {url.shortUrl}
                      </button> */}

                      {url.shortUrl}
                    </td>
                    <td
                      className="border p-2 max-w-md truncate"
                      title={url.longUrl}
                    >
                      {url.longUrl}
                    </td>
                    <td className="border p-2">{url.topic || "N/A"}</td>
                    <td className="border p-2 content-center">
                      <button
                        onClick={() => handleEdit(url)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 transition-colors duration-150"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(url.shortUrl)}
                        className="bg-red-500 text-white px-2 py-1 rounded mr-2 hover:bg-red-600 transition-colors duration-150"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleRedirect(url.shortUrl)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-150"
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-4">
                    {loading ? "Loading..." : "No URLs found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
