import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import Navbar from "../components/navbar";

import {
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";

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

import {
  getHeroPublic,
  getAimsPublic,
  getHomepageProfile,
  getVisionMission,
  resolveImage,
} from "../services/homepageService";

export default function HomePage() {
  const fallbackHeroImages = useMemo(
    () => [
      hero1,
      hero2,
      hero3,
      hero4,
      hero5,
      hero6,
    ],
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
        "To become a leading centre in sustainable energy.",

      mission_title: "Mission",

      mission_text:
        "Developing research and empowering communities.",

      image: null,
    }),
    []
  );

  const [profile, setProfile] =
    useState(fallbackProfile);

  const [heroSlides, setHeroSlides] =
    useState([]);

  const [aims, setAims] = useState([]);

  const [visionMission, setVisionMission] =
    useState(fallbackVisionMission);

  const loadHomepage = useCallback(async () => {
    try {
      const [
        heroRes,
        aimsRes,
        profileRes,
        visionMissionRes,
      ] = await Promise.all([
        getHeroPublic(),
        getAimsPublic(),
        getHomepageProfile(),
        getVisionMission(),
      ]);

      // HERO
      const heroData = Array.isArray(
        heroRes?.data
      )
        ? heroRes.data
        : heroRes?.data?.data || [];

      setHeroSlides(heroData);

      // AIMS
      const aimsData = Array.isArray(
        aimsRes?.data
      )
        ? aimsRes.data
        : aimsRes?.data?.data || [];

      setAims(aimsData);

      // PROFILE
      const profileData =
        profileRes?.data?.data ||
        profileRes?.data ||
        {};

      setProfile({
        title:
          profileData?.title ||
          fallbackProfile.title,

        content:
          profileData?.description ||
          profileData?.content ||
          fallbackProfile.content,
      });

      // VISION MISSION
      const vmData =
        visionMissionRes?.data?.data ||
        visionMissionRes?.data ||
        {};

      setVisionMission({
        vision_title:
          vmData?.vision_title ||
          fallbackVisionMission.vision_title,

        vision_text:
          vmData?.vision_text ||
          fallbackVisionMission.vision_text,

        mission_title:
          vmData?.mission_title ||
          fallbackVisionMission.mission_title,

        mission_text:
          vmData?.mission_text ||
          fallbackVisionMission.mission_text,

        image: vmData?.image || null,
      });
    } catch (err) {
      console.error(
        "HOMEPAGE ERROR:",
        err
      );

      setHeroSlides([]);

      setAims([]);

      setProfile(fallbackProfile);

      setVisionMission(
        fallbackVisionMission
      );
    }
  }, [
    fallbackProfile,
    fallbackVisionMission,
  ]);

  useEffect(() => {
    loadHomepage();
  }, [loadHomepage]);

  const heroImageUrls =
    heroSlides.length > 0
      ? heroSlides
          .map((item) =>
            resolveImage(item?.image)
          )
          .filter(Boolean)
      : fallbackHeroImages;

  const aimsToRender =
    aims.length > 0
      ? aims
      : fallbackAims;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* HERO */}
      <section className="relative w-full pt-20 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <Swiper
            modules={[
              Autoplay,
              Pagination,
              Navigation,
              EffectFade,
            ]}
            effect="fade"
            speed={2000}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation
            className="rounded-3xl shadow-2xl overflow-hidden"
          >
            {heroImageUrls.map(
              (img, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-[70vh]">
                    <img
                      src={img}
                      alt="Hero"
                      className="w-full h-full object-cover"
                    />

                    {heroSlides[index]
                      ?.caption && (
                      <div className="absolute bottom-6 left-6 text-white">
                        <div className="bg-black/40 px-4 py-2 rounded-xl">
                          {
                            heroSlides[
                              index
                            ].caption
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              )
            )}
          </Swiper>
        </div>
      </section>

      {/* PROFILE */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-[#1E9C2D] mb-6">
          {profile.title}
        </h2>

        <p className="text-gray-700 whitespace-pre-line">
          {profile.content}
        </p>
      </section>

      {/* AIMS */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#1E9C2D] mb-10">
            CSERM'S AIMS
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {aimsToRender.map(
              (item, index) => (
                <div
                  key={
                    item.id || index
                  }
                  className="bg-[#1E9C2D] text-white rounded-xl overflow-hidden"
                >
                  <img
                    src={
                      aims.length > 0
                        ? resolveImage(
                            item.image
                          )
                        : item.image
                    }
                    alt="Aim"
                    className="w-full h-64 object-cover"
                  />

                  <div className="p-5">
                    <p>
                      {item.content}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* VISION MISSION */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-[#1E9C2D] mb-6">
            Vision & Mission
          </h2>

          <h3 className="font-bold mb-2">
            {
              visionMission.vision_title
            }
          </h3>

          <p className="mb-6 whitespace-pre-line">
            {
              visionMission.vision_text
            }
          </p>

          <h3 className="font-bold mb-2">
            {
              visionMission.mission_title
            }
          </h3>

          <p className="whitespace-pre-line">
            {
              visionMission.mission_text
            }
          </p>
        </div>

        <div>
          <img
            src={
              visionMission.image
                ? resolveImage(
                    visionMission.image
                  )
                : visionImage
            }
            alt="Vision"
            className="rounded-xl shadow-lg w-full"
          />
        </div>
      </section>

      {/* OTHER SECTIONS */}
      <ProjectPage />

      <PublicationPage />

      <OurTeamPage />

      <NewsPage />

      <ContactUsPage />

      {/* FOOTER */}
      <footer className="bg-[#d9cbba] mt-16 py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <img
            src={partnerLogos}
            alt="Partners"
            className="mx-auto mb-8"
          />

          <div className="flex justify-center gap-4 mb-6">
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

          <p>
            ©{" "}
            {new Date().getFullYear()}{" "}
            CSERM Universitas Nasional
          </p>
        </div>
      </footer>
    </div>
  );
}