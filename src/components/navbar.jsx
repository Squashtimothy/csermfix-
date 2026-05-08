import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <a
          href="/"
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
        </a>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex gap-8 font-medium text-gray-700">
          <li>
            <a
              href="#profile"
              className="hover:text-[#1E9C2D] transition-colors"
            >
              Profile
            </a>
          </li>

          <li>
            <a
              href="#projects"
              className="hover:text-[#1E9C2D] transition-colors"
            >
              Project
            </a>
          </li>

          <li>
            <a
              href="#publications"
              className="hover:text-[#1E9C2D] transition-colors"
            >
              Publications
            </a>
          </li>

          <li>
            <a
              href="#ourteam"
              className="hover:text-[#1E9C2D] transition-colors"
            >
              CSERM Team
            </a>
          </li>

          <li>
            <a
              href="#news"
              className="hover:text-[#1E9C2D] transition-colors"
            >
              News
            </a>
          </li>

          <li>
            <a
              href="#contact"
              className="hover:text-[#1E9C2D] transition-colors"
            >
              Contact Us
            </a>
          </li>
        </ul>

        {/* MOBILE BUTTON */}
        <button
          type="button"
          aria-label="Toggle Menu"
          className="md:hidden relative w-8 h-8 flex items-center justify-center"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {/* LINE 1 */}
          <span
            className={`absolute h-0.5 w-6 bg-gray-800 rounded transition-all duration-300 ${
              isOpen
                ? "rotate-45"
                : "-translate-y-2"
            }`}
          />

          {/* LINE 2 */}
          <span
            className={`absolute h-0.5 w-6 bg-gray-800 rounded transition-all duration-300 ${
              isOpen
                ? "opacity-0"
                : "opacity-100"
            }`}
          />

          {/* LINE 3 */}
          <span
            className={`absolute h-0.5 w-6 bg-gray-800 rounded transition-all duration-300 ${
              isOpen
                ? "-rotate-45"
                : "translate-y-2"
            }`}
          />
        </button>
      </div>

      {/* MOBILE MENU */}
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

              <a
                href="#profile"
                onClick={closeMenu}
                className="block text-gray-700 hover:text-[#1E9C2D] transition"
              >
                Profile
              </a>

              <a
                href="#projects"
                onClick={closeMenu}
                className="block text-gray-700 hover:text-[#1E9C2D] transition"
              >
                What We Do?
              </a>

              <a
                href="#publications"
                onClick={closeMenu}
                className="block text-gray-700 hover:text-[#1E9C2D] transition"
              >
                Publications
              </a>

              <a
                href="#ourteam"
                onClick={closeMenu}
                className="block text-gray-700 hover:text-[#1E9C2D] transition"
              >
                Our Team
              </a>

              <a
                href="#news"
                onClick={closeMenu}
                className="block text-gray-700 hover:text-[#1E9C2D] transition"
              >
                News
              </a>

              <a
                href="#contact"
                onClick={closeMenu}
                className="block text-gray-700 hover:text-[#1E9C2D] transition"
              >
                Contact Us
              </a>

              <a
                href="#info"
                onClick={closeMenu}
                className="block w-full px-4 py-2 rounded-full text-white font-medium shadow-md hover:opacity-90 transition"
                style={{ backgroundColor: "#1E9C2D" }}
              >
                For Your Information
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}