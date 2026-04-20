import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  return (
    <div className="bg-dark text-white p-3" style={{ width: 250, minHeight: "100vh" }}>
      <h5 className="mb-4">Admin Panel</h5>

      <ul className="nav flex-column gap-2">

        <li>
          <Link className="nav-link text-white" to={`/${role}`}>
            Dashboard
          </Link>
        </li>

        <li>
          <Link className="nav-link text-white" to="/admin/news">
            News
          </Link>
        </li>

        <li>
          <Link className="nav-link text-white" to="/admin/projects">
            Projects
          </Link>
        </li>

        <li>
          <Link className="nav-link text-white" to="/admin/team">
            Team
          </Link>
        </li>

        {role === "superadmin" && (
          <li>
            <Link className="nav-link text-warning" to="/superadmin/users">
              User Management
            </Link>
          </li>
        )}

        <li className="mt-4">
          <button
            className="btn btn-sm btn-danger w-100"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;
