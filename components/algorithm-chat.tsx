"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, RefreshCw, Cpu, AlertCircle } from "lucide-react";
import Markdown from "react-markdown";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AlgorithmChatProps {
  algorithmId: string;
  algorithmName: string;
  algorithmType: string;
  inputArray: any;
  currentStep: number;
  totalSteps: number;
  currentStepDescription: string;
  pseudocode: string[];
}

// Global counters & pure-facing helpers defined outside the render body to comply with strict eslint-hooks-purity audits
let msgIdCounter = 0;

function generateUniqueId(prefix: string): string {
  msgIdCounter++;
  const timePart = Date.now();
  return `${prefix}-${timePart}-${msgIdCounter}`;
}

function sanitizeLaTeX(text: string): string {
  if (!text) return "";
  let clean = text;

  // Replace block math $$...$$
  clean = clean.replace(/\$\$([\s\S]*?)\$\$/g, (_, inner) => {
    return inner.trim();
  });

  // Replace inline math $...$
  clean = clean.replace(/\$(.*?)\$/g, (_, inner) => {
    return inner.trim();
  });

  // Common LaTeX math symbols cleanup
  clean = clean.replace(/\\frac\{(.*?)\}\{(.*?)\}/g, "$1 / $2");
  clean = clean.replace(/\\text\{(.*?)\}/g, "$1");
  clean = clean.replace(/\\approx/g, "≈");
  clean = clean.replace(/\\log/g, "log");
  clean = clean.replace(/\\times/g, "×");
  clean = clean.replace(/\\le/g, "≤");
  clean = clean.replace(/\\ge/g, "≥");
  clean = clean.replace(/\\ne/g, "≠");
  clean = clean.replace(/\\theta/g, "θ");
  clean = clean.replace(/\\omega/g, "ω");
  clean = clean.replace(/\\phi/g, "φ");
  clean = clean.replace(/\\alpha/g, "α");
  clean = clean.replace(/\\beta/g, "β");
  clean = clean.replace(/\\gamma/g, "γ");
  clean = clean.replace(/\\delta/g, "δ");
  clean = clean.replace(/\\pi/g, "π");
  clean = clean.replace(/\\sum/g, "Σ");
  clean = clean.replace(/\\in/g, "∈");
  clean = clean.replace(/\\infty/g, "∞");
  clean = clean.replace(/\\cdot/g, "·");

  return clean;
}

function createMsgObject(
  role: "user" | "assistant",
  content: string,
): ChatMessage {
  return {
    id: generateUniqueId("msg"),
    role,
    content: sanitizeLaTeX(content),
    timestamp: new Date(),
  };
}

