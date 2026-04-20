import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <img src={logo} alt="CSERM Logo" className="h-9 w-9 object-contain" />
          <span className="text-xl font-bold text-[#1E9C2D] tracking-wide">
            CSERM UNAS
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 font-medium text-gray-700">
          <li><a href="#profile" className="hover:text-[#1E9C2D] transition-colors">Profile</a></li>
          <li><a href="#projects" className="hover:text-[#1E9C2D] transition-colors">Project</a></li>
          <li><a href="#publications" className="hover:text-[#1E9C2D] transition-colors">Publications</a></li>
          <li><a href="#ourteam" className="hover:text-[#1E9C2D] transition-colors">CSERM Team</a></li>
          <li><a href="#news" className="hover:text-[#1E9C2D] transition-colors">News</a></li>
          <li><a href="#contact" className="hover:text-[#1E9C2D] transition-colors">Contact Us</a></li>
        </ul>

        {/* Button Desktop */}
       

        {/* Mobile Button (animated hamburger) */}
        <button
          className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className={`absolute h-0.5 w-6 bg-gray-800 rounded transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-1.5" : "-translate-y-2"
            }`}
          ></span>
          <span
            className={`absolute h-0.5 w-6 bg-gray-800 rounded transition-all duration-300 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`absolute h-0.5 w-6 bg-gray-800 rounded transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-2"
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="md:hidden backdrop-blur-xl bg-white/90 border-t border-gray-100 shadow-xl"
          >
            <div className="px-6 py-5 space-y-4 text-center">
              <a href="#profile" className="block text-gray-700 hover:text-[#1E9C2D] transition-all">Profile</a>
              <a href="#projects" className="block text-gray-700 hover:text-[#1E9C2D] transition-all">What We Do?</a>
              <a href="#publications" className="block text-gray-700 hover:text-[#1E9C2D] transition-all">Publication</a>
              <a href="#ourteam" className="block text-gray-700 hover:text-[#1E9C2D] transition-all">Our Team</a>
              <a href="#news" className="block text-gray-700 hover:text-[#1E9C2D] transition-all">News</a>
              <a href="#contact" className="block text-gray-700 hover:text-[#1E9C2D] transition-all">Contact Us</a>

              <a
                href="#info"
                className="block w-full px-4 py-2 rounded-full text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-transform"
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


