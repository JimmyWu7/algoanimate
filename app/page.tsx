"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Dashboard } from "@/components/dashboard";
import { AlgorithmView } from "@/components/algorithm-view";
import { PreferencesPanel } from "@/components/settings";
import { AlgorithmId } from "@/types/algorithms";

export default function Home() {
  const [activeAlgorithmId, setActiveAlgorithmId] =
    useState<AlgorithmId | null>(null);
  const [openSettings, setOpenSettings] = useState(false);

  // Settings Configuration states
  const [defaultProcessorCount, setDefaultProcessorCount] = useState<number>(4);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  const [visualTheme, setVisualTheme] = useState<
    "cosmic-zinc" | "aurora-emerald"
  >("cosmic-zinc");

  const handleSelectAlgorithm = (id: AlgorithmId | null) => {
    setActiveAlgorithmId(id);
    if (id !== null) {
      setOpenSettings(false);
    }
  };

  return (
    <main className="flex h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeAlgorithmId={activeAlgorithmId}
        onSelectAlgorithm={handleSelectAlgorithm}
        openSettings={openSettings}
        setOpenSettings={setOpenSettings}
      />

      {/* Main Content Area Container with dynamic transitions */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeAlgorithmId === null && !openSettings && (
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
          )}

          {activeAlgorithmId !== null && (
            <motion.div
              key={`algorithm-${activeAlgorithmId}`}
              initial={reduceMotion ? {} : { opacity: 0, x: 20 }}
              animate={reduceMotion ? {} : { opacity: 1, x: 0 }}
              exit={reduceMotion ? {} : { opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <AlgorithmView
                algorithmId={activeAlgorithmId}
                onBack={() => handleSelectAlgorithm(null)}
              />
            </motion.div>
          )}

          {openSettings && (
            <motion.div
              key="preferences"
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
                onBackToDashboard={() => setOpenSettings(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
