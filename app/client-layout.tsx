"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { AlgorithmId } from "@/types/algorithms";
import { AnimatePresence } from "framer-motion";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Derive activeAlgorithmId from URL pathname
  const algoMatch = pathname.match(/^\/algorithms\/([^/]+)/);
  const activeAlgorithmId = algoMatch ? (algoMatch[1] as AlgorithmId) : null;

  const isSettings = pathname === "/settings";

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
        openSettings={isSettings}
        setOpenSettings={(open) => {
          if (open) {
            router.push("/settings");
          }
        }}
      />

      {/* Main Content Area Container with dynamic transitions */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <AnimatePresence mode="wait">
          <div key={pathname} className="flex-1 flex flex-col overflow-hidden">
            {children}
          </div>
        </AnimatePresence>
      </div>
    </main>
  );
}
