// src/pages/admin/NewsManagement.jsx

import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://resilient-balance-production-57f8.up.railway.app";

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

  // FIX PATH IMAGE
  return `${API_BASE}/uploads/${image}`;
};

export default function NewsManagement() {
  const [news, setNews] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("published");
  const [image, setImage] = useState(null);

  /* =========================================
     LOAD NEWS
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

      console.log("NEWS:", response.data);

      setNews(response.data || []);
    } catch (err) {
      console.error("LOAD NEWS ERROR:", err);
    }
  };

  /* =========================================
     CREATE NEWS
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTitle("");
      setContent("");
      setStatus("published");
      setImage(null);

      fetchNews();
    } catch (err) {
      console.error("CREATE NEWS ERROR:", err);
    }
  };

  /* =========================================
     DELETE
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
      console.error("DELETE ERROR:", err);
    }
  };

  /* =========================================
     STATUS
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
      console.error("STATUS ERROR:", err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
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

        <div className="mb-4">
          <textarea
            placeholder="Konten"
            className="w-full border p-3 rounded"
            rows={4}
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            required
          />
        </div>

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

        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files[0])
            }
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Tambah News
        </button>
      </form>

      {/* =========================================
          LIST NEWS
      ========================================= */}

      <div className="space-y-5">
        {news.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded shadow"
          >
            <h2 className="text-2xl font-bold">
              {item.title}
            </h2>

            <p className="text-gray-600 mb-3">
              {item.content}
            </p>

            {/* =========================================
                IMAGE FIX
            ========================================= */}

            <img
              src={resolveImage(item.image)}
              alt={item.title}
              className="w-52 h-32 object-cover rounded border mb-3"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x200?text=No+Image";
              }}
            />

            <span
              className={`inline-block px-3 py-1 rounded text-sm mb-3 ${
                item.status === "published"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {item.status}
            </span>

            <div className="flex gap-4">
              <button
                onClick={() =>
                  toggleStatus(item)
                }
                className="text-orange-500"
              >
                {item.status === "published"
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
        ))}
      </div>
    </div>
  );
}