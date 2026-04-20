// components/layouts/SuperAdminLayout.jsx
import { Outlet, Link } from "react-router-dom";

export default function SuperAdminLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-red-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">SUPER ADMIN</h2>

        <nav className="space-y-2">
          <Link to="/superadmin/news" className="block hover:bg-red-700 p-2 rounded">
            Kelola News
          </Link>
          <Link
            to="/superadmin/admins"
            className="block hover:bg-red-700 p-2 rounded"
          >
            Kelola Admin
          </Link>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}
