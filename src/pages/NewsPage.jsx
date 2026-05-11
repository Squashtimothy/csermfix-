import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://resilient-balance-production-57f8.up.railway.app";

/* =========================
   FALLBACK IMAGE
========================= */

const noImage =
  "https://via.placeholder.com/400x200?text=No+Image";

export default function NewsPage() {
  const navigate =
    useNavigate();

  const [news, setNews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================
     FORMAT DATE
  ========================= */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date)
      .toLocaleDateString(
        "id-ID",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );
  };

  /* =========================
     IMAGE URL
  ========================= */

  const getImageUrl = (img) => {
    if (!img) return noImage;

    // full url
    if (img.startsWith("http")) {
      return img;
    }

    // /uploads/news/xxx.png
    if (img.startsWith("/uploads")) {
      return `${API_URL}${img}`;
    }

    // fallback
    return `${API_URL}/uploads/news/${img}`;
  };

  /* =========================
     FETCH NEWS
  ========================= */

  useEffect(() => {
    const fetchNews =
      async () => {
        try {
          const response =
            await fetch(
              `${API_URL}/api/news/published`
            );

          const data =
            await response.json();

          console.log(
            "NEWS:",
            data
          );

          // support multiple format
          const newsData =
            data.data || data;

          if (
            Array.isArray(newsData)
          ) {
            setNews(newsData);
          } else {
            setNews([]);
          }
        } catch (err) {
          console.error(
            "NEWS ERROR:",
            err
          );
        } finally {
          setLoading(false);
        }
      };

    fetchNews();
  }, []);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="text-center py-10">
        Loading...
      </div>
    );
  }

  return (
    <section
      id="news"
      className="py-16 bg-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4">

        {/* TITLE */}

        <h2 className="text-4xl font-bold text-center text-green-700 mb-12">
          RECENT NEWS
        </h2>

        {/* EMPTY */}

        {news.length === 0 ? (
          <p className="text-center text-gray-500">
            News tidak ditemukan
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">

            {news.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
                onClick={() =>
                  navigate(
                    `/news/${item.id}`
                  )
                }
              >

                {/* IMAGE */}

                <img
                  src={getImageUrl(
                    item.image
                  )}
                  alt={
                    item.title
                  }
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    e.target.src =
                      noImage;
                  }}
                />

                {/* CONTENT */}

                <div className="p-5">

                  <p className="text-sm text-gray-400 mb-2">
                    {formatDate(
                      item.created_at
                    )}
                  </p>

                  <h3 className="text-xl font-bold mb-3 line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 line-clamp-3">
                    {item.content}
                  </p>

                  <button className="mt-5 text-green-700 font-semibold hover:underline">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}