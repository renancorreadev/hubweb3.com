"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface BlockchainCubeProps {
  active?: boolean;
  mining?: boolean;
  mined?: boolean;
  hash?: string;
  onMiningComplete?: () => void;
}

const Cube = ({
  active = false,
  mining = false,
  mined = false,
  hash = "",
  onMiningComplete,
}: BlockchainCubeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { isDark } = useThemeColors();

  const [progress, setProgress] = useState(0);
  const [rotationDirection, setRotationDirection] = useState({ x: 1, y: 1 });

  const miningCompleteRef = useRef(false);

  const baseColor = isDark ? "#9945FF" : "#7A35CC";
  const minedColor = isDark ? "#14F195" : "#10B981";
  const miningColor = "#e43f5a";

  useEffect(() => {
    if (mining && !mined && !miningCompleteRef.current) {
      setProgress(0);

      setRotationDirection({
        x: Math.random() > 0.5 ? 1 : -1,
        y: Math.random() > 0.5 ? 1 : -1,
      });

      const timer = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 10;

          if (next >= 100 && !miningCompleteRef.current) {
            clearInterval(timer);
            miningCompleteRef.current = true;

            if (onMiningComplete) {
              onMiningComplete();
            }
            return 100;
          }
          return next;
        });
      }, 25);

      const maxDurationTimer = setTimeout(() => {
        if (!miningCompleteRef.current) {
          clearInterval(timer);
          miningCompleteRef.current = true;
          setProgress(100);

          if (onMiningComplete) {
            onMiningComplete();
          }
        }
      }, 3000);

      return () => {
        clearInterval(timer);
        clearTimeout(maxDurationTimer);
      };
    }
  }, [mining, mined, onMiningComplete]);

  useEffect(() => {
    if (!mined) {
      miningCompleteRef.current = false;
    }
  }, [mined]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      const rotation = active ? 0.3 : 0.1;
      const miningSpeed = mining ? 3.5 : 1;

      meshRef.current.rotation.x +=
        delta * rotation * rotationDirection.x * miningSpeed;
      meshRef.current.rotation.y +=
        delta * rotation * rotationDirection.y * miningSpeed;

      if (mining && !mined) {
        const pulse = Math.sin(Date.now() * 0.005) * 0.05;
        meshRef.current.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
      } else if (mined) {
        meshRef.current.scale.set(1.05, 1.05, 1.05);
      } else {
        meshRef.current.scale.set(1, 1, 1);
      }
    }
  });

  let currentColor = baseColor;
  if (mining && !mined) {
    const ratio = progress / 100;
    currentColor = mixColors(miningColor, minedColor, ratio);
  } else if (mined) {
    currentColor = minedColor;
  }

  return (
    <Box ref={meshRef} args={[1, 1, 1]} castShadow receiveShadow>
      <meshStandardMaterial
        color={currentColor}
        emissive={currentColor}
        emissiveIntensity={mining ? 0.5 : mined ? 0.3 : 0.1}
        metalness={0.8}
        roughness={0.2}
        wireframe={mining && !mined}
      />
    </Box>
  );
};

const mixColors = (color1: string, color2: string, ratio: number) => {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
  const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
  const b = Math.round(b1 * (1 - ratio) + b2 * ratio);

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export const BlockchainCube = ({
  active = false,
  mining = false,
  mined = false,
  hash = "",
  onMiningComplete,
}: BlockchainCubeProps) => {
  const { isDark } = useThemeColors();
  const { t } = useTranslation();
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      scale: active ? 1.05 : 1,
      rotateY: active ? [0, 180, 360] : 0,
      transition: { duration: 2, ease: "easeInOut" },
    });
  }, [active, controls]);

  return (
    <motion.div className="relative w-full h-full" animate={controls}>
      {/* Status da mineração no topo do cubo */}
      {mining && !mined && (
        <div
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-50 text-xs font-mono px-2 py-1 rounded-md text-white animate-pulse"
          style={{
            background: "linear-gradient(90deg, #e43f5a, #fd735a)",
            boxShadow: "0 0 15px rgba(228, 63, 90, 0.7)",
            minWidth: "70px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {t("developer.blockchain.status.mining")}
        </div>
      )}

      {mined && (
        <div
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-50 text-xs font-mono px-2 py-1 rounded-md text-white"
          style={{
            background: isDark
              ? "linear-gradient(90deg, #14F195, #43aa8b)"
              : "linear-gradient(90deg, #10B981, #38a169)",
            boxShadow: "0 0 15px rgba(20, 241, 149, 0.5)",
            minWidth: "70px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {t("developer.blockchain.status.verified")}
        </div>
      )}

      {/* Hash abreviado abaixo do cubo */}
      {hash && (
        <div
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-40 text-[10px] font-mono px-1.5 py-0.5 rounded bg-opacity-80 text-black dark:text-white"
          style={{
            backgroundColor: isDark
              ? "rgba(30, 30, 35, 0.8)"
              : "rgba(245, 245, 250, 0.9)",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {hash.substring(0, 8)}...
        </div>
      )}

      {/* Canvas 3D */}
      <div
        className="w-full h-full rounded-xl overflow-hidden"
        style={{
          background: `radial-gradient(circle at center, ${
            mining
              ? isDark
                ? "rgba(228, 63, 90, 0.2)"
                : "rgba(228, 63, 90, 0.1)"
              : mined
              ? isDark
                ? "rgba(20, 241, 149, 0.2)"
                : "rgba(16, 185, 129, 0.1)"
              : isDark
              ? "rgba(153, 69, 255, 0.2)"
              : "rgba(122, 53, 204, 0.1)"
          }, transparent)`,
          boxShadow: `0 0 20px ${
            mining
              ? "rgba(228, 63, 90, 0.3)"
              : mined
              ? isDark
                ? "rgba(20, 241, 149, 0.3)"
                : "rgba(16, 185, 129, 0.2)"
              : isDark
              ? "rgba(153, 69, 255, 0.2)"
              : "rgba(122, 53, 204, 0.1)"
          }`,
        }}
      >
        <Canvas shadows camera={{ position: [0, 0, 2.5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <Cube
            active={active}
            mining={mining}
            mined={mined}
            hash={hash}
            onMiningComplete={onMiningComplete}
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={active && !mining}
            autoRotateSpeed={1}
          />
        </Canvas>
      </div>
    </motion.div>
  );
};
