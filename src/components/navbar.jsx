import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // =========================
  // SMOOTH SCROLL
  // =========================
  const handleScroll = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* ================= LOGO ================= */}
        <div
          onClick={() => handleScroll("hero")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img
            src={logo}
            alt="CSERM Logo"
            className="h-9 w-9 object-contain"
          />

          <span className="text-xl font-bold text-[#1E9C2D] tracking-wide">
            CSERM UNAS
          </span>
        </div>

        {/* ================= DESKTOP MENU ================= */}
        <ul className="hidden md:flex gap-8 font-medium text-gray-700">
          <li>
            <button
              onClick={() => handleScroll("profile")}
              className="hover:text-[#1E9C2D] transition-colors"
            >
              Profile
            </button>
          </li>

          <li>
            <button
              onClick={() => handleScroll("projects")}
              className="hover:text-[#1E9C2D] transition-colors"
            >
              Project
            </button>
          </li>

          <li>
            <button
              onClick={() => handleScroll("publications")}
              className="hover:text-[#1E9C2D] transition-colors"
            >
              Publications
            </button>
          </li>

          <li>
            <button
              onClick={() => handleScroll("ourteam")}
              className="hover:text-[#1E9C2D] transition-colors"
            >
              CSERM Team
            </button>
          </li>

          <li>
            <button
              onClick={() => handleScroll("news")}
              className="hover:text-[#1E9C2D] transition-colors"
            >
              News
            </button>
          </li>

          <li>
            <button
              onClick={() => handleScroll("contact")}
              className="hover:text-[#1E9C2D] transition-colors"
            >
              Contact Us
            </button>
          </li>
        </ul>

        {/* ================= MOBILE BUTTON ================= */}
        <button
          type="button"
          aria-label="Toggle Menu"
          className="md:hidden relative w-8 h-8 flex items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* TOP */}
          <span
            className={`absolute h-0.5 w-6 bg-gray-800 rounded transition-all duration-300 ${
              isOpen
                ? "rotate-45"
                : "-translate-y-2"
            }`}
          />

          {/* MIDDLE */}
          <span
            className={`absolute h-0.5 w-6 bg-gray-800 rounded transition-all duration-300 ${
              isOpen
                ? "opacity-0"
                : "opacity-100"
            }`}
          />

          {/* BOTTOM */}
          <span
            className={`absolute h-0.5 w-6 bg-gray-800 rounded transition-all duration-300 ${
              isOpen
                ? "-rotate-45"
                : "translate-y-2"
            }`}
          />
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="flex flex-col px-6 py-5 space-y-4 text-center">

              <button
                onClick={() => handleScroll("profile")}
                className="text-gray-700 hover:text-[#1E9C2D] transition"
              >
                Profile
              </button>

              <button
                onClick={() => handleScroll("projects")}
                className="text-gray-700 hover:text-[#1E9C2D] transition"
              >
                What We Do?
              </button>

              <button
                onClick={() => handleScroll("publications")}
                className="text-gray-700 hover:text-[#1E9C2D] transition"
              >
                Publications
              </button>

              <button
                onClick={() => handleScroll("ourteam")}
                className="text-gray-700 hover:text-[#1E9C2D] transition"
              >
                Our Team
              </button>

              <button
                onClick={() => handleScroll("news")}
                className="text-gray-700 hover:text-[#1E9C2D] transition"
              >
                News
              </button>

              <button
                onClick={() => handleScroll("contact")}
                className="text-gray-700 hover:text-[#1E9C2D] transition"
              >
                Contact Us
              </button>

              <button
                onClick={() => handleScroll("info")}
                className="block w-full px-4 py-2 rounded-full text-white font-medium shadow-md hover:opacity-90 transition"
                style={{ backgroundColor: "#1E9C2D" }}
              >
                For Your Information
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}