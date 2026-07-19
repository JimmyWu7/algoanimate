"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { PreferencesPanel } from "@/components/settings";
import { AlgorithmId } from "@/types/algorithms";
import { usePreferences } from "@/lib/preferences-context";
import { AnimatePresence, motion } from "framer-motion";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [openSettings, setOpenSettings] = useState(false);

  // Read preferences from shared context
  const {
    defaultProcessorCount,
    setDefaultProcessorCount,
    reduceMotion,
    setReduceMotion,
    visualTheme,
    setVisualTheme,
  } = usePreferences();

  // Derive activeAlgorithmId from URL pathname
  const algoMatch = pathname.match(/^\/algorithms\/([^/]+)/);
  const activeAlgorithmId = algoMatch ? (algoMatch[1] as AlgorithmId) : null;

  const handleSelectAlgorithm = (id: AlgorithmId | null) => {
    if (id) {
      router.push(`/algorithms/${id}`);
    } else {
      router.push("/");
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
          {openSettings ? (
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
          ) : (
            <div
              key="page-content"
              className="flex-1 flex flex-col overflow-hidden"
            >
              {children}
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
