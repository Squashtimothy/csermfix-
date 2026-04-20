import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import {
  Search,
  ChevronDown,
  ExternalLink,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import Navbar from "../components/navbar";
import publicationHero from "../assets/foto1.jpg";

const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

export default function PublicationPage() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("year_desc");
  const [page, setPage] = useState(1);
  const [openYears, setOpenYears] = useState({});
  
  const limit = 5; // 🔥 MAKSIMAL 5 DATA PER PAGE

  // ================= HELPER =================
  const formatUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return "https://" + url;
  };

  // ================= FETCH =================
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API_BASE_URL}/api/publications`, {
        params: { page, limit, sort, search },
      });

      const data = res.data?.data ?? [];
      const metaData = res.data?.meta ?? {};

      setRows(Array.isArray(data) ? data : []);
      setMeta({
        page: metaData.page ?? page,
        totalPages: metaData.totalPages ?? 1,
        total: metaData.total ?? data.length,
      });
    } catch (e) {
      setError(e?.response?.data?.message || "Gagal memuat data publication");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, sort]);

  useEffect(() => {
    const t = setTimeout(fetchData, 400);
    return () => clearTimeout(t);
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  useEffect(() => {
    if (page > meta.totalPages) {
      setPage(meta.totalPages || 1);
    }
  }, [meta.totalPages, page]);

  // ================= GROUP =================
  const grouped = useMemo(() => {
    const map = new Map();

    rows.forEach((p) => {
      const year = p.year ?? "Unknown";
      if (!map.has(year)) map.set(year, []);
      map.get(year).push(p);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) =>
        sort === "year_asc" ? Number(a) - Number(b) : Number(b) - Number(a)
      )
      .map(([year, items]) => ({ year, items }));
  }, [rows, sort]);

  useEffect(() => {
    if (grouped.length > 0) {
      const initial = {};
      grouped.forEach(({ year }) => {
        initial[year] = true;
      });
      setOpenYears(initial);
    }
  }, [grouped]);

  const toggleYear = (year) => {
    setOpenYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-sm">
      <Navbar />

      {/* HERO */}
      <div className="relative w-full h-[55vh] flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-6 w-full h-full">
          <div
            className="w-full h-full bg-cover bg-center rounded-3xl shadow-2xl"
            style={{ backgroundImage: `url(${publicationHero})` }}
          />
        </div>
      </div>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex justify-between mb-8 border-b pb-6">
          <div>
            <h1 className="text-4xl font-black">Publications</h1>
            <p className="text-slate-500">Explore research database</p>
          </div>

          <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-xl">
            <BookOpen className="w-4 h-4" />
            {meta.total} Records
          </div>
        </div>

        {/* INFO RANGE */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {(page - 1) * limit + 1} -{" "}
          {Math.min(page * limit, meta.total)} of {meta.total}
        </p>

        {/* SEARCH */}
        <div className="flex gap-3 mb-8 bg-white p-3 rounded-xl border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              className="pl-10 w-full outline-none"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="year_desc">Latest</option>
            <option value="year_asc">Oldest</option>
          </select>
        </div>

        {/* LIST */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="text-red-500 flex gap-2">
            <AlertCircle /> {error}
          </div>
        ) : grouped.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No publications found
          </p>
        ) : (
          grouped.map(({ year, items }) => (
            <div key={year} className="bg-white mb-4 rounded-xl border">

              <button
                onClick={() => toggleYear(year)}
                className="w-full flex justify-between p-4"
              >
                <span className="font-bold">{year}</span>
                <ChevronDown />
              </button>

              {openYears[year] && (
                <div className="p-4 space-y-4">
                  {items.map((p) => (
                    <div key={p.id} className="border-b pb-3">

                      <h4 className="font-bold">{p.title}</h4>

                      <div
                        className="text-sm"
                        dangerouslySetInnerHTML={{
                          __html: p.authors ? p.authors : "<i>No author</i>",
                        }}
                      />

                      {p.journal && (
                        <div className="text-gray-500 italic">
                          {p.journal}
                        </div>
                      )}

                      {p.keywords && (
                        <div className="text-xs text-blue-600 mt-1">
                          Keywords: {p.keywords.trim()}
                        </div>
                      )}

                      {p.url && (
                        <a
                          href={formatUrl(p.url)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-600 text-sm flex items-center gap-1 mt-2"
                        >
                          View Journal <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">

          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`px-3 py-1 rounded-lg border ${
              page === 1
                ? "bg-gray-100 text-gray-400"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
            .slice(
              Math.max(0, page - 3),
              Math.min(meta.totalPages, page + 2)
            )
            .map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded-lg border ${
                  p === page
                    ? "bg-green-600 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}

          <button
            disabled={page === meta.totalPages}
            onClick={() =>
              setPage((p) => Math.min(meta.totalPages, p + 1))
            }
            className={`px-3 py-1 rounded-lg border ${
              page === meta.totalPages
                ? "bg-gray-100 text-gray-400"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Next
          </button>

        </div>

      </section>
    </div>
  );
}