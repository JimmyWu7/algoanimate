"use client";

import React, { createContext, useContext, useState } from "react";

interface PreferencesContextType {
  defaultProcessorCount: number;
  setDefaultProcessorCount: (val: number) => void;
  reduceMotion: boolean;
  setReduceMotion: (val: boolean) => void;
  visualTheme: "cosmic-zinc" | "aurora-emerald";
  setVisualTheme: (val: "cosmic-zinc" | "aurora-emerald") => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined,
);

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [defaultProcessorCount, setDefaultProcessorCount] = useState<number>(4);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  const [visualTheme, setVisualTheme] = useState<
    "cosmic-zinc" | "aurora-emerald"
  >("cosmic-zinc");

  return (
    <PreferencesContext.Provider
      value={{
        defaultProcessorCount,
        setDefaultProcessorCount,
        reduceMotion,
        setReduceMotion,
        visualTheme,
        setVisualTheme,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