export function AlgorithmChat({
  algorithmId,
  algorithmName,
  algorithmType,
  inputArray,
  currentStep,
  totalSteps,
  currentStepDescription,
  pseudocode,
}: AlgorithmChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const getWordCount = (str: string) => {
    const clean = str.trim();
    return clean === "" ? 0 : clean.split(/\s+/).length;
  };
  const wordCount = getWordCount(inputVal);
  const isOverLimit = wordCount > 500;

  // Initialize messages state lazily so it runs purely on mounting without trigger side-effects
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const isGraphAlg = [
      "bfs",
      "dfs",
      "astar",
      "dijkstra",
      "parallel-bfs",
      "prim",
      "kruskal",
    ].includes(algorithmId);
    let welcomeText = "";

    if (isGraphAlg) {
      if (algorithmId === "astar") {
        const safeAlgorithmName = algorithmName.replace(/\*/g, "\\*");
        welcomeText = `Hello! I am your **AlgoTutor AI**. 👋\n\nI can help you understand the **${safeAlgorithmName}** algorithm in depth. I'm completely synchronized with your simulator!\n\nCurrently, we are finding the shortest path from **Node A** to **Node F (Goal)** using A* Search. Our graph has **6 nodes** with both **edge weights** and **heuristics (estimated straight-line distance to goal F)**:\n\n**Nodes & Heuristics (h):**\n- **Node A**: h(A) = 18\n- **Node B**: h(B) = 13\n- **Node C**: h(C) = 13\n- **Node D**: h(D) = 7\n- **Node E**: h(E) = 7\n- **Node F** (Goal): h(F) = 0\n\n**Edge Weights:**\n- **A - B** (weight: 4)\n- **A - C** (weight: 2)\n- **B - C** (weight: 1)\n- **B - D** (weight: 5)\n- **C - D** (weight: 8)\n- **C - E** (weight: 10)\n- **D - E** (weight: 2)\n- **D - F** (weight: 6)\n- **E - F** (weight: 3)\n\nAsk me how the fScore (f = g + h) guides our open set search, about its time or space complexity, or anything else you're curious about!`;
      } else if (
        algorithmId === "dijkstra" ||
        algorithmId === "prim" ||
        algorithmId === "kruskal"
      ) {
        welcomeText = `Hello! I am your **AlgoTutor AI**. 👋\n\nI can help you understand the **${algorithmName}** algorithm in depth. I'm completely synchronized with your simulator!\n\nCurrently, we are executing on a weighted undirected graph with **6 nodes (A, B, C, D, E, F)** and the following edge weights:\n- **A - B** (weight: 4)\n- **A - C** (weight: 2)\n- **B - C** (weight: 1)\n- **B - D** (weight: 5)\n- **C - D** (weight: 8)\n- **C - E** (weight: 10)\n- **D - E** (weight: 2)\n- **D - F** (weight: 6)\n- **E - F** (weight: 3)\n\nAsk me how the algorithm selects edges or nodes to compute the result, about its time complexity, or anything else you're curious about!`;
      } else {
        // bfs, dfs, parallel-bfs
        welcomeText = `Hello! I am your **AlgoTutor AI**. 👋\n\nI can help you understand the **${algorithmName}** algorithm in depth. I'm completely synchronized with your simulator!\n\nCurrently, we are traversing an undirected graph with **6 nodes (A, B, C, D, E, F)** and **9 undirected edges**:\n- **A** connected to: **B, C**\n- **B** connected to: **C, D**\n- **C** connected to: **D, E**\n- **D** connected to: **E, F**\n- **E** connected to: **F**\n\nAsk me how the traversal queue or stack operates, about its time complexity, or anything else you're curious about!`;
      }
    } else {
      const arrayStr = Array.isArray(inputArray) ? inputArray.join(", ") : "";
      welcomeText = `Hello! I am your **AlgoTutor AI**. 👋\n\nI can help you understand the **${algorithmName}** algorithm in depth. I'm completely synchronized with your simulator!\n\nCurrently, you have an array with values **[${arrayStr}]**. Ask me how this step works, about its time complexity, or anything else you're curious about!`;
    }

    return [createMsgObject("assistant", welcomeText)];
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat whenever messages or open/loading status changes
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setApiError(null);
    const newMsg = createMsgObject("user", text);

    setMessages((prev) => [...prev, newMsg]);
    setInputVal("");
    setIsLoading(true);

    try {
      // Build previous messages payload for history (excluding the welcome message prefix)
      const historyPayload = messages
        .filter((m) => !m.id.startsWith("welcome"))
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          algorithmId,
          algorithmName,
          algorithmType,
          inputArray,
          currentStep,
          totalSteps,
          currentStepDescription,
          pseudocode,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Server returned an error");
      }

      const data = await res.json();
      const assistantResponse = createMsgObject("assistant", data.text);

      setMessages((prev) => [...prev, assistantResponse]);
    } catch (err: any) {
      console.error("Chat error:", err);
      let errMsg = err.message || "";

      // Check if the error message itself or inner error has the JSON structure
      if (typeof errMsg === "string" && errMsg.trim().startsWith("{")) {
        try {
          const parsed = JSON.parse(errMsg);
          if (parsed.error && parsed.error.message) {
            errMsg = parsed.error.message;
          }
        } catch (e) {
          // ignore parsing error
        }
      }

      // Check for common temporary high demand / quota limit messages
      const lowerMsg = errMsg.toLowerCase();
      if (
        errMsg.includes("503") ||
        lowerMsg.includes("high demand") ||
        lowerMsg.includes("temporary") ||
        lowerMsg.includes("unavailable") ||
        lowerMsg.includes("busy")
      ) {
        errMsg =
          "The AlgoTutor AI model is currently experiencing extremely high traffic. Please wait a few moments and click send again! 😊";
      } else if (
        errMsg.includes("429") ||
        lowerMsg.includes("quota") ||
        lowerMsg.includes("rate limit")
      ) {
        errMsg =
          "The daily API rate limit has been reached. Please try again shortly!";
      } else if (
        lowerMsg.includes("api key") ||
        lowerMsg.includes("unauthorized") ||
        lowerMsg.includes("key not found")
      ) {
        errMsg =
          "The Gemini API key is missing or invalid. Please check your workspace developer settings to ensure process.env.GEMINI_API_KEY is configured correctly.";
      }

      setApiError(
        errMsg ||
          "Could not communicate with the AI Assistant. Please check if your GEMINI_API_KEY is configured correctly.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const freshWelcome = createMsgObject(
      "assistant",
      `Chat history cleared. How can I help you understand the **${algorithmName}** algorithm now?`,
    );
    setMessages([freshWelcome]);
    setApiError(null);
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSend(promptText);
  };

  const quickPrompts = [
    {
      label: "Explain current step",
      text: `Please explain exactly what is happening in the current simulator step (Step ${currentStep + 1}: ${currentStepDescription}).`,
    },
    {
      label: "Time & Space complexity",
      text: `What are the best, average, and worst-case time complexities of ${algorithmName}, and why?`,
    },
    {
      label: "Explain pseudocode",
      text: `Can you walk me through the pseudocode logic of this algorithm?`,
    },
    {
      label: "Odd array size question",
      text: `Why can Parallel Reduction or Prefix Sum accept odd length arrays now, and how does the tree-based hardware simulation handle odd elements?`,
    },
  ];

  return (
    <>
      {/* Floating Sparkles Trigger Button when chat is closed */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              id="ai-chat-trigger"
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 18,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2.5 px-4.5 py-3.5 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold rounded-full shadow-2xl transition-colors cursor-pointer border border-emerald-300/20"
            >
              <Sparkles className="h-4.5 w-4.5 animate-pulse" />
              <span className="text-xs font-sans tracking-wide">
                Ask AlgoTutor AI
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Slide-out Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-chat-sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full md:w-[450px] bg-zinc-950 border-l border-zinc-900 shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                    AlgoTutor AI
                  </h3>
                  <p className="text-[10px] text-zinc-400 flex items-center gap-1 font-mono">
                    <Cpu className="h-3 w-3 text-emerald-400" /> ACTIVE SYNC
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearChat}
                  title="Clear conversation"
                  className="p-2 hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300 rounded-lg border border-transparent hover:border-zinc-800 transition"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close panel"
                  className="p-2 hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300 rounded-lg border border-transparent hover:border-zinc-800 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Active Simulation Status Synchronization Ribbon */}
            <div className="px-4 py-2 bg-zinc-900/40 border-b border-zinc-900/60 text-[10px] font-mono text-zinc-400 flex items-center justify-between select-none">
              <span className="truncate max-w-[210px]">🎯 {algorithmName}</span>
              <span className="shrink-0 text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded bg-zinc-950">
                Step {currentStep + 1}/{totalSteps}
              </span>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-3 text-xs leading-relaxed transition ${
                      msg.role === "user"
                        ? "bg-zinc-800 text-zinc-100 rounded-tr-none"
                        : "bg-zinc-900/50 border border-zinc-850 text-zinc-200 rounded-tl-none"
                    }`}
                  >
                    <div className="markdown-body">
                      <Markdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0 leading-relaxed font-sans">
                              {children}
                            </p>
                          ),
                          code: ({ children }) => (
                            <code className="bg-zinc-800 text-emerald-400 px-1 py-0.5 rounded text-[10.5px] font-mono font-semibold">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-zinc-950 border border-zinc-900 rounded p-2.5 my-2 overflow-x-auto text-[10px] font-mono leading-tight scrollbar-thin max-w-full">
                              {children}
                            </pre>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-4 space-y-1 my-1.5 text-zinc-300 font-sans">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-4 space-y-1 my-1.5 text-zinc-300 font-sans">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-zinc-300 leading-relaxed">
                              {children}
                            </li>
                          ),
                          h1: ({ children }) => (
                            <h1 className="text-sm font-bold text-white mt-3.5 mb-1.5 font-sans border-b border-zinc-800 pb-1">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-xs font-bold text-white mt-3 mb-1 font-sans">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-[11px] font-bold text-white mt-2 mb-1 font-sans">
                              {children}
                            </h3>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-white">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-zinc-300">{children}</em>
                          ),
                        }}
                      >
                        {msg.content}
                      </Markdown>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-600 mt-1 px-1 select-none">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}

              {/* Streaming / Typing Indicator */}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="bg-zinc-900/50 border border-zinc-850 text-zinc-200 rounded-xl rounded-tl-none px-4 py-3.5 text-xs flex items-center gap-2">
                    <span className="flex items-center gap-1 select-none">
                      <span
                        className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </span>
                    <span className="text-zinc-500 font-mono text-[10px] tracking-wider uppercase">
                      TUTOR ANALYZING STATE...
                    </span>
                  </div>
                </div>
              )}

              {/* API Configuration Error */}
              {apiError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3.5 flex gap-2.5 items-start">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Connection Failed</p>
                    <p className="text-[11px] text-red-300 leading-relaxed">
                      {apiError}
                    </p>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts Drawer */}
            {messages.length < 5 && (
              <div className="p-3 border-t border-zinc-900/40 bg-zinc-950/60 space-y-1.5 select-none">
                <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase px-1">
                  Quick Questions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((q, idx) => {
                    // Only show odd array size prompt for parallel reduction/prefix sum
                    if (
                      q.label.includes("Odd") &&
                      algorithmId !== "parallel-reduction" &&
                      algorithmId !== "parallel-prefix-sum"
                    ) {
                      return null;
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuickPrompt(q.text)}
                        className="text-[10px] text-zinc-400 hover:text-emerald-300 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-emerald-500/30 px-2.5 py-1 rounded-lg transition text-left duration-150"
                      >
                        {q.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chat Input Field Form */}
            <div className="p-4 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md flex flex-col gap-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!isOverLimit && inputVal.trim()) {
                    handleSend(inputVal);
                  }
                }}
                className="flex items-end gap-2"
              >
                <textarea
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (inputVal.trim() && !isLoading && !isOverLimit) {
                        handleSend(inputVal);
                      }
                    }
                  }}
                  placeholder="Ask a question about the algorithm..."
                  disabled={isLoading}
                  rows={2}
                  className="flex-1 bg-zinc-900/60 border border-zinc-800 focus:border-emerald-500/40 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition disabled:opacity-50 resize-none min-h-[44px] max-h-[120px] overflow-y-auto"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim() || isLoading || isOverLimit}
                  className="p-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-900 text-zinc-950 disabled:text-zinc-600 border border-transparent disabled:border-zinc-800 rounded-xl transition cursor-pointer disabled:cursor-not-allowed shrink-0 mb-0.5"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

              {/* Real-time word counter */}
              <div className="flex items-center justify-between px-1 text-[10px] font-mono select-none">
                {isOverLimit ? (
                  <span className="text-red-400 font-semibold animate-pulse">
                    ⚠️ Word limit exceeded (max 500 words)
                  </span>
                ) : (
                  <span className="text-zinc-500">
                    Use Shift+Enter for new line
                  </span>
                )}
                <span
                  className={
                    isOverLimit
                      ? "text-red-400 font-bold font-sans"
                      : "text-zinc-400"
                  }
                >
                  {wordCount} / 500 words
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
