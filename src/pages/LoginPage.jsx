import { useEffect, useState } from "react";
import axios from "axios"; 
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { User, Lock, Loader2, Eye, EyeOff } from "lucide-react";

// --- IMPORT ASSETS (Penting agar file di src/assets terbaca) ---
import bgHero from "../assets/login.webp"; 
import backgorund from "../assets/logo.png"; 

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (token && role) {
      // Mapping rute berdasarkan role
      const routes = {
        superadmin: "/superAdmin",
        admin: "/admin",
        user: "/user"
      };
      navigate(routes[role] || "/", { replace: true });
    }
  }, [navigate]);

  const sanitizeInput = (input) => {
    if (!input) return "";
    return input.toString().trim().replace(/[<>'"&]/g, "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const maxLength = name === "username" ? 50 : 100;
    setForm((prev) => ({ ...prev, [name]: value.slice(0, maxLength) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const cleanUsername = sanitizeInput(form.username);
    
    if (!cleanUsername || !form.password) {
      Swal.fire({ 
        icon: "warning", 
        title: "Input Tidak Valid", 
        text: "Username dan password tidak boleh kosong!", 
        timer: 3000, 
        showConfirmButton: false 
      });
      return;
    }

    setLoading(true);

    try {
      localStorage.clear(); 

      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, 
        { username: cleanUsername, password: form.password }, 
        {
          headers: { 
            "Content-Type": "application/json", 
            "X-Requested-With": "XMLHttpRequest" 
          },
          timeout: 10000,
        }
      );

      const { token, role, username: serverUsername, kd_unker } = res.data;

      if (!token || !role) throw new Error("Data login tidak lengkap.");

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      if (serverUsername) localStorage.setItem("username", serverUsername);
      if (kd_unker) localStorage.setItem("kd_unker", kd_unker);

      Swal.fire({ 
        icon: "success", 
        title: "Berhasil", 
        text: `Login sebagai ${serverUsername || role}!`, 
        timer: 1500, 
        showConfirmButton: false 
      });

      const routes = { 
        superadmin: "/superAdmin", 
        admin: "/admin", 
        user: "/user" 
      };
      navigate(routes[role] || "/", { replace: true });

    } catch (err) {
      let msg = "Terjadi kesalahan saat login";
      if (err.response?.status === 401) msg = "Username atau password salah!";
      else if (err.response?.status === 429) msg = "Terlalu banyak percobaan. Coba lagi nanti.";
      
      Swal.fire({ 
        icon: "error", 
        title: "Login Gagal", 
        text: msg, 
        timer: 3000, 
        showConfirmButton: false 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 relative"
      // Menggunakan variabel bgHero yang di-import
      style={{ backgroundImage: `url(${bgHero})` }}
    >
      {/* Overlay Gelap agar form lebih menonjol */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      <div className="w-full max-w-[400px] z-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <img
            src={backgorund} // 
            alt="Logo"
            className="h-20 mx-auto mb-4 object-contain"
            onError={(e) => (e.target.style.display = "none")}
          />
          <h2 className="text-xl font-black text-slate-800 tracking-tight">SINGLE LOGIN</h2>
          <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">Admin Dashboard CSERM</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                name="username"
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                placeholder="User Name"
                disabled={loading}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                disabled={loading}
                className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-[11px] font-semibold">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-800">
              <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              Ingat saya
            </label>
            <Link to="/reset" className="text-indigo-600 hover:text-indigo-800">
              Lupa kata sandi?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
              loading ? "bg-slate-400 cursor-not-allowed" : "bg-[#4a6fa5] hover:bg-[#3a5a95] active:scale-95"
            }`}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Masuk"}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} CSERM Universitas Nasional
        </p>
      </div>
    </div>
  );
}