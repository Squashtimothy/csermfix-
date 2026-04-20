import { useCallback, useEffect, useMemo, useState } from "react";

import Navbar from "../components/navbar";

import { Instagram, Facebook, Youtube } from "lucide-react";

import hero1 from "../assets/herobaru.jpg";
import hero2 from "../assets/heroslider2.jpg";
import hero3 from "../assets/heroslider3.jpg";
import hero4 from "../assets/heroslider4.jpg";
import hero5 from "../assets/heroslider5.avif";
import hero6 from "../assets/heroslider6.jpg";

import aim1 from "../assets/aims1.jpg";
import aim2 from "../assets/aims2.jpg";
import aim3 from "../assets/aims3.jpg";

import visionImage from "../assets/vision.jpeg";
import partnerLogos from "../assets/Frame 3.png";

import ProjectPage from "./ProjectPage";
import PublicationPage from "./PublicationPage";
import OurTeamPage from "./OurTeamPage";
import NewsPage from "./NewsPage";
import ContactUsPage from "./ContactUsPage";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const normalizeResponseData = async (res) => {
  const data = await res.json();
  if (data?.data !== undefined) return data.data;
  return data;
};

export default function HomePage() {
  const apiBase = useMemo(
    () => (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, ""),
    []
  );

  const fallbackHeroImages = useMemo(
    () => [hero1, hero2, hero3, hero4, hero5, hero6],
    []
  );

  const fallbackProfile = useMemo(
    () => ({
      title: "CENTRE FOR SUSTAINABLE ENERGY & RESOURCES MANAGEMENT",
      content:
        "Founded in 2014, CSERM-UNAS has established itself as an internationally recognised centre for the assessment, development and promotion of sustainable resource management, including habitat conservation and restoration, sustainable livelihoods, and renewable energy solutions.\n\nWe specialise in working closely with local communities to develop innovative systems which can then be scaled up in collaboration with state agencies, promoting new frameworks for economic empowerment, codified land-use systems, policy briefs for relevant stakeholders and governance structures with which to address future issues.\n\nOur work is supported by a range of international partners, including some of the world’s leading universities and largest funding agencies, through which we hope Indonesia can become an example of innovative, community-focused resource and habitat conservation.",
    }),
    []
  );

  const fallbackAims = useMemo(
    () => [
      {
        id: 1,
        content:
          "Identifying and assessing renewable energy resources and appropriate technology at local levels in the remote area of Indonesia supporting sustainable livelihoods of local communities.",
        image: aim1,
      },
      {
        id: 2,
        content:
          "Collaborating with Academic, Business, Government, and Civil Society to develop Best Practices for human capital and supply chain development.",
        image: aim2,
      },
      {
        id: 3,
        content:
          "Training local communities and industry professionals in delivering the sustainability agenda and developing innovative solutions to global issues.",
        image: aim3,
      },
    ],
    []
  );

  const fallbackVisionMission = useMemo(
    () => ({
      vision_title: "Vision",
      vision_text:
        "To become a leading centre in sustainable energy and resources management through innovation, collaboration, and community empowerment.",
      mission_title: "Mission",
      mission_text:
        "Developing research, strengthening partnerships, empowering local communities, and promoting sustainable solutions for future generations.",
      image: null,
    }),
    []
  );

  const [profile, setProfile] = useState(fallbackProfile);
  const [profileLoading, setProfileLoading] = useState(true);

  const [heroSlides, setHeroSlides] = useState([]);
  const [heroLoading, setHeroLoading] = useState(true);

  const [aims, setAims] = useState([]);
  const [aimsLoading, setAimsLoading] = useState(true);

  const [visionMission, setVisionMission] = useState(fallbackVisionMission);
  const [visionMissionLoading, setVisionMissionLoading] = useState(true);

  const resolveImageUrl = useCallback(
    (image) => {
      if (!image) return "";
      if (/^https?:\/\//i.test(image)) return image;
      return `${apiBase}/uploads/${image}`;
    },
    [apiBase]
  );

  const loadProfile = useCallback(
    async (signal) => {
      try {
        setProfileLoading(true);

        const res = await fetch(`${apiBase}/api/homepage/profile`, { signal });
        if (!res.ok) throw new Error("Failed fetch profile");

        const data = await normalizeResponseData(res);

        setProfile({
          title: data?.title || fallbackProfile.title,
          content: data?.description || data?.content || fallbackProfile.content,
        });
      } catch (err) {
        console.error("LOAD PROFILE ERROR:", err);
        setProfile(fallbackProfile);
      } finally {
        setProfileLoading(false);
      }
    },
    [apiBase, fallbackProfile]
  );

  const loadHero = useCallback(
    async (signal) => {
      try {
        setHeroLoading(true);

        const res = await fetch(`${apiBase}/api/homepage/hero`, { signal });
        if (!res.ok) throw new Error("Failed fetch hero");

        const data = await normalizeResponseData(res);
        setHeroSlides(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("LOAD HERO ERROR:", err);
        setHeroSlides([]);
      } finally {
        setHeroLoading(false);
      }
    },
    [apiBase]
  );

  const loadAims = useCallback(
    async (signal) => {
      try {
        setAimsLoading(true);

        const res = await fetch(`${apiBase}/api/homepage/aims`, { signal });
        if (!res.ok) throw new Error("Failed fetch aims");

        const data = await normalizeResponseData(res);
        setAims(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("LOAD AIMS ERROR:", err);
        setAims([]);
      } finally {
        setAimsLoading(false);
      }
    },
    [apiBase]
  );

  const loadVisionMission = useCallback(
    async (signal) => {
      try {
        setVisionMissionLoading(true);

        const res = await fetch(`${apiBase}/api/homepage/vision-mission`, { signal });
        if (!res.ok) throw new Error("Failed fetch vision mission");

        const data = await normalizeResponseData(res);

        setVisionMission({
          vision_title: data?.vision_title || fallbackVisionMission.vision_title,
          vision_text: data?.vision_text || fallbackVisionMission.vision_text,
          mission_title: data?.mission_title || fallbackVisionMission.mission_title,
          mission_text: data?.mission_text || fallbackVisionMission.mission_text,
          image: data?.image || fallbackVisionMission.image,
        });
      } catch (err) {
        console.error("LOAD VISION MISSION ERROR:", err);
        setVisionMission(fallbackVisionMission);
      } finally {
        setVisionMissionLoading(false);
      }
    },
    [apiBase, fallbackVisionMission]
  );

  useEffect(() => {
    const controller = new AbortController();

    loadProfile(controller.signal);
    loadHero(controller.signal);
    loadAims(controller.signal);
    loadVisionMission(controller.signal);

    return () => controller.abort();
  }, [loadProfile, loadHero, loadAims, loadVisionMission]);

  const heroImageUrls = useMemo(() => {
    if (heroSlides.length > 0) {
      return heroSlides
        .map((item) => resolveImageUrl(item?.image))
        .filter(Boolean);
    }
    return fallbackHeroImages;
  }, [heroSlides, resolveImageUrl, fallbackHeroImages]);

  const aimsToRender = useMemo(() => {
    return aims.length > 0 ? aims : fallbackAims;
  }, [aims, fallbackAims]);

  return (
    <div className="min-h-screen flex flex-col font-sans scroll-smooth bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            {heroLoading && (
              <span className="text-sm text-gray-500">Loading hero...</span>
            )}
          </div>

          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            effect="fade"
            speed={2000}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            className="rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {heroImageUrls.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-[55vh] md:h-[65vh] lg:h-[75vh] overflow-hidden rounded-3xl">
                  <div
                    className="absolute inset-0 bg-center bg-cover scale-110 animate-zoomSlow"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                  <div className="absolute inset-0 bg-black/25 rounded-3xl" />

                  {heroSlides[index]?.caption && heroSlides.length > 0 && (
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <div className="max-w-2xl bg-black/35 backdrop-blur-sm rounded-2xl px-4 py-3">
                        <p className="font-semibold">{heroSlides[index].caption}</p>
                      </div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Profile Section */}
      <section id="profile" className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-3xl font-bold mb-6 text-[#1E9C2D]">
            {profile.title}
          </h2>
          {profileLoading && (
            <span className="text-sm text-gray-500 mt-2">Loading...</span>
          )}
        </div>

        <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line">
          {profile.content}
        </p>
      </section>

      {/* Aims */}
      <section id="aims" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-[#1E9C2D]">
              CSERM&apos;S AIMS
            </h2>
            {aimsLoading && (
              <span className="text-sm text-gray-500">Loading...</span>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {aimsToRender.map((item, index) => {
              const imageSrc =
                aims.length > 0 ? resolveImageUrl(item.image) : item.image;

              return (
                <div
                  key={item.id || index}
                  className="bg-[#1E9C2D] text-white shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition duration-300"
                >
                  <img
                    src={imageSrc}
                    alt={`Aim ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-5 text-sm md:text-base">
                    <p>{item.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section
        id="vision"
        className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center"
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1E9C2D]">
              Vision & Mission
            </h2>
            {visionMissionLoading && (
              <span className="text-sm text-gray-500">Loading...</span>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-lg text-[#1E9C2D] mb-2">
              {visionMission.vision_title || "Vision"}
            </h3>
            <p className="text-gray-800 leading-relaxed font-semibold whitespace-pre-line">
              {visionMission.vision_text}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg text-[#1E9C2D] mb-2">
              {visionMission.mission_title || "Mission"}
            </h3>
            <p className="text-gray-800 leading-relaxed font-semibold whitespace-pre-line">
              {visionMission.mission_text}
            </p>
          </div>
        </div>

        <div>
          <img
            src={visionMission.image ? resolveImageUrl(visionMission.image) : visionImage}
            alt="Vision & Mission"
            className="rounded-xl shadow-lg w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Recent Project - sumber gambar ada di ProjectPage */}
      <section id="projects" className="bg-gray-50 py-16">
        <ProjectPage />
      </section>

      <section id="publications" className="bg-white py-16">
        <PublicationPage />
      </section>

      <section id="ourteam" className="bg-gray-50 py-16">
        <OurTeamPage />
      </section>

      <section id="news" className="bg-white py-16">
        <NewsPage />
      </section>

      <section id="contact" className="bg-white py-16">
        <ContactUsPage />
      </section>

      <footer className="bg-gradient-to-br from-[#d9cbba] to-[#cdbca6] mt-16 pt-16 pb-10">
  <div className="max-w-6xl mx-auto px-6">

    {/* GRID */}
    <div className="grid md:grid-cols-4 gap-10 text-sm text-black/90">

      {/* ABOUT */}
      <div>
        <h3 className="font-bold text-lg mb-3 text-[#1E9C2D]">
          CSERM UNAS
        </h3>
        <p className="leading-relaxed text-black/80">
          Centre for Sustainable Energy & Resources Management focuses on
          sustainable development, renewable energy innovation, and
          community empowerment across Indonesia.
        </p>
      </div>

      {/* QUICK LINKS */}
      <div>
        <h3 className="font-bold text-lg mb-3 text-[#1E9C2D]">
          Quick Links
        </h3>

        <ul className="space-y-2">
          <li>
            <a href="#profile" className="hover:text-[#1E9C2D] transition">
              Profile
            </a>
          </li>
          <li>
            <a href="#projects" className="hover:text-[#1E9C2D] transition">
              Projects
            </a>
          </li>
          <li>
            <a href="#publications" className="hover:text-[#1E9C2D] transition">
              Publications
            </a>
          </li>
          <li>
            <a href="#ourteam" className="hover:text-[#1E9C2D] transition">
             CSERM Team
            </a>
          </li>
          <li>
            <a href="#news" className="hover:text-[#1E9C2D] transition">
             news
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-[#1E9C2D] transition">
              Contact
            </a>
          </li>
        </ul>
      </div>

      {/* CONTACT */}
      <div>
        <h3 className="font-bold text-lg mb-3 text-[#1E9C2D]">
          Contact
        </h3>

        <ul className="space-y-2 text-black/80">
          <li>Jl. Sawo Manila No.61, RT.14/RW.7, Pejaten Bar. Ps. Minggu, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12520</li>
          <li>Email: cserm@unas.ac.id</li>
        </ul>
      </div>

      {/* SOCIAL MEDIA */}
      <div>
        <h3 className="font-bold text-lg mb-3 text-[#1E9C2D]">
          Follow Us
        </h3>

        <div className="flex gap-4 mt-3">

          {/* Instagram */}
          <a
            href="https://www.instagram.com/cserm_unas/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-[#E1306C] hover:text-white transition"
          >
            <Instagram size={18} />
          </a>

          {/* YouTube */}
          <a
            href="https://www.youtube.com/@csermunas2204"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-red-600 hover:text-white transition"
          >
            <Youtube size={18} />
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/cserm.unas.1/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-blue-600 hover:text-white transition"
          >
            <Facebook size={18} />
          </a>

        </div>
      </div>

    </div>

    {/* PARTNERS */}
    <div className="mt-14">

      <h3 className="text-center font-bold text-[#1E9C2D] mb-6">
        Our Partners
      </h3>

      <div className="flex justify-center">
        <img
          src={partnerLogos}
          alt="Partner Logos"
          className="max-w-4xl w-full object-contain opacity-90 hover:opacity-100 transition"
        />
      </div>

    </div>

    {/* DIVIDER */}
    <div className="border-t border-black/20 my-8"></div>

    {/* COPYRIGHT */}
    <div className="text-center text-sm text-black/80">
      © {new Date().getFullYear()} CSERM Universitas Nasional. All rights reserved.
    </div>

  </div>
</footer>
    </div>
  );
}