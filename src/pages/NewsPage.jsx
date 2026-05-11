import React, {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/navbar";
import newsHero from "../assets/recentNews.jpg";

import {
  useNavigate,
} from "react-router-dom";

import {
  getPublishedNews,
} from "../services/newsService";

/* =========================
   API BASE
========================= */

const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://resilient-balance-production-57f8.up.railway.app";

/* =========================
   COMPONENT
========================= */

export default function NewsPage() {
  const [newsList, setNewsList] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [currentPage, setCurrentPage] =
    useState(1);

  const newsPerPage = 8;

  const navigate = useNavigate();

  /* =========================
     FORMAT DATE
  ========================= */

  const formatDate = (date) => {
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
      return "https://via.placeholder.com/400x300?text=No+Image";
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
      return `${API_BASE}${image}`;
    }

    // default
    return `${API_BASE}/uploads/${image}`;
  };

  /* =========================
     FETCH NEWS
  ========================= */

  const fetchNews =
    async () => {
      try {
        setLoading(true);

        const res =
          await getPublishedNews();

        console.log(
          "NEWS RESPONSE:",
          res.data
        );

        // handle semua bentuk response
        const data =
          Array.isArray(
            res.data
          )
            ? res.data
            : Array.isArray(
                res.data.data
              )
            ? res.data.data
            : [];

        console.log(
          "FINAL NEWS:",
          data
        );

        setNewsList(data);

        // reset pagination
        setCurrentPage(1);
      } catch (err) {
        console.error(
          "Gagal ambil news:",
          err
        );

        setNewsList([]);
      } finally {
        setLoading(false);
      }
    };

  /* =========================
     USE EFFECT
  ========================= */

  useEffect(() => {
    fetchNews();
  }, []);

  /* =========================
     PAGINATION
  ========================= */

  const indexOfLastNews =
    currentPage * newsPerPage;

  const indexOfFirstNews =
    indexOfLastNews -
    newsPerPage;

  const currentNews =
    newsList.slice(
      indexOfFirstNews,
      indexOfLastNews
    );

  const totalPages =
    Math.ceil(
      newsList.length /
        newsPerPage
    );

  const handlePageChange = (
    pageNumber
  ) => {
    if (
      pageNumber < 1 ||
      pageNumber > totalPages
    ) {
      return;
    }

    setCurrentPage(
      pageNumber
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full h-full">
          <div
            className="w-full h-full bg-cover bg-center rounded-3xl shadow-2xl"
            style={{
              backgroundImage: `url(${newsHero})`,
            }}
          ></div>
        </div>
      </div>

      {/* NEWS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-[#1E9C2D] text-center">
          RECENT NEWS
        </h2>

        {/* LOADING */}
        {loading ? (
          <p className="text-center text-gray-500">
            Loading news...
          </p>
        ) : newsList.length ===
          0 ? (
          <p className="text-center text-gray-500">
            Belum ada news
            tersedia
          </p>
        ) : (
          <>
            {/* GRID */}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
              {currentNews.map(
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
                    className="bg-white shadow-md rounded-3xl overflow-hidden text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                  >
                    {/* IMAGE */}
                    <img
                      src={getImageUrl(
                        item.image
                      )}
                      alt={
                        item.title
                      }
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                      onError={(
                        e
                      ) => {
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />

                    {/* CONTENT */}
                    <div className="p-5">
                      {/* TITLE */}
                      <h3 className="font-semibold mt-2 text-lg text-gray-800 line-clamp-2">
                        {
                          item.title
                        }
                      </h3>

                      {/* DATE */}
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDate(
                          item.created_at
                        )}
                      </p>

                      {/* DESCRIPTION */}
                      <p className="text-gray-500 text-sm mt-3 line-clamp-3">
                        {
                          item.content
                        }
                      </p>

                      {/* BUTTON */}
                      <div className="text-green-600 text-sm mt-4 font-medium">
                        Read More →
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* PAGINATION */}
            {totalPages >
              1 && (
              <div className="flex justify-center mt-12 gap-2 flex-wrap">
                {/* PREV */}
                <button
                  onClick={() =>
                    handlePageChange(
                      currentPage -
                        1
                    )
                  }
                  disabled={
                    currentPage ===
                    1
                  }
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>

                {/* NUMBER */}
                {[
                  ...Array(
                    totalPages
                  ),
                ].map(
                  (
                    _,
                    index
                  ) => {
                    const page =
                      index +
                      1;

                    return (
                      <button
                        key={
                          page
                        }
                        onClick={() =>
                          handlePageChange(
                            page
                          )
                        }
                        className={`px-4 py-2 rounded-xl transition ${
                          currentPage ===
                          page
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}

                {/* NEXT */}
                <button
                  onClick={() =>
                    handlePageChange(
                      currentPage +
                        1
                    )
                  }
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}