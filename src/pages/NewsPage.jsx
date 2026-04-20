import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import newsHero from "../assets/recentNews.jpg";
import { useNavigate } from "react-router-dom";
import { getPublishedNews } from "../services/newsService";

export default function NewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 8;

  const navigate = useNavigate();

  // ========================
  // FETCH DATA
  // ========================
  const fetchNews = async () => {
    try {
      const res = await getPublishedNews();

      //   FILTER EXTRA (ANTI BUG)
      const publishedOnly = res.data.filter(
        (item) => item.status === "published"
      );

      console.log("Published ONLY:", publishedOnly);

      setNewsList(publishedOnly);

      //   FIX: reset page kalau data berkurang
      setCurrentPage(1);

      setLoading(false);
    } catch (err) {
      console.error("Gagal ambil news:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    // polling tiap 10 detik
    const interval = setInterval(fetchNews, 10000);

    return () => clearInterval(interval);
  }, []);

  // ========================
  // PAGINATION
  // ========================
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = newsList.slice(indexOfFirstNews, indexOfLastNews);

  const totalPages = Math.ceil(newsList.length / newsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* HERO */}
      <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full h-full">
          <div
            className="w-full h-full bg-cover bg-center rounded-3xl shadow-2xl"
            style={{ backgroundImage: `url(${newsHero})` }}
          ></div>
        </div>
      </div>

      {/* NEWS LIST */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-[#1E9C2D] text-center">
          RECENT NEWS
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading news...</p>
        ) : newsList.length === 0 ? (
          <p className="text-center text-gray-500">
            Belum ada news tersedia
          </p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
              {currentNews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/news/${item.id}`)}
                  className="bg-white shadow-md rounded-3xl overflow-hidden text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                >
                  <img
                    src={
                      item.image
                        ? `http://localhost:5000/uploads/${item.image}`
                        : "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={item.title}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />

                  <div className="p-5">
                    <h3 className="font-semibold mt-2 text-lg text-gray-800">
                      {item.title}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {item.content}
                    </p>

                    <div className="text-green-600 text-sm mt-3 font-medium">
                      Read More →
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2 flex-wrap">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-xl ${
                        currentPage === page
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
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