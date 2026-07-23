"use client";

import React from "react";
import { PreferencesPanel } from "@/components/settings";
import { usePreferences } from "@/lib/preferences-context";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const {
    defaultProcessorCount,
    setDefaultProcessorCount,
    reduceMotion,
    setReduceMotion,
    visualTheme,
    setVisualTheme,
  } = usePreferences();

  return (
    <motion.div
      key="settings"
      initial={reduceMotion ? {} : { opacity: 0, y: 15 }}
      animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
      exit={reduceMotion ? {} : { opacity: 0, y: -15 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="flex-1 flex flex-col overflow-hidden"
    >
      <PreferencesPanel
        defaultProcessorCount={defaultProcessorCount}
        setDefaultProcessorCount={setDefaultProcessorCount}
        reduceMotion={reduceMotion}
        setReduceMotion={setReduceMotion}
        visualTheme={visualTheme}
        setVisualTheme={setVisualTheme}
        onBackToDashboard={() => router.push("/")}
      />
    </motion.div>
  );
}
