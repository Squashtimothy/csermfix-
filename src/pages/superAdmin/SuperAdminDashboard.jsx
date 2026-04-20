
import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";

const SuperAdminDashboard = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <Sidebar role="superadmin" />

      {/* CONTENT */}
      <div className="flex-1 p-6">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Super Admin
          </h1>
          <p className="text-gray-500 mt-1">
            Kelola user, konten, dan sistem
          </p>
        </div>

        {/* CARDS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* USER MANAGEMENT */}
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-gray-800">
              User Management
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-5">
              Tambah, edit, dan hapus akun pengguna.
            </p>

            <Link
              to="/superadmin/users"
              className="inline-flex items-center justify-center w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition"
            >
              Kelola User
            </Link>
          </div>

          {/* TEAMS MANAGEMENT ✅ */}
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-gray-800">
              Teams Management
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-5">
              Kelola data tim: nama, jabatan, bio, dan foto.
            </p>

            <Link
              to="/superadmin/teams"
              className="inline-flex items-center justify-center w-full bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 transition"
            >
              Kelola Teams
            </Link>
          </div>

          {/* KONTEN WEBSITE (opsional) */}
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-gray-800">
              Konten Website
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-5">
              Kelola halaman dan informasi website.
            </p>

            {/* Ganti route ini sesuai halaman konten kamu */}
            <Link
              to="/superadmin/content"
              className="inline-flex items-center justify-center w-full bg-purple-600 text-white py-2.5 rounded-xl hover:bg-purple-700 transition"
            >
              Kelola Konten
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
