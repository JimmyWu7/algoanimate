"use client";

import React, { useState } from "react";
import {
  Home,
  Cpu,
  GitBranch,
  Layers,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ALGORITHM_REGISTRY } from "@/lib/algorithm-registry";
import { AlgorithmId } from "@/types/algorithms";

interface SidebarProps {
  activeAlgorithmId: AlgorithmId | null;
  onSelectAlgorithm: (id: AlgorithmId | null) => void;
  openSettings: boolean;
  setOpenSettings: (open: boolean) => void;
}

const INITIAL_SEQ_COUNT = 8;

export function Sidebar({
  activeAlgorithmId,
  onSelectAlgorithm,
  openSettings,
  setOpenSettings,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllSeq, setShowAllSeq] = useState(false);

  // Group algorithms by categories
  const sequentialAlgs = ALGORITHM_REGISTRY.filter(
    (a) => a.type === "sequential",
  );
  const parallelAlgs = ALGORITHM_REGISTRY.filter((a) => a.type === "parallel");

  const filterAlgorithms = (list: typeof ALGORITHM_REGISTRY) => {
    return list.filter(
      (a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const filteredSeq = filterAlgorithms(sequentialAlgs);
  const filteredPar = filterAlgorithms(parallelAlgs);

  // If active algorithm is in truncated sequential portion, auto-expand or keep visible
  const displayedSeq = (() => {
    if (searchQuery.trim() !== "" || showAllSeq) {
      return filteredSeq;
    }
    const initialList = filteredSeq.slice(0, INITIAL_SEQ_COUNT);
    const activeInSeq = filteredSeq.find((a) => a.id === activeAlgorithmId);
    if (activeInSeq && !initialList.some((a) => a.id === activeAlgorithmId)) {
      return [...initialList, activeInSeq];
    }
    return initialList;
  })();

  return (
    <div
      id="app-sidebar"
      className={`relative h-screen border-r border-zinc-900 bg-zinc-950 transition-all duration-300 flex flex-col z-20 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-900 h-16">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Cpu className="h-4.5 w-4.5 text-emerald-400" />
            </div>
            <div>
              <span className="font-semibold text-zinc-100 text-sm tracking-tight block leading-none">
                Algorand
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                SIMULATION v1.0
              </span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Cpu className="h-4.5 w-4.5 text-emerald-400" />
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-md hover:bg-zinc-900 hidden md:block"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Search Field */}
      {!isCollapsed && (
        <div className="p-3">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 pl-9 pr-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition"
            />
          </div>
        </div>
      )}

      {/* Navigation Options */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-5 scrollbar-thin">
        {/* Core Sections */}
        <div className="space-y-1">
          <button
            onClick={() => {
              onSelectAlgorithm(null);
              setOpenSettings(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
              activeAlgorithmId === null && !openSettings
                ? "bg-zinc-900 text-emerald-400 border border-zinc-800"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
            }`}
          >
            <Home className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Dashboard Overview</span>}
          </button>
        </div>

        {/* Sequential Algorithms */}
        <div className="space-y-1.5">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-3 text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
              <span>Sequential Engines</span>
              <span className="text-zinc-600 font-normal">
                ({filteredSeq.length})
              </span>
            </div>
          )}
          <div className="space-y-0.5">
            {displayedSeq.map((alg) => (
              <button
                key={alg.id}
                onClick={() => {
                  onSelectAlgorithm(alg.id);
                  setOpenSettings(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs transition ${
                  activeAlgorithmId === alg.id
                    ? "bg-emerald-500/10 text-emerald-400 font-medium"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                <Layers
                  className={`h-3.5 w-3.5 shrink-0 ${activeAlgorithmId === alg.id ? "text-emerald-400" : "text-zinc-500"}`}
                />
                {!isCollapsed && <span className="truncate">{alg.name}</span>}
              </button>
            ))}
            {!isCollapsed && filteredSeq.length === 0 && (
              <span className="text-[10px] text-zinc-600 px-3 italic">
                No results
              </span>
            )}

            {!isCollapsed &&
              searchQuery.trim() === "" &&
              filteredSeq.length > INITIAL_SEQ_COUNT && (
                <button
                  onClick={() => setShowAllSeq(!showAllSeq)}
                  className="w-full flex items-center justify-between px-3 py-1.5 mt-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg border border-dashed border-emerald-500/30 transition group"
                >
                  <span>
                    {showAllSeq
                      ? "Show Less"
                      : `View More (${filteredSeq.length - INITIAL_SEQ_COUNT} more)`}
                  </span>
                  {showAllSeq ? (
                    <ChevronUp className="h-3 w-3 transition-transform group-hover:-translate-y-0.5" />
                  ) : (
                    <ChevronDown className="h-3 w-3 transition-transform group-hover:translate-y-0.5" />
                  )}
                </button>
              )}
          </div>
        </div>

        {/* Parallel Algorithms */}
        <div className="space-y-1.5">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
              Parallel Engines
            </div>
          )}
          <div className="space-y-0.5">
            {filteredPar.map((alg) => (
              <button
                key={alg.id}
                onClick={() => {
                  onSelectAlgorithm(alg.id);
                  setOpenSettings(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs transition ${
                  activeAlgorithmId === alg.id
                    ? "bg-emerald-500/10 text-emerald-400 font-medium"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                <GitBranch
                  className={`h-3.5 w-3.5 shrink-0 ${activeAlgorithmId === alg.id ? "text-emerald-400" : "text-zinc-500"}`}
                />
                {!isCollapsed && <span className="truncate">{alg.name}</span>}
              </button>
            ))}
            {!isCollapsed && filteredPar.length === 0 && (
              <span className="text-[10px] text-zinc-600 px-3 italic">
                No results
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-2 border-t border-zinc-900 bg-zinc-950/80">
        <button
          onClick={() => {
            setOpenSettings(true);
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
            openSettings
              ? "bg-zinc-900 text-emerald-400 border border-zinc-800"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
          }`}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Preferences</span>}
        </button>
      </div>
    </div>
  );
}
