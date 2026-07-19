"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HelpCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      id="not-found-view"
      className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950/40 text-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
          <HelpCircle className="h-8 w-8 text-emerald-400" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-2">
          Algorithm Not Found
        </h1>
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
          The algorithm you are looking for does not exist in our simulation
          engine registry, or the URL is incorrect.
        </p>

        <Link
          id="btn-back-to-dashboard-404"
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
