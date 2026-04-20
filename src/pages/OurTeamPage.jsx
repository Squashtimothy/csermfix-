import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/navbar";
import axios from "axios";

const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

export default function OurTeam() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 PAGINATION STAFF
  const [pageStaff, setPageStaff] = useState(1);
  const limit = 8;

  // ================= FETCH =================
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/teams`);
        setTeams(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err?.response?.data?.message || "Gagal memuat data team");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // ================= GROUP =================
  const { management, staff, expert } = useMemo(() => {
    const normalize = (c) => {
      const val = (c || "staff").toString().trim().toLowerCase();
      if (val === "management") return "management";
      if (val === "expert") return "expert";
      return "staff";
    };

    const mgmt = [];
    const stf = [];
    const exp = [];

    for (const t of teams) {
      const cat = normalize(t.category);
      if (cat === "management") mgmt.push(t);
      else if (cat === "expert") exp.push(t);
      else stf.push(t);
    }

    return { management: mgmt, staff: stf, expert: exp };
  }, [teams]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(staff.length / limit);

  const currentStaff = useMemo(() => {
    const start = (pageStaff - 1) * limit;
    return staff.slice(start, start + limit);
  }, [staff, pageStaff]);

  // reset page kalau data berubah
  useEffect(() => {
    setPageStaff(1);
  }, [staff.length]);

  // jaga supaya tidak out of range
  useEffect(() => {
    if (pageStaff > totalPages) {
      setPageStaff(totalPages || 1);
    }
  }, [totalPages, pageStaff]);

  // ================= CARD =================
  const TeamCard = ({ person }) => (
    <div className="bg-white rounded-2xl overflow-hidden text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100">
      <img
        src={
          person.photo
            ? `${API_BASE_URL}/uploads/teams/${person.photo}`
            : "https://via.placeholder.com/300x300?text=No+Photo"
        }
        alt={person.name}
        className="w-full h-64 object-cover"
      />
      <div className="p-5">
        <h3 className="text-md text-gray-600">{person.position}</h3>
        <p className="text-[#1E9C2D] font-bold">{person.name}</p>
      </div>
    </div>
  );

  // ================= PAGINATION UI =================
  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
        {/* Prev */}
        <button
          onClick={() => setPageStaff((p) => Math.max(1, p - 1))}
          disabled={pageStaff === 1}
          className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>

        {/* Number */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPageStaff(p)}
            className={`px-3 py-1 rounded-lg border ${
              p === pageStaff
                ? "bg-green-600 text-white border-green-600"
                : "hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() =>
            setPageStaff((p) => Math.min(totalPages, p + 1))
          }
          disabled={pageStaff === totalPages}
          className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {loading && <p className="text-center py-20">Loading...</p>}
      {error && <p className="text-center py-20 text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {/* MANAGEMENT */}
          <section className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-10">
              MANAGEMENT
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {management.map((p) => (
                <TeamCard key={p.id} person={p} />
              ))}
            </div>
          </section>

          {/* EXPERT */}
          <section className="max-w-7xl mx-auto px-6 pb-16">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-10">
              EXPERT
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {expert.map((p) => (
                <TeamCard key={p.id} person={p} />
              ))}
            </div>
          </section>

          {/* STAFF */}
          <section className="max-w-7xl mx-auto px-6 pb-20">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-10">
              STAFF
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentStaff.map((p) => (
                <TeamCard key={p.id} person={p} />
              ))}
            </div>

            <Pagination />
          </section>
        </>
      )}
    </div>
  );
}