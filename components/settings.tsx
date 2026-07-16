'use client';

import React from 'react';
import {
  Settings,
  Cpu,
  Zap,
  Check,
  Eye,
  Sliders,
  ShieldAlert,
} from 'lucide-react';

interface SettingsProps {
  defaultProcessorCount: number;
  setDefaultProcessorCount: (val: number) => void;
  reduceMotion: boolean;
  setReduceMotion: (val: boolean) => void;
  visualTheme: 'cosmic-zinc' | 'aurora-emerald';
  setVisualTheme: (val: 'cosmic-zinc' | 'aurora-emerald') => void;
  onBackToDashboard: () => void;
}

export function PreferencesPanel({
  defaultProcessorCount,
  setDefaultProcessorCount,
  reduceMotion,
  setReduceMotion,
  visualTheme,
  setVisualTheme,
  onBackToDashboard,
}: SettingsProps) {
  return (
    <div id="preferences-workspace" className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 p-6 md:p-10 space-y-8 scrollbar-thin">
      {/* Header section */}
      <div className="border-b border-zinc-900 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Settings className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-sans tracking-tight text-white">
              Application Preferences
            </h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Customize the simulation engine behaviors, memory configurations, accessibility filters, and visual theme layers.
            </p>
          </div>
        </div>
      </div>

      {/* Settings Sections Group */}
      <div className="max-w-2xl space-y-6">
        {/* Section 1: Core Simulation Defaults */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
            <Cpu className="h-4.5 w-4.5 text-emerald-400" />
            <span className="text-xs font-mono font-semibold text-zinc-200">
              CORE ENGINE CONFIGURATION
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-semibold text-zinc-200 block">Default Multi-Processor Count</span>
                <span className="text-zinc-400 text-[11px] block max-w-sm">
                  The initial number of logical cores assigned when entering a parallel network simulation.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {[2, 4, 8, 12].map(num => (
                  <button
                    key={num}
                    onClick={() => setDefaultProcessorCount(num)}
                    className={`px-3 py-1.5 rounded font-mono font-medium transition ${
                      defaultProcessorCount === num
                        ? 'bg-emerald-500 text-zinc-950'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    {num} Cores
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Accessibility Filters */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
            <Sliders className="h-4.5 w-4.5 text-emerald-400" />
            <span className="text-xs font-mono font-semibold text-zinc-200">
              ACCESSIBILITY & GRAPHICS
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-semibold text-zinc-200 block">Reduce Motion Filtering</span>
                <span className="text-zinc-400 text-[11px] block max-w-md">
                  Disables high-frequency canvas animations, sliding packet trails, and pulsing highlights for an optimized low-motion view.
                </span>
              </div>
              <button
                onClick={() => setReduceMotion(!reduceMotion)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  reduceMotion ? 'bg-emerald-500' : 'bg-zinc-900 border border-zinc-850'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    reduceMotion ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Visual Identity Presets */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
            <Eye className="h-4.5 w-4.5 text-emerald-400" />
            <span className="text-xs font-mono font-semibold text-zinc-200">
              VISUAL ARTWORK THEMES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Theme 1: Cosmic Zinc */}
            <div
              onClick={() => setVisualTheme('cosmic-zinc')}
              className={`p-4 rounded-lg border text-xs cursor-pointer transition ${
                visualTheme === 'cosmic-zinc'
                  ? 'border-emerald-500 bg-emerald-500/5'
                  : 'border-zinc-900 bg-zinc-950/40 hover:border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">Cosmic Zinc</span>
                {visualTheme === 'cosmic-zinc' && <Check className="h-4 w-4 text-emerald-400" />}
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                The standard industrial style. Dark carbon canvases, high-contrast cyan reads, emerald writes, and minimalist white borders.
              </p>
            </div>

            {/* Theme 2: Aurora Emerald */}
            <div
              onClick={() => setVisualTheme('aurora-emerald')}
              className={`p-4 rounded-lg border text-xs cursor-pointer transition ${
                visualTheme === 'aurora-emerald'
                  ? 'border-emerald-500 bg-emerald-500/5'
                  : 'border-zinc-900 bg-zinc-950/40 hover:border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">Aurora Emerald</span>
                {visualTheme === 'aurora-emerald' && <Check className="h-4 w-4 text-emerald-400" />}
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Bright emerald highlights and vibrant active gridlines. Emphasizes visual accessibility with maximum glowing luminance.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: System warnings and diagnostics */}
        <div className="bg-zinc-950 border border-red-950 p-4 rounded-xl flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-red-200 block">Performance Core Alert</span>
            <span className="text-zinc-400 text-[11px] block mt-0.5 leading-relaxed">
              Higher Core allocations (e.g. 12 cores or size limits above 16 indices) increase visual canvas load and can drop frame-rates on older client GPUs. For best performance, use 4-8 cores.
            </span>
          </div>
        </div>

        {/* Back Button */}
        <div className="pt-4">
          <button
            onClick={onBackToDashboard}
            className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold transition"
          >
            Apply & Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
