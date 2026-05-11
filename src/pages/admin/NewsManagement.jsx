// src/pages/admin/NewsManagement.jsx

import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = (
  process.env.REACT_APP_API_URL ||
  "https://resilient-balance-production-57f8.up.railway.app"
).replace(/\/$/, "");

/* =========================================
   RESOLVE IMAGE
========================================= */

const resolveImage = (image) => {
  if (!image) {
    return "https://via.placeholder.com/400x200?text=No+Image";
  }

  // kalau sudah full url
  if (image.startsWith("http")) {
    return image;
  }

  // image local uploads
  return `${API_BASE}/uploads/${image}`;
};

export default function NewsManagement() {
  const [news, setNews] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("published");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  /* =========================================
     FETCH NEWS
  ========================================= */

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE}/api/news`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("NEWS RESPONSE:", response.data);

      // FIX AGAR TIDAK MAP ERROR
      let result = [];

      if (Array.isArray(response.data)) {
        result = response.data;
      } else if (
        response.data &&
        Array.isArray(response.data.data)
      ) {
        result = response.data.data;
      }

      setNews(result);
    } catch (err) {
      console.error("LOAD NEWS ERROR:", err);

      setNews([]);
    }
  };

  /* =========================================
     CREATE NEWS
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", content);
      formData.append("status", status);

      if (image) {
        formData.append("image", image);
      }

      await axios.post(
        `${API_BASE}/api/news`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      // reset form
      setTitle("");
      setContent("");
      setStatus("published");
      setImage(null);

      // reload data
      fetchNews();
    } catch (err) {
      console.error(
        "CREATE NEWS ERROR:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     DELETE NEWS
  ========================================= */

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_BASE}/api/news/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNews();
    } catch (err) {
      console.error(
        "DELETE NEWS ERROR:",
        err
      );
    }
  };

  /* =========================================
     TOGGLE STATUS
  ========================================= */

  const toggleStatus = async (item) => {
    try {
      const token = localStorage.getItem("token");

      const newStatus =
        item.status === "published"
          ? "draft"
          : "published";

      await axios.patch(
        `${API_BASE}/api/news/${item.id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNews();
    } catch (err) {
      console.error(
        "STATUS UPDATE ERROR:",
        err
      );
    }
  };

  /* =========================================
     LOAD
  ========================================= */

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* =========================================
          TITLE
      ========================================= */}

      <h1 className="text-3xl font-bold mb-6">
        Kelola News
      </h1>

      {/* =========================================
          FORM
      ========================================= */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded shadow mb-8"
      >
        {/* title */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Judul"
            className="w-full border p-3 rounded"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
          />
        </div>

        {/* content */}
        <div className="mb-4">
          <textarea
            placeholder="Konten"
            rows={5}
            className="w-full border p-3 rounded"
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            required
          />
        </div>

        {/* status */}
        <div className="mb-4">
          <select
            className="w-full border p-3 rounded"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="published">
              Publish
            </option>

            <option value="draft">
              Draft
            </option>
          </select>
        </div>

        {/* image */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files[0])
            }
          />
        </div>

        {/* submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          {loading
            ? "Loading..."
            : "Tambah News"}
        </button>
      </form>

      {/* =========================================
          LIST NEWS
      ========================================= */}

      <div className="space-y-5">
        {Array.isArray(news) &&
        news.length > 0 ? (
          news.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded shadow"
            >
              {/* title */}
              <h2 className="text-2xl font-bold mb-2">
                {item.title}
              </h2>

              {/* content */}
              <p className="text-gray-600 mb-3">
                {item.content}
              </p>

              {/* image */}
              <img
                src={resolveImage(item.image)}
                alt={item.title}
                className="w-52 h-32 object-cover rounded border mb-3"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x200?text=No+Image";
                }}
              />

              {/* status */}
              <span
                className={`inline-block px-3 py-1 rounded text-sm mb-3 ${
                  item.status ===
                  "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.status}
              </span>

              {/* actions */}
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    toggleStatus(item)
                  }
                  className="text-orange-500"
                >
                  {item.status ===
                  "published"
                    ? "Jadikan Draft"
                    : "Publish"}
                </button>

                <button
                  onClick={() =>
                    handleDelete(item.id)
                  }
                  className="text-red-500"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">
            Belum ada news
          </div>
        )}
      </div>
    </div>
  );
}