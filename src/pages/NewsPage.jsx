import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

/* =========================
   IMPORT DEFAULT IMAGE
========================= */

import noImage from "../assets/no-image.png";

/* =========================
   API URL
========================= */

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://resilient-balance-production-57f8.up.railway.app";

/* =========================
   COMPONENT
========================= */

export default function NewsDetail() {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const [news, setNews] =
    useState(null);

  const [
    latestNews,
    setLatestNews,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =========================
     FORMAT DATE
  ========================= */

  const formatDate = (
    date
  ) => {
    if (!date) return "-";

    return new Date(
      date
    ).toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  /* =========================
     HANDLE IMAGE URL
  ========================= */

  const getImageUrl = (
    image
  ) => {
    // jika tidak ada image
    if (!image) {
      return noImage;
    }

    // jika full url
    if (
      image.startsWith(
        "http"
      )
    ) {
      return image;
    }

    // jika sudah ada /uploads
    if (
      image.startsWith(
        "/uploads"
      )
    ) {
      return `${API_URL}${image}`;
    }

    // default
    return `${API_URL}/uploads/${image}`;
  };

  /* =========================
     USE EFFECT
  ========================= */

  useEffect(() => {
    const fetchAll =
      async () => {
        try {
          setLoading(true);

          /* =========================
             FETCH DETAIL
          ========================= */

          const detailResponse =
            await fetch(
              `${API_URL}/api/news/${id}`
            );

          const detailData =
            await detailResponse.json();

          console.log(
            "DETAIL NEWS:",
            detailData
          );

          const newsData =
            detailData.data ||
            detailData;

          setNews(newsData);

          /* =========================
             FETCH LATEST
          ========================= */

          const latestResponse =
            await fetch(
              `${API_URL}/api/news/published`
            );

          const latestData =
            await latestResponse.json();

          console.log(
            "LATEST NEWS:",
            latestData
          );

          const newsArray =
            Array.isArray(
              latestData
            )
              ? latestData
              : latestData.data ||
                [];

          const filtered =
            newsArray.filter(
              (item) =>
                item.id !==
                Number(id)
            );

          setLatestNews(
            filtered.slice(0, 5)
          );
        } catch (err) {
          console.error(
            "ERROR:",
            err
          );

          setError(
            "Gagal mengambil data news"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchAll();
  }, [id]);

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
      <div className="text-center text-red-500 p-10">
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

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">

        {/* ================= MAIN CONTENT ================= */}

        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow">

          {/* BACK BUTTON */}

          <button
            onClick={() =>
              navigate("/#news")
            }
            className="text-green-600 mb-4 hover:underline"
          >
            ← Back
          </button>

          {/* IMAGE */}

          <img
            src={getImageUrl(
              news.image
            )}
            alt={
              news.title ||
              "news image"
            }
            className="w-full h-[350px] object-cover rounded-lg mb-6"
            onError={(e) => {
              e.target.onerror =
                null;

              e.target.src =
                noImage;
            }}
          />

          {/* TITLE */}

          <h1 className="text-3xl font-bold mb-3">
            {news.title}
          </h1>

          {/* META */}

          <p className="text-sm text-gray-500 mb-6">
            {formatDate(
              news.created_at
            )}{" "}
            • Admin
          </p>

          {/* CONTENT */}

          <div className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
            {news.content}
          </div>
        </div>

        {/* ================= SIDEBAR ================= */}

        <div className="space-y-4">

          {/* LATEST NEWS */}

          <div className="bg-white p-4 rounded-2xl shadow">

            <h2 className="font-semibold text-lg mb-4 border-b pb-2">
              Latest News
            </h2>

            {latestNews.length ===
            0 ? (
              <p className="text-gray-400 text-sm">
                No news available
              </p>
            ) : (
              latestNews.map(
                (item) => (
                  <div
                    key={
                      item.id
                    }
                    onClick={() =>
                      navigate(
                        `/news/${item.id}`
                      )
                    }
                    className="flex gap-3 mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                  >

                    {/* SIDEBAR IMAGE */}

                    <img
                      src={getImageUrl(
                        item.image
                      )}
                      alt={
                        item.title
                      }
                      className="w-20 h-16 object-cover rounded"
                      onError={(
                        e
                      ) => {
                        e.target.onerror =
                          null;

                        e.target.src =
                          noImage;
                      }}
                    />

                    {/* CONTENT */}

                    <div>
                      <p className="text-sm font-medium line-clamp-2">
                        {
                          item.title
                        }
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(
                          item.created_at
                        )}
                      </p>
                    </div>
                  </div>
                )
              )
            )}
          </div>

          {/* OPTIONAL WIDGET */}

          <div className="bg-white p-4 rounded-2xl shadow text-center text-gray-400">
            Advertisement /
            Widget Space
          </div>
        </div>
      </div>
    </div>
  );
}