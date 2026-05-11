import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://resilient-balance-production-57f8.up.railway.app";

/* =========================
   FALLBACK IMAGE
========================= */

const noImage =
  "https://via.placeholder.com/400x200?text=No+Image";

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [news, setNews] = useState(null);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     FORMAT DATE
  ========================= */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  /* =========================
     HANDLE IMAGE URL
  ========================= */

  const getImageUrl = (img) => {
    if (!img) return noImage;

    // kalau sudah full url
    if (img.startsWith("http")) {
      return img;
    }

    // kalau path uploads
    if (img.startsWith("/uploads")) {
      return `${API_URL}${img}`;
    }

    return `${API_URL}/uploads/${img}`;
  };

  /* =========================
     FETCH DETAIL
  ========================= */

  const fetchDetail = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/news/${id}`
      );

      const data = await response.json();

      console.log("DETAIL:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed fetch detail"
        );
      }

      setNews(data);
    } catch (err) {
      console.error("DETAIL ERROR:", err);
      setError(err.message);
    }
  }, [id]);

  /* =========================
     FETCH LATEST
  ========================= */

  const fetchLatest = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/news`
      );

      const data = await response.json();

      console.log("LATEST:", data);

      if (!Array.isArray(data)) {
        setLatestNews([]);
        return;
      }

      const filtered = data.filter(
        (item) => item.id !== Number(id)
      );

      setLatestNews(filtered.slice(0, 5));
    } catch (err) {
      console.error("LATEST ERROR:", err);
    }
  }, [id]);

  /* =========================
     USE EFFECT
  ========================= */

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      await fetchDetail();
      await fetchLatest();

      setLoading(false);
    };

    fetchAll();
  }, [fetchDetail, fetchLatest]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="text-center p-10">
        Loading...
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <div className="text-center p-10 text-red-500">
        {error}
      </div>
    );
  }

  /* =========================
     NOT FOUND
  ========================= */

  if (!news) {
    return (
      <div className="text-center p-10">
        News tidak ditemukan
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">

        {/* ================= MAIN CONTENT ================= */}

        <div className="md:col-span-2 bg-white rounded-2xl shadow p-6">

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate("/#news")}
            className="text-green-600 mb-5 hover:underline"
          >
            ← Back
          </button>

          {/* IMAGE */}
          <img
            src={getImageUrl(news.image)}
            alt={news.title || "news image"}
            className="w-full h-[400px] object-cover rounded-xl mb-5"
            onError={(e) => {
              e.target.src = noImage;
            }}
          />

          {/* TITLE */}
          <h1 className="text-3xl font-bold mb-3">
            {news.title}
          </h1>

          {/* META */}
          <p className="text-gray-500 text-sm mb-6">
            {formatDate(news.created_at)} • Admin
          </p>

          {/* CONTENT */}
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {news.content}
          </div>
        </div>

        {/* ================= SIDEBAR ================= */}

        <div className="space-y-5">

          {/* LATEST NEWS */}
          <div className="bg-white rounded-2xl shadow p-5">

            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              Latest News
            </h2>

            {latestNews.length === 0 ? (
              <p className="text-gray-400 text-sm">
                Tidak ada news
              </p>
            ) : (
              latestNews.map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    navigate(`/news/${item.id}`)
                  }
                  className="flex gap-3 mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                >

                  {/* SIDEBAR IMAGE */}
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title || "news"}
                    className="w-24 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = noImage;
                    }}
                  />

                  {/* SIDEBAR CONTENT */}
                  <div className="flex-1">
                    <p className="font-semibold text-sm line-clamp-2">
                      {item.title}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* OPTIONAL WIDGET */}
          <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-400">
            Advertisement / Widget Space
          </div>
        </div>
      </div>
    </div>
  );
}