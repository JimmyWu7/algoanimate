"use client";

import React from "react";
import { motion } from "framer-motion";
import { Dashboard } from "@/components/dashboard";
import { usePreferences } from "@/lib/preferences-context";
import { useRouter } from "next/navigation";
import { AlgorithmId } from "@/types/algorithms";

export default function Home() {
  const { reduceMotion } = usePreferences();
  const router = useRouter();

  const handleSelectAlgorithm = (id: AlgorithmId | null) => {
    if (id) {
      router.push(`/algorithms/${id}`);
    } else {
      router.push("/");
    }
  };

  return (
    <motion.div
      key="dashboard"
      initial={reduceMotion ? {} : { opacity: 0, y: 12 }}
      animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
      exit={reduceMotion ? {} : { opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="flex-1 flex flex-col overflow-hidden"
    >
      <Dashboard onSelectAlgorithm={handleSelectAlgorithm} />
    </motion.div>
  );
}
