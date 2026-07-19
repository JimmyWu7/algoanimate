"use client";

import React from "react";
import { AlgorithmView } from "@/components/algorithm-view";
import { AlgorithmId } from "@/types/algorithms";
import { usePreferences } from "@/lib/preferences-context";
import { motion } from "framer-motion";
import { useRouter, notFound } from "next/navigation";
import { ALGORITHM_REGISTRY } from "@/lib/algorithm-registry";

interface PageProps {
  params: Promise<{ algorithmId: string }>;
}

export default function AlgorithmPage({ params }: PageProps) {
  const { algorithmId } = React.use(params);

  // Validate the algorithm ID against the existing registry
  const algorithm = ALGORITHM_REGISTRY.find((algo) => algo.id === algorithmId);
  if (!algorithm) {
    notFound();
  }

  const { reduceMotion } = usePreferences();
  const router = useRouter();

  return (
    <motion.div
      key={`algorithm-${algorithmId}`}
      initial={reduceMotion ? {} : { opacity: 0, x: 20 }}
      animate={reduceMotion ? {} : { opacity: 1, x: 0 }}
      exit={reduceMotion ? {} : { opacity: 0, x: -20 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex-1 flex flex-col overflow-hidden"
    >
      <AlgorithmView
        algorithmId={algorithm.id as AlgorithmId}
        onBack={() => router.push("/")}
      />
    </motion.div>
  );
}
