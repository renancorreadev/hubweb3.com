"use client";

import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { mobileOnly, desktopOnly } from "@/shared/configs/responsive";
import "./styles.css";
import { RenderContainer } from "@/shared/components/RenderContainer";
import { Button } from "@/components/Button";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  /** URL para onde o slide redireciona quando clicado */
  linkUrl: string;
}

interface HeroSliderProps {
  /** Array de projetos a serem exibidos no slider. Cada projeto deve ter id, título, subtítulo, URL da imagem e URL do link */
  projects: Project[];
  /** Altura do slider. Pode ser um valor em px, rem, vh, etc. Exemplo: '400px', '50vh' */
  height?: string;
  /** Largura do slider. Pode ser um valor em px, rem, vw, etc. Exemplo: '100%', '800px' */
  width?: string;
  /** Classes CSS adicionais para o container */
  className?: string;
  /** Opacidade do overlay escuro sobre a imagem (0-100) */
  overlayOpacity?: number;
  /** Opacidade do container de texto com efeito glass (0-100) */
  textContainerOpacity?: number;
  /** Opacidade do texto (0-100) */
  textOpacity?: number;
  /** Intensidade do efeito blur no container de texto (0-20) */
  blurIntensity?: number;
  /** Border radius do slider principal em pixels */
  borderRadius?: number;
  /** Border radius do container de texto em pixels */
  textContainerRadius?: number;
  /** Border radius da imagem em pixels */
  imageRadius?: number;
  /** Define se o botão será exibido */
  showButton?: boolean;
  /** Texto do botão */
  buttonText?: string;
}

export const HeroSlider = ({
  projects,
  height = "400px",
  width = "100%",
  className = "",
  overlayOpacity = 100,
  textContainerOpacity = 10,
  textOpacity = 100,
  blurIntensity = 12,
  borderRadius = 0,
  textContainerRadius = 16,
  imageRadius = 0,
  showButton = false,
  buttonText = "Start Building",
}: HeroSliderProps) => {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Obtém o link do projeto ativo
  const activeLink = projects[activeIndex]?.linkUrl || "#";
  
  // Validação e normalização das opacidades e raios
  const safeOverlayOpacity = Math.max(0, Math.min(100, overlayOpacity)) / 100;
  const safeTextContainerOpacity =
    Math.max(0, Math.min(100, textContainerOpacity)) / 100;
  const safeTextOpacity = Math.max(0, Math.min(100, textOpacity)) / 100;
  const safeBlurIntensity = Math.max(0, Math.min(20, blurIntensity));
  const safeBorderRadius = Math.max(0, borderRadius);
  const safeTextContainerRadius = Math.max(0, textContainerRadius);
  const safeImageRadius = Math.max(0, imageRadius);

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) return null;

  const textContainerStyle = {
    "--tw-backdrop-blur": `blur(${safeBlurIntensity}px)`,
    backgroundColor: `rgba(255, 255, 255, ${safeTextContainerOpacity})`,
    borderRadius: `${safeTextContainerRadius}px`,
  } as React.CSSProperties;

  const overlayStyle = {
    "--overlay-opacity": safeOverlayOpacity,
    borderRadius: `${safeImageRadius}px`,
  } as React.CSSProperties;

  const imageStyle = {
    borderRadius: `${safeImageRadius}px`,
  } as React.CSSProperties;

  return (
    <RenderContainer>
      <motion.div
        className={`${className} overflow-hidden bg-white  dark:bg-black`}
        style={{
          height,
          width,
          borderRadius: `${safeBorderRadius}px`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          speed={1000}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            enabled: true,
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          pagination={{
            enabled: true,
            el: ".swiper-pagination",
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className} swiper-pagination-bullet-custom"></span>`;
            },
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full relative overflow-hidden"
        >
          {projects.map((project, index) => (
            <SwiperSlide key={project.id}>
              <Link 
                href={project.linkUrl}
                className="block relative w-full h-full overflow-hidden cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <motion.div
                  className="hero-image absolute inset-0 bg-cover bg-center"
                  style={{
                    ...imageStyle,
                    backgroundImage: `url(${project.imageUrl})`,
                  }}
                  initial={{ scale: 1.05 }}
                  animate={{ 
                    scale: isHovered ? 1.08 : 1.05,
                    transition: { duration: 1.5 }
                  }}
                >
                  <motion.div
                    className="hero-overlay absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"
                    initial={{ opacity: 0.8 }}
                    animate={{ 
                      opacity: isHovered ? 0.6 : 0.8,
                      transition: { duration: 0.5 }
                    }}
                  />
                </motion.div>

                <div
                  className="relative h-full flex flex-col justify-end items-start p-4 sm:p-6 md:p-8 lg:p-12"
                >
                  <motion.div
                    className="text-container p-5 md:p-6 max-w-lg w-full sm:w-auto rounded-lg mb-8 md:mb-10 bg-black bg-opacity-80 backdrop-blur-md shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    whileHover={{
                      backgroundColor: "rgba(0, 0, 0, 0.9)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
                      transition: { duration: 0.3 }
                    }}
                  >
                    <motion.h1
                      className="hero-title font-bold mb-2 md:mb-3 text-white text-xl sm:text-2xl md:text-3xl"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      whileHover={{
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)"
                      }}
                    >
                      {project.title}
                    </motion.h1>
                    <motion.p
                      className="hero-subtitle text-gray-200 text-sm sm:text-base md:text-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      whileHover={{
                        textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)"
                      }}
                    >
                      {project.subtitle}
                    </motion.p>
                  </motion.div>
                </div>
              </Link>
            </SwiperSlide>
          ))}

          {/* Elementos de navegação */}

          <div className="swiper-pagination" />

          {/* Botão flutuante que fica fora do ciclo de slides mas dentro do Swiper */}
          {showButton && (
            <motion.div 
              className="hero-slider-button-container absolute bottom-8 left-8 md:left-14 md:bottom-10 z-30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button 
                variant="secondary"
                href={activeLink}
                className="shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {buttonText}
              </Button>
            </motion.div>
          )}
        </Swiper>
      </motion.div>
    </RenderContainer>
  );
};
