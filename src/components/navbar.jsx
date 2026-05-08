import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // lock body scroll saat menu mobile buka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // close menu saat resize desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[999] bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="CSERM Logo"
              className="h-10 w-10 object-contain"
            />

            <span className="text-xl font-bold text-[#1E9C2D]">
              CSERM UNAS
            </span>
          </div>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex items-center gap-8 font-medium text-gray-700">
            <li>
              <a
                href="#profile"
                className="hover:text-[#1E9C2D]"
              >
                Profile
              </a>
            </li>

            <li>
              <a
                href="#projects"
                className="hover:text-[#1E9C2D]"
              >
                Project
              </a>
            </li>

            <li>
              <a
                href="#publications"
                className="hover:text-[#1E9C2D]"
              >
                Publications
              </a>
            </li>

            <li>
              <a
                href="#ourteam"
                className="hover:text-[#1E9C2D]"
              >
                Team
              </a>
            </li>

            <li>
              <a
                href="#news"
                className="hover:text-[#1E9C2D]"
              >
                News
              </a>
            </li>

            <li>
              <a
                href="#contact"
                className="hover:text-[#1E9C2D]"
              >
                Contact
              </a>
            </li>
          </ul>

          {/* HAMBURGER */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-8 h-8 flex items-center justify-center z-[1000]"
          >
            <span
              className={`absolute w-6 h-[2px] bg-black transition-all duration-300 ${
                isOpen
                  ? "rotate-45"
                  : "-translate-y-2"
              }`}
            />

            <span
              className={`absolute w-6 h-[2px] bg-black transition-all duration-300 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />

            <span
              className={`absolute w-6 h-[2px] bg-black transition-all duration-300 ${
                isOpen
                  ? "-rotate-45"
                  : "translate-y-2"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[998] md:hidden"
            />

            {/* MENU */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 0.3,
              }}
              className="fixed top-0 right-0 w-[80%] h-screen bg-white z-[999] shadow-2xl md:hidden"
            >
              <div className="flex flex-col p-8 gap-6 mt-20 text-lg font-medium text-gray-700">
                <a
                  href="#profile"
                  onClick={closeMenu}
                >
                  Profile
                </a>

                <a
                  href="#projects"
                  onClick={closeMenu}
                >
                  Projects
                </a>

                <a
                  href="#publications"
                  onClick={closeMenu}
                >
                  Publications
                </a>

                <a
                  href="#ourteam"
                  onClick={closeMenu}
                >
                  Team
                </a>

                <a
                  href="#news"
                  onClick={closeMenu}
                >
                  News
                </a>

                <a
                  href="#contact"
                  onClick={closeMenu}
                >
                  Contact
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}