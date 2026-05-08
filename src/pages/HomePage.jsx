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

import {
  Autoplay,
  Pagination,
  Navigation,
  EffectFade,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const API_BASE = (
  process.env.REACT_APP_API_URL ||
  "https://resilient-balance-production-57f8.up.railway.app"
).replace(/\/$/, "");

const normalizeResponseData = async (res) => {
  const data = await res.json();

  if (data?.data !== undefined) {
    return data.data;
  }

  return data;
};

export default function HomePage() {
  /* =========================
      FALLBACK DATA
  ========================= */

  const fallbackHeroImages = useMemo(
    () => [hero1, hero2, hero3, hero4, hero5, hero6],
    []
  );

  const fallbackProfile = useMemo(
    () => ({
      title:
        "CENTRE FOR SUSTAINABLE ENERGY & RESOURCES MANAGEMENT",

      content:
        "Founded in 2014, CSERM-UNAS has established itself as an internationally recognised centre for the assessment, development and promotion of sustainable resource management.",
    }),
    []
  );

  const fallbackAims = useMemo(
    () => [
      {
        id: 1,
        content:
          "Identifying and assessing renewable energy resources.",
        image: aim1,
      },

      {
        id: 2,
        content:
          "Collaborating with Academic, Business, Government, and Civil Society.",
        image: aim2,
      },

      {
        id: 3,
        content:
          "Training local communities and industry professionals.",
        image: aim3,
      },
    ],
    []
  );

  const fallbackVisionMission = useMemo(
    () => ({
      vision_title: "Vision",

      vision_text:
        "To become a leading centre in sustainable energy and resources management.",

      mission_title: "Mission",

      mission_text:
        "Developing research, strengthening partnerships, and empowering local communities.",

      image: null,
    }),
    []
  );

  /* =========================
      STATES
  ========================= */

  const [profile, setProfile] =
    useState(fallbackProfile);

  const [heroSlides, setHeroSlides] = useState([]);

  const [aims, setAims] = useState([]);

  const [visionMission, setVisionMission] =
    useState(fallbackVisionMission);

  /* =========================
      IMAGE URL
  ========================= */

  const resolveImageUrl = useCallback((image) => {
    if (!image) return "";

    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    return `${API_BASE}/uploads/${image}`;
  }, []);

  /* =========================
      LOAD PROFILE
  ========================= */

  const loadProfile = useCallback(async (signal) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/homepage/profile`,
        { signal }
      );

      if (!res.ok) {
        throw new Error("Failed fetch profile");
      }

      const data =
        await normalizeResponseData(res);

      setProfile({
        title:
          data?.title ||
          fallbackProfile.title,

        content:
          data?.description ||
          data?.content ||
          fallbackProfile.content,
      });
    } catch (err) {
      console.error("PROFILE ERROR:", err);

      setProfile(fallbackProfile);
    }
  }, [fallbackProfile]);

  /* =========================
      LOAD HERO
  ========================= */

  const loadHero = useCallback(async (signal) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/homepage/hero`,
        { signal }
      );

      if (!res.ok) {
        throw new Error("Failed fetch hero");
      }

      const data =
        await normalizeResponseData(res);

      setHeroSlides(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error("HERO ERROR:", err);

      setHeroSlides([]);
    }
  }, []);

  /* =========================
      LOAD AIMS
  ========================= */

  const loadAims = useCallback(async (signal) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/homepage/aims`,
        { signal }
      );

      if (!res.ok) {
        throw new Error("Failed fetch aims");
      }

      const data =
        await normalizeResponseData(res);

      setAims(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("AIMS ERROR:", err);

      setAims([]);
    }
  }, []);

  /* =========================
      LOAD VISION MISSION
  ========================= */

  const loadVisionMission = useCallback(
    async (signal) => {
      try {
        const res = await fetch(
          `${API_BASE}/api/homepage/vision-mission`,
          { signal }
        );

        if (!res.ok) {
          throw new Error(
            "Failed fetch vision mission"
          );
        }

        const data =
          await normalizeResponseData(res);

        setVisionMission({
          vision_title:
            data?.vision_title ||
            fallbackVisionMission.vision_title,

          vision_text:
            data?.vision_text ||
            fallbackVisionMission.vision_text,

          mission_title:
            data?.mission_title ||
            fallbackVisionMission.mission_title,

          mission_text:
            data?.mission_text ||
            fallbackVisionMission.mission_text,

          image:
            data?.image ||
            fallbackVisionMission.image,
        });
      } catch (err) {
        console.error(
          "VISION MISSION ERROR:",
          err
        );

        setVisionMission(
          fallbackVisionMission
        );
      }
    },
    [fallbackVisionMission]
  );

  /* =========================
      INITIAL LOAD
  ========================= */

  useEffect(() => {
    const controller = new AbortController();

    loadProfile(controller.signal);
    loadHero(controller.signal);
    loadAims(controller.signal);
    loadVisionMission(controller.signal);

    return () => controller.abort();
  }, [
    loadProfile,
    loadHero,
    loadAims,
    loadVisionMission,
  ]);

  /* =========================
      COMPUTED
  ========================= */

  const heroImageUrls = useMemo(() => {
    if (heroSlides.length > 0) {
      return heroSlides
        .map((item) =>
          resolveImageUrl(item?.image)
        )
        .filter(Boolean);
    }

    return fallbackHeroImages;
  }, [
    heroSlides,
    resolveImageUrl,
    fallbackHeroImages,
  ]);

  const aimsToRender = useMemo(() => {
    return aims.length > 0
      ? aims
      : fallbackAims;
  }, [aims, fallbackAims]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative w-full pt-20 pb-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <Swiper
            modules={[
              Autoplay,
              Pagination,
              Navigation,
              EffectFade,
            ]}
            effect="fade"
            speed={1200}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation
            className="rounded-3xl overflow-hidden shadow-2xl"
          >
            {heroImageUrls.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-[45vh] md:h-[70vh]">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${img})`,
                    }}
                  />

                  <div className="absolute inset-0 bg-black/30" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* PROFILE */}
      <section
        id="profile"
        className="max-w-6xl mx-auto px-6 py-16"
      >
        <h2 className="text-3xl font-bold mb-6 text-[#1E9C2D]">
          {profile.title}
        </h2>

        <p className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
          {profile.content}
        </p>
      </section>

      {/* AIMS */}
      <section
        id="aims"
        className="bg-gray-50 py-16"
      >
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#1E9C2D] mb-10">
            CSERM'S AIMS
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {aimsToRender.map((item, index) => {
              const imageSrc =
                aims.length > 0
                  ? resolveImageUrl(item.image)
                  : item.image;

              return (
                <div
                  key={item.id || index}
                  className="bg-[#1E9C2D] text-white rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition"
                >
                  <img
                    src={imageSrc}
                    alt="aim"
                    className="w-full h-64 object-cover"
                  />

                  <div className="p-5">
                    <p>{item.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VISION */}
      <section
        id="vision"
        className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center"
      >
        <div>
          <h2 className="text-2xl font-bold text-[#1E9C2D] mb-6">
            Vision & Mission
          </h2>

          <h3 className="font-bold text-lg mb-2 text-[#1E9C2D]">
            {visionMission.vision_title}
          </h3>

          <p className="mb-6 whitespace-pre-line">
            {visionMission.vision_text}
          </p>

          <h3 className="font-bold text-lg mb-2 text-[#1E9C2D]">
            {visionMission.mission_title}
          </h3>

          <p className="whitespace-pre-line">
            {visionMission.mission_text}
          </p>
        </div>

        <div>
          <img
            src={
              visionMission.image
                ? resolveImageUrl(
                    visionMission.image
                  )
                : visionImage
            }
            alt="vision"
            className="rounded-2xl shadow-xl"
          />
        </div>
      </section>

      {/* OTHER SECTION */}
      <section id="projects">
        <ProjectPage />
      </section>

      <section id="publications">
        <PublicationPage />
      </section>

      <section id="ourteam">
        <OurTeamPage />
      </section>

      <section id="news">
        <NewsPage />
      </section>

      <section id="contact">
        <ContactUsPage />
      </section>

      {/* FOOTER */}
      <footer className="bg-[#d9cbba] mt-20 pt-16 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <h3 className="font-bold text-[#1E9C2D] mb-3">
                CSERM UNAS
              </h3>

              <p className="text-sm">
                Centre for Sustainable Energy &
                Resources Management.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#1E9C2D] mb-3">
                Follow Us
              </h3>

              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/cserm_unas/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Instagram />
                </a>

                <a
                  href="https://www.youtube.com/@csermunas2204"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Youtube />
                </a>

                <a
                  href="https://www.facebook.com/cserm.unas.1/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Facebook />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-14 flex justify-center">
            <img
              src={partnerLogos}
              alt="partners"
              className="max-w-4xl w-full"
            />
          </div>

          <div className="border-t border-black/20 mt-10 pt-6 text-center text-sm">
            © {new Date().getFullYear()} CSERM
            Universitas Nasional
          </div>
        </div>
      </footer>
    </div>
  );
}