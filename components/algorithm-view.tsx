"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Sliders,
  Cpu,
  TrendingUp,
  Clock,
  Code,
  Info,
  Shuffle,
  Activity,
  Award,
  Copy,
  Check,
} from "lucide-react";
import { useSimulation } from "@/hooks/use-simulation";
import { CanvasVisualizer } from "./canvas-visualizer";
import { AlgorithmId } from "@/types/algorithms";
import { ALGORITHM_CODES } from "@/lib/algorithm-codes";

interface AlgorithmViewProps {
  algorithmId: AlgorithmId;
  onBack: () => void;
}

export function AlgorithmView({ algorithmId, onBack }: AlgorithmViewProps) {
  const {
    metadata,
    inputSize,
    setInputSize,
    processorCount,
    setProcessorCount,
    speed,
    setSpeed,
    inputData,
    events,
    currentStep,
    isPlaying,
    stepForward,
    stepBackward,
    jumpToStep,
    reset,
    togglePlay,
    randomizeInput,
    uploadInput,
    stats,
  } = useSimulation(algorithmId);

  const [activeEduTab, setActiveEduTab] = useState<
    "overview" | "complexity" | "analysis"
  >("overview");
  const [customInputVal, setCustomInputVal] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<
    "pseudocode" | "python" | "cpp" | "typescript" | "java"
  >("pseudocode");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    let textToCopy = "";
    if (activeCodeTab === "pseudocode") {
      textToCopy = metadata.pseudocode.join("\n");
    } else {
      textToCopy = ALGORITHM_CODES[algorithmId]?.[activeCodeTab] || "";
    }

    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const currentEvent = events[currentStep] || null;

  // Validation logic
  const validateCustomInput = (
    value: string,
  ): { isValid: boolean; error?: string; parsed?: number[] } => {
    if (!value.trim()) {
      return {
        isValid: false,
        error:
          "Input is empty. Enter comma-separated numbers (e.g. 15, 32, 9, 84)",
      };
    }

    const rawParts = value.split(",");
    const arr = rawParts
      .map((x) => x.trim())
      .filter((x) => x !== "")
      .map((x) => Number(x));

    if (arr.some(isNaN)) {
      return {
        isValid: false,
        error: "Invalid format. All values must be valid numbers.",
      };
    }

    const integers = arr.map((x) => Math.floor(x));

    if (integers.some((x) => x < 1 || x > 99)) {
      return {
        isValid: false,
        error: "All numbers must be integers between 1 and 99 (inclusive).",
      };
    }

    const len = integers.length;

    if (algorithmId === "bitonic-sort") {
      if (len !== 16) {
        return {
          isValid: false,
          error: `Bitonic Sort (Tesseract/Hypercube) requires exactly 16 elements. You provided ${len}.`,
        };
      }
    } else if (
      algorithmId === "parallel-reduction" ||
      algorithmId === "parallel-prefix-sum"
    ) {
      if (len < 4 || len > 16) {
        return {
          isValid: false,
          error: `This parallel algorithm requires an array size between 4 and 16 elements. You provided ${len}.`,
        };
      }
    } else {
      const minSize = 4;
      const maxSize = metadata.maxInputSize || 16;
      if (len < minSize || len > maxSize) {
        return {
          isValid: false,
          error: `Array size must be between ${minSize} and ${maxSize} elements. You provided ${len}.`,
        };
      }
    }

    return { isValid: true, parsed: integers };
  };

  const handleInputChange = (val: string) => {
    setCustomInputVal(val);
    if (!val.trim()) {
      setValidationError(null);
      return;
    }
    const result = validateCustomInput(val);
    if (!result.isValid) {
      setValidationError(result.error || null);
    } else {
      setValidationError(null);
    }
  };

  // Handler for custom array input
  const handleCustomInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateCustomInput(customInputVal);
    if (!result.isValid) {
      setValidationError(result.error || "Invalid input.");
      return;
    }

    if (result.parsed && result.parsed.length > 0) {
      setInputSize(result.parsed.length);
      uploadInput(result.parsed);
      setCustomInputVal("");
      setValidationError(null);
    }
  };

  const isParallel = metadata.type === "parallel";

  return (
    <div
      id="algorithm-workspace"
      className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 p-4 md:p-6 space-y-6 scrollbar-thin"
    >
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-sans tracking-tight text-white">
                {metadata.name}
              </h2>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                {metadata.type}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                {metadata.model}
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-2xl mt-1 leading-relaxed">
              {metadata.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Visualizer Stage on Top, Controls, Panels on Bottom */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Side: Visualizer Stage + Controls (spanning 2 columns on xl) */}
        <div className="xl:col-span-2 space-y-4">
          {/* Canvas visualizer */}
          <CanvasVisualizer
            algorithmId={algorithmId}
            model={metadata.model}
            currentEvent={currentEvent}
            inputData={inputData}
            processorCount={processorCount}
            events={events}
            currentStep={currentStep}
          />

          {/* Controller Panel */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 md:p-5 space-y-4 shadow-xl">
            {/* Timeline Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                <span>SIMULATION STEP PROGRESS</span>
                <span>
                  Step {currentStep + 1} / {events.length || 1}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(0, events.length - 1)}
                value={currentStep}
                onChange={(e) => jumpToStep(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-zinc-900 border border-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Core Playback Control Buttons */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={reset}
                  title="Reset to start"
                  className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-400 rounded-lg transition"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={stepBackward}
                  disabled={currentStep === 0}
                  title="Previous Step"
                  className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-400 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SkipBack className="h-4 w-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs flex items-center gap-2 transition"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 fill-current" />
                  ) : (
                    <Play className="h-4 w-4 fill-current" />
                  )}
                  <span>{isPlaying ? "Pause" : "Play Sim"}</span>
                </button>

                <button
                  onClick={stepForward}
                  disabled={currentStep === events.length - 1}
                  title="Next Step"
                  className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-400 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>

              {/* Sliders: Input Size, Speed, Processors */}
              <div className="grid grid-cols-2 md:flex md:items-center gap-4 flex-1 max-w-xl justify-end">
                {/* Speed Slider */}
                <div className="space-y-1.5 flex-1 min-w-[110px]">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>SPEED ({speed}%)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Input Size Slider */}
                {metadata.category !== "Graphs" && (
                  <div className="space-y-1.5 flex-1 min-w-[110px]">
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                      <span>SIZE ({inputSize})</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max={metadata.maxInputSize}
                      value={inputSize}
                      onChange={(e) =>
                        setInputSize(parseInt(e.target.value, 10))
                      }
                      className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                )}

                {/* Processor Count (Only show for parallel, except bitonic sort which has fixed 16-node topology) */}
                {isParallel &&
                  algorithmId !== "bitonic-sort" &&
                  (() => {
                    const allowedCores: number[] = [];
                    const maxC = metadata.maxProcessorCount || 16;
                    for (let c = 2; c <= maxC; c *= 2) {
                      allowedCores.push(c);
                    }
                    return (
                      <div className="space-y-1.5 flex-1 min-w-[135px]">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                          <span>CORES ({processorCount})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {allowedCores.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setProcessorCount(c)}
                              className={`flex-1 text-center py-1 rounded text-xs font-mono font-bold border transition ${
                                processorCount === c
                                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold"
                                  : "bg-zinc-900/50 border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-700"
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
              </div>
            </div>

            {/* Step Action Description Panel */}
            {currentEvent && (
              <div className="border border-zinc-900 bg-zinc-950/40 p-3 rounded-lg flex items-start gap-2.5">
                <div className="h-5 w-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded flex items-center justify-center text-[10px] font-mono font-bold mt-0.5">
                  ✓
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider">
                    Execution State Logger
                  </span>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                    {currentEvent.description}
                  </p>
                </div>
              </div>
            )}

            {/* Custom Input Array Form */}
            {metadata.category !== "Graphs" &&
              (() => {
                let placeholderText = "Enter numbers, e.g., 5, 12, 8, 25";
                if (algorithmId === "bitonic-sort") {
                  placeholderText =
                    "Enter exactly 16 numbers, e.g., 12, 45, 9, 87, 54, 30...";
                } else if (
                  algorithmId === "parallel-reduction" ||
                  algorithmId === "parallel-prefix-sum"
                ) {
                  placeholderText =
                    "Enter 4 to 16 numbers, e.g., 10, 42, 5, 80, 15";
                } else {
                  placeholderText = `Enter 4 to ${metadata.maxInputSize || 16} numbers, e.g., 8, 25, 43, 72`;
                }
                return (
                  <div className="pt-3 border-t border-zinc-900 space-y-2">
                    <form
                      onSubmit={handleCustomInputSubmit}
                      className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={randomizeInput}
                          className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-2 transition"
                        >
                          <Shuffle className="h-3 w-3" />
                          <span>Randomize</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-1 max-w-md">
                        <input
                          type="text"
                          placeholder={placeholderText}
                          value={customInputVal}
                          onChange={(e) => handleInputChange(e.target.value)}
                          className={`flex-1 bg-zinc-900 border ${
                            validationError
                              ? "border-red-500/50 focus:border-red-500"
                              : "border-zinc-850 focus:border-zinc-700"
                          } rounded px-2.5 py-1.5 text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none`}
                        />
                        <button
                          type="submit"
                          disabled={!!validationError}
                          className="px-3.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:border-zinc-900 border border-zinc-750 text-xs text-zinc-100 transition whitespace-nowrap"
                        >
                          Load Input
                        </button>
                      </div>
                    </form>

                    {/* Validation and help messages */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-[11px] font-mono">
                      {validationError ? (
                        <span className="text-red-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          {validationError}
                        </span>
                      ) : (
                        <span className="text-zinc-500">
                          {algorithmId === "bitonic-sort"
                            ? "💡 Tip: Bitonic Sort requires exactly 16 values (numbers 1-99) to map to the 16 nodes of the Tesseract."
                            : `💡 Tip: Enter integers between 1 and 99. Max size is ${metadata.maxInputSize || 16}.`}
                        </span>
                      )}
                      {customInputVal.trim() && !validationError && (
                        <span className="text-emerald-400 flex items-center gap-1 self-end">
                          ✓ Input is valid and ready to load
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}
          </div>
        </div>

        {/* Right Side: Pseudocode & Language Implementations Synchronizer */}
        <div className="space-y-4">
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 space-y-3.5 shadow-xl h-[420px] flex flex-col justify-between">
            <div className="flex flex-col space-y-2 border-b border-zinc-900 pb-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-mono tracking-wider font-semibold text-zinc-200 uppercase">
                    Code Workspace
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[10px] font-mono text-zinc-300 flex items-center gap-1.5 transition active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tabs selector */}
              <div className="flex items-center gap-1 overflow-x-auto pt-1 no-scrollbar select-none">
                {(
                  ["pseudocode", "python", "cpp", "typescript", "java"] as const
                ).map((tab) => {
                  const displayLabels: Record<string, string> = {
                    pseudocode: "Pseudocode",
                    python: "Python",
                    cpp: "C++",
                    typescript: "TypeScript",
                    java: "Java",
                  };
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveCodeTab(tab)}
                      className={`px-2 py-0.5 text-[10px] font-mono rounded transition shrink-0 border ${
                        activeCodeTab === tab
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                          : "text-zinc-500 hover:text-zinc-300 border-transparent"
                      }`}
                    >
                      {displayLabels[tab]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content section */}
            {activeCodeTab === "pseudocode" ? (
              <div className="flex-1 overflow-auto space-y-1 pr-1 font-mono text-[11px] leading-relaxed select-none scrollbar-thin">
                <div className="min-w-full inline-block">
                  {metadata.pseudocode.map((lineText, idx) => {
                    const isLineActive = currentEvent?.line === idx;
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-3.5 py-1 px-2.5 rounded transition duration-150 ${
                          isLineActive
                            ? "bg-emerald-500/10 border-l-2 border-emerald-500 text-emerald-300"
                            : "text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <span className="w-5 text-zinc-600 text-right font-mono text-[9px] select-none mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="whitespace-pre">{lineText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-auto bg-zinc-950/40 border border-zinc-900 rounded-lg p-3 font-mono text-[11px] leading-relaxed text-zinc-300 select-text scrollbar-thin">
                <pre className="whitespace-pre">
                  {ALGORITHM_CODES[algorithmId]?.[activeCodeTab] ||
                    "// Code implementation loading..."}
                </pre>
              </div>
            )}

            <div className="text-[9px] font-mono text-zinc-600 uppercase border-t border-zinc-900/60 pt-2 text-right select-none">
              {activeCodeTab === "pseudocode"
                ? "Currently highlights executing branch"
                : "Step trace is active on the Pseudocode tab"}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Board & Educational Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Runtime Statistics Board */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-mono tracking-wider font-semibold text-zinc-200">
              RUNTIME COST METRICS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-950/40 border border-zinc-900/60 p-3 rounded-lg">
              <span className="text-[9px] font-mono text-zinc-500 block uppercase">
                Comparisons
              </span>
              <span className="text-lg font-bold text-white">
                {stats.comparisons}
              </span>
            </div>

            <div className="bg-zinc-950/40 border border-zinc-900/60 p-3 rounded-lg">
              <span className="text-[9px] font-mono text-zinc-500 block uppercase">
                Memory Writes
              </span>
              <span className="text-lg font-bold text-emerald-400">
                {stats.writes}
              </span>
            </div>

            <div className="bg-zinc-950/40 border border-zinc-900/60 p-3 rounded-lg">
              <span className="text-[9px] font-mono text-zinc-500 block uppercase">
                Memory Reads
              </span>
              <span className="text-lg font-bold text-cyan-400">
                {stats.reads}
              </span>
            </div>

            <div className="bg-zinc-950/40 border border-zinc-900/60 p-3 rounded-lg">
              <span className="text-[9px] font-mono text-zinc-500 block uppercase">
                Elements Swapped
              </span>
              <span className="text-lg font-bold text-white">
                {stats.swaps}
              </span>
            </div>
          </div>

          {/* Theoretical Cost analysis for Parallel (Work vs Span) */}
          {isParallel && (
            <div className="space-y-3.5 border-t border-zinc-900/80 pt-4 text-xs font-mono">
              <div className="flex justify-between items-center text-zinc-400">
                <span>Core Capacity:</span>
                <span className="text-zinc-200">{processorCount} Cores</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Total Work Done:</span>
                <span className="text-zinc-200">{stats.work} operations</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Critical Path Span:</span>
                <span className="text-zinc-200">{stats.span} levels</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Observed Speedup:</span>
                <span className="text-emerald-400 font-semibold">
                  {stats.speedup}x
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Efficiency Bound:</span>
                <span className="text-zinc-200">
                  {(stats.efficiency * 100).toFixed(0)}%
                </span>
              </div>

              {/* Graphical mini progress */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[9px] text-zinc-500">
                  <span>PROCESSOR ALLOCATION EFFICIENCY</span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${stats.efficiency * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {!isParallel && (
            <div className="space-y-3.5 border-t border-zinc-900 pt-4 text-xs font-mono">
              <div className="flex justify-between items-center text-zinc-400">
                <span>Computational Model:</span>
                <span className="text-zinc-200">RAM (Single Core)</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Theoretical Bound:</span>
                <span className="text-emerald-400 font-medium">
                  {metadata.timeComplexity}
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Space Complexity:</span>
                <span className="text-zinc-200">
                  {metadata.spaceComplexity}
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Communication Cost:</span>
                <span className="text-zinc-200">0 (Shared Bus)</span>
              </div>
            </div>
          )}
        </div>

        {/* Educational Content Panel */}
        <div className="xl:col-span-2 bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-mono tracking-wider font-semibold text-zinc-200">
                THEORETICAL ANALYSIS & RESEARCH
              </span>
            </div>

            {/* Small tabs */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveEduTab("overview")}
                className={`px-2.5 py-1 text-[10px] rounded font-medium transition ${
                  activeEduTab === "overview"
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveEduTab("complexity")}
                className={`px-2.5 py-1 text-[10px] rounded font-medium transition ${
                  activeEduTab === "complexity"
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Complexities
              </button>
              <button
                onClick={() => setActiveEduTab("analysis")}
                className={`px-2.5 py-1 text-[10px] rounded font-medium transition ${
                  activeEduTab === "analysis"
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Pros & Cons
              </button>
            </div>
          </div>

          <div className="min-h-[160px] overflow-y-auto space-y-3.5 text-xs text-zinc-300 leading-relaxed">
            {activeEduTab === "overview" && (
              <>
                <p>
                  <strong className="text-white">Conceptual Focus:</strong>{" "}
                  {metadata.description}
                </p>
                <div className="space-y-1">
                  <span className="text-white font-semibold">
                    Real-world Industrial Applications:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-zinc-400">
                    {metadata.applications.map((app, i) => (
                      <li key={i}>{app}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {activeEduTab === "complexity" && (
              <div className="space-y-3 font-mono text-[11px]">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-b border-zinc-900/60 pb-3">
                  <div>
                    <span className="text-zinc-500 block uppercase text-[9px]">
                      Time Complexity
                    </span>
                    <span className="text-white text-xs font-semibold">
                      {metadata.timeComplexity}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block uppercase text-[9px]">
                      Space Complexity
                    </span>
                    <span className="text-white text-xs font-semibold">
                      {metadata.spaceComplexity}
                    </span>
                  </div>
                  {isParallel && (
                    <>
                      <div>
                        <span className="text-zinc-500 block uppercase text-[9px]">
                          Work Complexity
                        </span>
                        <span className="text-emerald-400 text-xs font-semibold">
                          {metadata.workComplexity}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block uppercase text-[9px]">
                          Span Complexity
                        </span>
                        <span className="text-violet-400 text-xs font-semibold">
                          {metadata.spanComplexity}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block uppercase text-[9px]">
                          Processor Complexity
                        </span>
                        <span className="text-white text-xs font-semibold">
                          {metadata.processorComplexity}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-1.5 leading-relaxed text-zinc-400">
                  <p className="text-zinc-300 font-sans text-xs">
                    In parallel model algorithms,{" "}
                    <strong className="text-white">Work</strong> represents the
                    absolute cumulative sum of operations executed across all
                    lanes, whereas <strong className="text-white">Span</strong>{" "}
                    defines the critical time delay. Ideal algorithms minimize
                    Span while maintaining O(N) work optimal performance.
                  </p>
                </div>
              </div>
            )}

            {activeEduTab === "analysis" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-emerald-400 font-semibold block">
                    Advantages:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-zinc-400">
                    {metadata.advantages.map((adv, i) => (
                      <li key={i}>{adv}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="text-rose-400 font-semibold block">
                    Disadvantages:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-zinc-400">
                    {metadata.disadvantages.map((dis, i) => (
                      <li key={i}>{dis}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
