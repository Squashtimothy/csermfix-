import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [news, setNews] = useState(null);
  const [latestNews, setLatestNews] = useState([]);

  // ======================
  // FORMAT DATE
  // ======================
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ======================
  // HANDLE IMAGE
  // ======================
  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/400x200?text=No+Image";

    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads")) return `${API_URL}${img}`;

    return `${API_URL}/uploads/${img}`;
  };

  // ======================
  // FETCH DATA
  // ======================
  useEffect(() => {
    // fetch detail
    fetch(`${API_URL}/api/news/${id}`)
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch((err) => console.error("Error fetching detail:", err));

    // fetch latest
    fetch(`${API_URL}/api/news`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((n) => n.id !== Number(id));
        setLatestNews(filtered.slice(0, 5));
      })
      .catch((err) => console.error("Error fetching latest:", err));
  }, [id]);

  if (!news) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        
        {/* ================= MAIN CONTENT ================= */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate("/news")}
            className="text-green-600 mb-4 hover:underline"
          >
            ← Back
          </button>

          {/* IMAGE */}
          <img
            src={getImageUrl(news.image)}
            alt={news.title || "news image"}
            className="w-full h-[350px] object-cover rounded-lg mb-4"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/800x400?text=No+Image";
            }}
          />

          {/* TITLE */}
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {news.title}
          </h1>

          {/* META */}
          <p className="text-sm text-gray-500 mb-4">
            {formatDate(news.created_at)} • Admin
          </p>

          {/* CONTENT */}
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
            {news.content}
          </p>
        </div>

        {/* ================= SIDEBAR ================= */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold text-lg mb-3 border-b pb-2">
              Latest News
            </h2>

            {latestNews.length === 0 ? (
              <p className="text-gray-400 text-sm">No news available</p>
            ) : (
              latestNews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/news/${item.id}`)}
                  className="flex gap-3 mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  {/* SIDEBAR IMAGE */}
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title || "news thumbnail"}
                    className="w-20 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/100x80?text=No+Image";
                    }}
                  />

                  <div>
                    <p className="text-sm font-medium line-clamp-2">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* OPTIONAL WIDGET */}
          <div className="bg-white p-4 rounded-xl shadow text-center text-gray-400">
            Advertisement / Widget Space
          </div>
        </div>
      </div>
    </div>
  );
}