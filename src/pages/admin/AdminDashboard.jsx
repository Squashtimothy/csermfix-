import { useNavigate } from "react-router-dom";
import { useEffect, useCallback } from "react";
import {
  LogOut,
  FileText,
  Users,
  LayoutDashboard,
  Home,
  Settings,
  Target,
  Image,
  BookOpen,
  Layers,
  ArrowRight,
  Activity,
  FolderKanban,
} from "lucide-react";

// ===== DATA DASHBOARD =====
const DASHBOARD_SECTIONS = [
  {
    id: "content",
    title: "Content Management",
    subtitle: "Kelola berita, publikasi, project, dan data tim website.",
    gridClass: "lg:grid-cols-4",
    items: [
      {
        title: "Kelola News",
        desc: "Tambah, edit, dan hapus berita website.",
        icon: FileText,
        color: "emerald",
        path: "/admin/news",
      },
      {
        title: "Kelola Publications",
        desc: "Manajemen file dan publikasi ilmiah.",
        icon: BookOpen,
        color: "blue",
        path: "/admin/publications",
      },
      {
        title: "Kelola Projects",
        desc: "Kelola project utama dan block kontennya.",
        icon: FolderKanban,
        color: "cyan",
        path: "/admin/projects",
      },
      {
        title: "Kelola Teams",
        desc: "Manajemen struktur anggota organisasi.",
        icon: Users,
        color: "purple",
        path: "/admin/teams",
      },
    ],
  },
  {
    id: "homepage",
    title: "Homepage Management",
    subtitle:
      "Kelola seluruh konten utama yang tampil di halaman depan website.",
    gridClass: "lg:grid-cols-4",
    items: [
      {
        title: "Homepage Profile",
        desc: "Atur title utama.",
        icon: Home,
        color: "amber",
        path: "/admin/homepage",
      },
      {
        title: "Hero Slider",
        desc: "Kelola gambar slider.",
        icon: Image,
        color: "sky",
        path: "/admin/hero",
      },
      {
        title: "Aims Management",
        desc: "Konten section aims.",
        icon: Target,
        color: "rose",
        path: "/admin/aims",
      },
      {
        title: "Vision & Mission",
        desc: "Kelola visi misi.",
        icon: Settings,
        color: "teal",
        path: "/admin/vision-mission",
      },
    ],
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();


  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate("/login");
  }, [navigate]);

  // 🔥 AUTO LOGOUT SETELAH 3 MENIT IDLE (NO WARNING)
  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        handleLogout();
      }, 3 * 60 * 1000); // 3 menit
    };

    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "touchstart",
      "scroll",
    ];

    events.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    // mulai timer pertama
    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [handleLogout]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white border-b border-slate-200 mb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
                <LayoutDashboard size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  Admin <span className="text-indigo-600 italic">Panel</span>
                </h1>
                <p className="text-slate-500 font-medium">
                  System Control Center
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 px-5 py-2.5 rounded-xl font-bold border border-slate-200 hover:border-red-100 transition-all active:scale-95"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </header>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <StatCard
            label="Server Status"
            value="Online"
            icon={<Activity className="text-green-500" />}
          />
          <StatCard
            label="Total Modules"
            value="8 Active"
            icon={<Layers className="text-indigo-600" />}
          />
          <StatCard
            label="Last Updated"
            value="Today, 08:42"
            icon={<Settings className="text-slate-400" />}
          />
        </div>

        {DASHBOARD_SECTIONS.map((section) => (
          <section key={section.id} className="mb-16">
            <div className="flex items-center gap-4 mb-8 border-l-4 border-indigo-600 pl-4">
              <div>
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                  {section.title}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  {section.subtitle}
                </p>
              </div>
            </div>

            <div
              className={`grid grid-cols-1 md:grid-cols-2 ${section.gridClass} gap-6`}
            >
              {section.items.map((item) => (
                <MenuCard
                  key={item.path}
                  item={item}
                  onNavigate={navigate}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

// ===== STAT CARD =====
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      <div>
        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-lg font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}

// ===== MENU CARD =====
function MenuCard({ item, onNavigate }) {
  const Icon = item.icon;

  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    purple: "bg-purple-50 text-purple-600 ring-purple-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    sky: "bg-sky-50 text-sky-600 ring-sky-100",
    rose: "bg-rose-50 text-rose-600 ring-rose-100",
    teal: "bg-teal-50 text-teal-600 ring-teal-100",
    cyan: "bg-cyan-50 text-cyan-600 ring-cyan-100",
  };

  return (
    <button
      type="button"
      onClick={() => onNavigate(item.path)}
      className="group relative text-left bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 w-full"
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ring-4 ${
          colorMap[item.color]
        }`}
      >
        <Icon size={26} />
      </div>

      <h3 className="text-xl font-black text-slate-800 mb-2">
        {item.title}
      </h3>

      <p className="text-slate-500 text-sm mb-6">{item.desc}</p>

      <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
        <span>Buka Manajemen</span>
        <ArrowRight size={16} />
      </div>
    </button>
  );
}