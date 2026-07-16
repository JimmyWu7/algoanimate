"use client";

import React, { useState } from "react";
import {
  Layers,
  GitBranch,
  Cpu,
  Search,
  Activity,
  Zap,
  Clock,
  ArrowRight,
  TrendingUp,
  Server,
  BookOpen,
} from "lucide-react";
import { ALGORITHM_REGISTRY } from "@/lib/algorithm-registry";
import { AlgorithmId } from "@/types/algorithms";

interface DashboardProps {
  onSelectAlgorithm: (id: AlgorithmId) => void;
}

export function Dashboard({ onSelectAlgorithm }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "sequential" | "parallel">(
    "all",
  );

  // Filter algorithms
  const filtered = ALGORITHM_REGISTRY.filter((alg) => {
    const matchesSearch =
      alg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alg.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alg.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "sequential" && alg.type === "sequential") ||
      (activeTab === "parallel" && alg.type === "parallel");

    return matchesSearch && matchesTab;
  });

  const sequentialCount = ALGORITHM_REGISTRY.filter(
    (a) => a.type === "sequential",
  ).length;
  const parallelCount = ALGORITHM_REGISTRY.filter(
    (a) => a.type === "parallel",
  ).length;

  return (
    <div
      id="dashboard-container"
      className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 p-6 md:p-10 space-y-10"
    >
      {/* Dynamic Animated Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-900 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 h-96 w-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 h-72 w-72 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
            <Zap className="h-3 w-3" />
            <span>Interactive Algorithmic Sandbox</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold font-sans tracking-tight text-white leading-[1.1]">
            Visualize Sequential &{" "}
            <span className="text-emerald-400">Parallel</span> Computing
            Complexity.
          </h1>

          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            Explore execution loops, processor communication topologies, and
            cost-complexity metrics in real-time. Learn the transition from
            linear RAM processing to complex PRAM networks, Ring, Mesh, and
            Hypercube hardware topologies.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onSelectAlgorithm("parallel-reduction")}
              className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              <span>Explore Parallel Reduction</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onSelectAlgorithm("dijkstra")}
              className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 transition"
            >
              Learn Dijkstra&apos;s Routing
            </button>
          </div>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Total Algorithms */}
        <div className="bg-zinc-950/60 border border-zinc-900 p-5 rounded-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-500 uppercase">
              Core Registries
            </span>
            <Cpu className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-semibold text-white">
              {ALGORITHM_REGISTRY.length}
            </div>
            <div className="text-[11px] text-zinc-400">
              Supported algorithms and models
            </div>
          </div>
        </div>

        {/* Card 2: Sequential Core */}
        <div className="bg-zinc-950/60 border border-zinc-900 p-5 rounded-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-500 uppercase">
              Sequential
            </span>
            <Layers className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-semibold text-white">
              {sequentialCount}
            </div>
            <div className="text-[11px] text-zinc-400">
              Single-core RAM model pipelines
            </div>
          </div>
        </div>

        {/* Card 3: Parallel Core */}
        <div className="bg-zinc-950/60 border border-zinc-900 p-5 rounded-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-500 uppercase">
              Parallel
            </span>
            <GitBranch className="h-4 w-4 text-violet-400" />
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-semibold text-white">
              {parallelCount}
            </div>
            <div className="text-[11px] text-zinc-400">
              Multi-processor PRAM & Interconnects
            </div>
          </div>
        </div>

        {/* Card 4: Work-Span Metric Theory */}
        <div className="bg-zinc-950/60 border border-zinc-900 p-5 rounded-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-500 uppercase">
              Work-Span Theory
            </span>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-semibold text-white">O(W / S)</div>
            <div className="text-[11px] text-zinc-400">
              Speedup bound (Brent&apos;s Theorem)
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Database Search and Selection */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-3 text-sm font-medium border-b-2 transition ${
                activeTab === "all"
                  ? "border-emerald-500 text-white font-semibold"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              All Engines
            </button>
            <button
              onClick={() => setActiveTab("sequential")}
              className={`pb-3 text-sm font-medium border-b-2 transition ${
                activeTab === "sequential"
                  ? "border-emerald-500 text-white font-semibold"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Sequential (RAM)
            </button>
            <button
              onClick={() => setActiveTab("parallel")}
              className={`pb-3 text-sm font-medium border-b-2 transition ${
                activeTab === "parallel"
                  ? "border-emerald-500 text-white font-semibold"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Parallel Networks
            </button>
          </div>

          <div className="relative flex items-center w-full md:w-80">
            <Search className="absolute left-3 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search algorithm database..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-900 rounded-lg py-2 pl-10 pr-4 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-800 transition"
            />
          </div>
        </div>

        {/* Algorithm Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map((alg) => (
            <div
              key={alg.id}
              onClick={() => onSelectAlgorithm(alg.id)}
              className="group bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800/80 rounded-xl p-5 space-y-4 hover:shadow-xl transition duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-medium tracking-wider text-zinc-500 uppercase px-2 py-0.5 rounded bg-zinc-900">
                    {alg.category}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                    <Server className="h-3 w-3" />
                    <span>{alg.model}</span>
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition">
                  {alg.name}
                </h3>

                <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                  {alg.description}
                </p>
              </div>

              {/* Complexities List footer */}
              <div className="pt-4 border-t border-zinc-900/60 mt-4 space-y-2">
                <div className="grid grid-cols-2 gap-y-1.5 text-[11px] font-mono">
                  {alg.type === "sequential" ? (
                    <>
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Clock className="h-3 w-3 text-zinc-600" />
                        <span>Time:</span>
                        <span className="text-zinc-300 font-medium">
                          {alg.timeComplexity}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Activity className="h-3 w-3 text-zinc-600" />
                        <span>Space:</span>
                        <span className="text-zinc-300 font-medium">
                          {alg.spaceComplexity}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <TrendingUp className="h-3 w-3 text-zinc-600" />
                        <span>Work:</span>
                        <span className="text-emerald-400/80 font-medium">
                          {alg.workComplexity}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Clock className="h-3 w-3 text-zinc-600" />
                        <span>Span:</span>
                        <span className="text-violet-400/80 font-medium">
                          {alg.spanComplexity}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] text-emerald-500 font-medium pt-1">
                  <span>Launch Visualizer</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition duration-200" />
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-zinc-500 space-y-2 border border-dashed border-zinc-900 rounded-xl bg-zinc-950/20">
              <BookOpen className="h-8 w-8 text-zinc-700 mx-auto" />
              <p className="text-xs">
                No algorithms matched your query. Try searching
                &apos;Sort&apos;, &apos;PRAM&apos;, or &apos;BFS&apos;.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
