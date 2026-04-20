import React, { useState, useEffect } from "react";
import contactImage from "../assets/contactUs.webp";

import {
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineMapPin
} from "react-icons/hi2";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: ""
  });

  const [formLoadedAt, setFormLoadedAt] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    setFormLoadedAt(Date.now());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const scriptURL =
      "https://script.google.com/macros/s/AKfycbwbyTd5tragoq4b20SVBAq4O5sLJbGO7YfsMWHsQJaygFhrcx6HsJfSgdM_Zo6vPP_S/exec";

    try {
      const payload = new URLSearchParams();

      payload.append("name", formData.name.trim());
      payload.append("email", formData.email.trim());
      payload.append("subject", formData.subject.trim());
      payload.append("message", formData.message.trim());
      payload.append("website", formData.website);
      payload.append("formLoadedAt", String(formLoadedAt));

      const response = await fetch(scriptURL, {
        method: "POST",
        body: payload
      });

      const result = await response.json();

      if (result.status === "success") {
        setStatusMessage({
          type: "success",
          text: "✅ Pesan berhasil dikirim!"
        });

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          website: ""
        });

        setFormLoadedAt(Date.now());
      } else {
        setStatusMessage({
          type: "error",
          text: result.message || "❌ Gagal mengirim pesan."
        });
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: "⚠️ Terjadi kesalahan."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${contactImage})` }}
    >
      {/* overlay sangat tipis */}
      <div className="absolute inset-0 bg-black/5"></div>

      <div className="relative z-10 w-[90%] md:w-[80%] lg:w-[75%] flex flex-col md:flex-row rounded-3xl overflow-hidden">

        {/* LEFT SIDE */}
        <div className="bg-white/10 backdrop-blur-md text-white w-full md:w-2/5 p-8 flex flex-col justify-center">
          <h3 className="text-xl font-semibold mb-8">
            Contact Information
          </h3>

          <div className="space-y-6 text-sm md:text-base">

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
                <HiOutlinePhone className="text-white text-[20px]" />
              </div>
              <div>+62 (21) 788 48 152</div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
                <HiOutlineEnvelope className="text-white text-[20px]" />
              </div>
              <div>cserm@unas.ac.id</div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
                <HiOutlineMapPin className="text-white text-[20px]" />
              </div>
              <div className="leading-relaxed">
                Jl. Sawo Manila No.61<br />
                Jakarta Selatan
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE GLASS */}
        <div className="relative w-full md:w-3/5 p-8 md:p-10 text-white glass-card overflow-hidden">

          {/* highlight kaca */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/15 to-transparent"></div>
          </div>

          <h3 className="text-2xl font-bold mb-6 drop-shadow-md relative z-10">
            Contact Us
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">

            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="hidden"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="glass-input"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="glass-input"
              />

            </div>

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="glass-input"
            />

            <textarea
              name="message"
              rows={5}
              placeholder="Your Message..."
              value={formData.message}
              onChange={handleChange}
              required
              className="glass-input resize-none"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                loading
                  ? "bg-gray-400"
                  : "bg-[#703818] hover:bg-[#5c2f14]"
              }`}
            >
              {loading ? "Mengirim..." : "Kirim Pesan"}
            </button>

            {statusMessage && (
              <div
                className={`text-sm ${
                  statusMessage.type === "success"
                    ? "text-green-300"
                    : "text-red-300"
                }`}
              >
                {statusMessage.text}
              </div>
            )}

          </form>
        </div>
      </div>

      {/* GLASS STYLE BALANCED */}
      <style>
        {`
          .glass-card {
            background: rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);

            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.15);

            box-shadow:
              0 10px 30px rgba(0,0,0,0.25),
              inset 0 1px 0 rgba(255,255,255,0.25);
          }

          .glass-input {
            width: 100%;
            padding: 12px 14px;
            border-radius: 12px;

            border: 1px solid rgba(255,255,255,0.2);
            background: rgba(255,255,255,0.05);

            backdrop-filter: blur(6px);
            -webki  t-backdrop-filter: blur(6px);

            color: white;
            outline: none;
            transition: 0.3s;
          }

          .glass-input::placeholder {
            color: rgba(255,255,255,0.6);
          }

          .glass-input:focus {
            border: 1px solid rgba(255,255,255,0.5);
            background: rgba(255,255,255,0.1);
          }
        `}
      </style>
    </div>
  );
};

export default ContactUsPage;