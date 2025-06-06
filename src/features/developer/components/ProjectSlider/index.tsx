"use client";

import { HeroSlider } from "@/components/HeroSlider";
import { Heading2, Typography } from "@/components/Typography";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import { motion } from "framer-motion";

export const ProjectSlider = () => {
  const { t } = useTranslation();
  const { isDark, getColor } = useThemeColors();

  const projects = [
    {
      id: 1,
      title: t("developer.projects.creatorPro.title"),
      subtitle: t("developer.projects.creatorPro.description"),
      imageUrl: "/images/projects/CreatorPro.png",
      linkUrl: "/projects/creator-pro",
    },
    {
      id: 2,
      title: t("developer.projects.explorer.title"),
      subtitle: t("developer.projects.explorer.description"),
      imageUrl: "/images/projects/loyahub/screen/app.png",
      linkUrl: "/projects/loyahub",
    },
    {
      id: 3,
      title: t("developer.projects.rwa.title"),
      subtitle: t("developer.projects.rwa.description"),
      imageUrl: "/images/projects/rwahub/rwa.png",
      linkUrl: "/projects/asset-tokenization",
    },
    // {
    //   id: 2,
    //   title: t('developer.projects.drex.title'),
    //   subtitle: t('developer.projects.drex.description'),
    //   imageUrl: "/images/projects/drex.jpg",
    //   linkUrl: "/projects/drex",
    // },
    // {
    //   id: 3,
    //   title: t('developer.projects.assetToken.title'),
    //   subtitle: t('developer.projects.assetToken.description'),
    //   imageUrl: "/images/projects/tokenization.jpg",
    //   linkUrl: "/projects/asset-tokenization",
    // },
  ];

  return (
    <section
      className="py-16"
      style={{
        backgroundColor: isDark
          ? "rgba(10, 10, 10, 1)"
          : "rgba(248, 249, 250, 1)",
      }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-start mb-10"
        >
          <Heading2>{t("developer.projects.title")}</Heading2>
        </motion.div>

        <HeroSlider
          projects={projects}
          height="500px"
          width="100%"
          overlayOpacity={70}
          textContainerOpacity={20}
          blurIntensity={8}
          borderRadius={20}
          textContainerRadius={12}
          imageRadius={20}
          buttonText={t("developer.cta.projects")}
          showButton={false}
        />
      </div>
    </section>
  );
};
