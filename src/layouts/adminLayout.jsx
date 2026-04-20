import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  FileText,
  Users,
  Home,
  BookOpen,
  Image,
  Target,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  FolderKanban,
} from "lucide-react";

const NAVIGATION_CONFIG = [
  {
    group: "Main",
    items: [
      {
        to: "/admin",
        label: "Dashboard",
        desc: "Ringkasan & menu",
        icon: LayoutGrid,
        end: true,
      },
    ],
  },
  {
    group: "Content",
    items: [
      {
        to: "/admin/news",
        label: "Kelola News",
        desc: "Tambah / edit / hapus",
        icon: FileText,
      },
      {
        to: "/admin/teams",
        label: "Kelola Teams",
        desc: "Management & staff",
        icon: Users,
      },
      {
        to: "/admin/publications",
        label: "Kelola Publication",
        desc: "Jurnal & tautan",
        icon: BookOpen,
      },
      {
        to: "/admin/projects",
        label: "Kelola Project",
        desc: "Project & block content",
        icon: FolderKanban,
      },
    ],
  },
  {
    group: "Homepage",
    items: [
      {
        to: "/admin/homepage",
        label: "Homepage Profile",
        desc: "Title & description",
        icon: Home,
      },
      {
        to: "/admin/hero",
        label: "Hero Slider",
        desc: "Gambar slider utama",
        icon: Image,
      },
      {
        to: "/admin/aims",
        label: "Aims Management",
        desc: "Konten aims homepage",
        icon: Target,
      },
      {
        to: "/admin/vision-mission",
        label: "Vision & Mission",
        desc: "Judul, isi & gambar",
        icon: Settings,
      },
    ],
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const currentPage = pathname.split("/").pop() || "dashboard";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-900">
      {/* SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? "w-[320px]" : "w-[96px]"
        } bg-slate-950 text-white p-4 hidden lg:flex flex-col sticky top-0 h-screen border-r border-white/5 transition-all duration-300`}
      >
        {/* BRAND */}
        <div
          className={`flex items-center ${
            sidebarOpen ? "justify-between" : "justify-center"
          } mb-8 px-2`}
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Sparkles size={24} className="text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-950 rounded-full"></span>
            </div>

            {sidebarOpen && (
              <div className="min-w-0">
                <h2 className="text-xl font-bold tracking-tight truncate">
                  C-Panel
                </h2>
                <p className="text-white/40 text-[11px] uppercase tracking-widest font-medium">
                  Administrator
                </p>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 transition shrink-0"
              aria-label="Tutup sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {!sidebarOpen && (
          <div className="flex justify-center mb-6">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-white/10 transition"
              aria-label="Buka sidebar"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8">
          {NAVIGATION_CONFIG.map((section) => (
            <div key={section.group}>
              {sidebarOpen && (
                <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 px-4">
                  {section.group}
                </h3>
              )}

              <div className="space-y-1.5">
                {section.items.map((item) => (
                  <MenuItem
                    key={item.to}
                    item={item}
                    sidebarOpen={sidebarOpen}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center ${
              sidebarOpen ? "justify-start gap-3 px-4" : "justify-center px-2"
            } py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group`}
          >
            <LogOut
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            {sidebarOpen && (
              <span className="font-semibold text-sm">Sign Out</span>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOPBAR */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 md:px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-slate-500 capitalize italic">
              Pages / {currentPage}
            </h1>
            <p className="text-lg font-bold text-slate-900">
              Welcome Back, Admin
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold">Workspace</span>
              <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">
                ● Online
              </span>
            </div>

            <button
              type="button"
              className="lg:hidden p-2 bg-slate-100 rounded-lg text-slate-600"
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function MenuItem({ item, sidebarOpen }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.end}
      title={!sidebarOpen ? item.label : ""}
      className={({ isActive }) =>
        `group flex items-center ${
          sidebarOpen ? "justify-between p-3" : "justify-center p-3"
        } rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-white/10 text-white shadow-sm ring-1 ring-white/20"
            : "text-white/50 hover:text-white hover:bg-white/5"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={`flex items-center ${
              sidebarOpen ? "gap-3.5 min-w-0" : "justify-center"
            }`}
          >
            <div
              className={`p-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-amber-500 text-white"
                  : "bg-slate-900 text-white/70 group-hover:text-white"
              }`}
            >
              <Icon size={18} />
            </div>

            {sidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-bold leading-none mb-1">
                  {item.label}
                </span>
                <span className="text-[11px] opacity-60 truncate">
                  {item.desc}
                </span>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <ChevronRight
              size={14}
              className={`transition-all ${
                isActive
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
              }`}
            />
          )}
        </>
      )}
    </NavLink>
  );
}