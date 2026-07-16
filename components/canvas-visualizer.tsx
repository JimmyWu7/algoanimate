"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  SimulationEvent,
  AlgorithmId,
  ComputationalModelId,
} from "@/types/algorithms";
import { getDefaultGraph } from "@/algorithms/generators";

interface CanvasVisualizerProps {
  algorithmId: AlgorithmId;
  model: ComputationalModelId;
  currentEvent: SimulationEvent | null;
  inputData: any;
  processorCount: number;
  events?: SimulationEvent[];
  currentStep?: number;
}

interface MessagePacket {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number; // 0 to 1
  label: string;
  color: string;
}

export function CanvasVisualizer({
  algorithmId,
  model,
  currentEvent,
  inputData,
  processorCount,
  events = [],
  currentStep = 0,
}: CanvasVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 420 });
  const [packets, setPackets] = useState<MessagePacket[]>([]);

  // Track the previous step to trigger new packets on change
  const lastStepRef = useRef<number>(-1);

  // Responsive canvas resizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: 420,
        });
      }
    };
    handleResize();
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Helper endpoints for packet sliding path
  const getPRAMEndpoints = (
    pId: number,
    cellIdx: number,
    pCount: number,
    cellCount: number,
    w: number,
    h: number,
  ) => {
    // Processors row
    const pWidth = w - 160;
    const pSpacing = pWidth / (pCount - 1 || 1);
    const pX = 80 + pId * pSpacing;
    const pY = 80;

    // Memory array row
    const mWidth = w - 160;
    const cellWidth = mWidth / cellCount;
    const memX = 80 + cellIdx * cellWidth + cellWidth / 2;
    const memY = h - 100;

    return { pX, pY, memX, memY };
  };

  const getPacketEndpoints = (
    from: number,
    to: number,
    topology: ComputationalModelId,
    pCount: number,
    w: number,
    h: number,
    data: any,
  ) => {
    // Hypercube, Ring, Tree packet nodes endpoint resolver
    if (topology === "Ring") {
      const centerX = w / 2;
      const centerY = h / 2;
      const radius = 110;
      const getRingCoords = (id: number) => {
        const angle = (id * 2 * Math.PI) / pCount - Math.PI / 2;
        return {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        };
      };
      const fC = getRingCoords(from);
      const tC = getRingCoords(to);
      return { fromX: fC.x, fromY: fC.y, toX: tC.x, toY: tC.y };
    }

    if (topology === "Hypercube") {
      // 8-node perspective projected coords
      const getHypercubeCoords = (id: number) => {
        const sizeX = 140;
        const sizeY = 140;
        const offset3D = 40;
        const cX = w / 2;
        const cY = h / 2;
        const positions = [
          { x: cX - sizeX / 2, y: cY - sizeY / 2 },
          { x: cX + sizeX / 2, y: cY - sizeY / 2 },
          { x: cX + sizeX / 2, y: cY + sizeY / 2 },
          { x: cX - sizeX / 2, y: cY + sizeY / 2 },
          { x: cX - sizeX / 2 + offset3D, y: cY - sizeY / 2 - offset3D },
          { x: cX + sizeX / 2 + offset3D, y: cY - sizeY / 2 - offset3D },
          { x: cX + sizeX / 2 + offset3D, y: cY + sizeY / 2 - offset3D },
          { x: cX - sizeX / 2 + offset3D, y: cY + sizeY / 2 - offset3D },
        ];
        const pos = positions[id % 8];
        return pos;
      };
      const fC = getHypercubeCoords(from);
      const tC = getHypercubeCoords(to);
      return { fromX: fC.x, fromY: fC.y, toX: tC.x, toY: tC.y };
    }

    if (topology === "Tree") {
      const size = data?.length || 8;
      const getTreeCoords = (id: number) => {
        // Simple 3 layer binary tree of reduction
        const layers = 3;
        const leavesY = h - 120;
        const leavesSpacing = (w - 160) / (size - 1 || 1);
        // Find layer position dynamically
        if (id < size) {
          return { x: 80 + id * leavesSpacing, y: leavesY };
        }
        // Internals (approximation)
        return { x: w / 2, y: 120 };
      };
      const fC = getTreeCoords(from);
      const tC = getTreeCoords(to);
      return { fromX: fC.x, fromY: fC.y, toX: tC.x, toY: tC.y };
    }

    return null;
  };

  // --- DRAWING UTILITIES ---

  const renderSequentialArray = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
  ) => {
    const data = ((currentEvent?.arraySnapshot || inputData) as number[]) || [];
    const size = data.length || 8;
    const arrayWidth = w - 160;
    const cellWidth = arrayWidth / size;
    const cellHeight = 70;
    const xOffset = 80;
    const yOffset = h / 2 - cellHeight / 2;

    // Draw main array background header
    ctx.font = "11px var(--font-mono, monospace)";
    ctx.fillStyle = "#71717a"; // Zinc 500
    ctx.fillText(
      "SEQUENTIAL ACCESS MEMORY BUFFER (RAM)",
      xOffset,
      yOffset - 25,
    );

    // Draw cells
    data.forEach((val, i) => {
      const x = xOffset + i * cellWidth;
      const y = yOffset;

      const isSortingComplete =
        (algorithmId === "bubble-sort" ||
          algorithmId === "selection-sort" ||
          algorithmId === "insertion-sort" ||
          algorithmId === "merge-sort" ||
          algorithmId === "quick-sort" ||
          algorithmId === "bitonic-sort" ||
          algorithmId === "odd-even-sort") &&
        currentStep === (events?.length || 0) - 1;
      const isBinarySearchComplete =
        algorithmId === "binary-search" &&
        currentStep === (events?.length || 0) - 1;

      const isVisited = currentEvent?.indices?.includes(i);
      const isCompare = currentEvent?.type === "COMPARE" && isVisited;
      const isSwap = currentEvent?.type === "SWAP" && isVisited;
      const isRead = currentEvent?.type === "READ" && isVisited;
      const isWrite = currentEvent?.type === "WRITE" && isVisited;

      // Color coding based on state
      let strokeColor = "#27272a"; // Zinc 800 default
      let fillColor = "#0f0f11"; // Zinc 900
      let textColor = "#e4e4e7"; // Zinc 200
      let lineWidth = 1.5;

      if (isSortingComplete) {
        strokeColor = "#10b981"; // Completed Emerald
        fillColor = "#10b98115";
        textColor = "#34d399";
        lineWidth = 4.5;
      } else if (
        isBinarySearchComplete &&
        isVisited &&
        currentEvent?.description?.toLowerCase().includes("found")
      ) {
        strokeColor = "#10b981"; // Completed Emerald
        fillColor = "#10b98115";
        textColor = "#34d399";
        lineWidth = 4.5;
      } else if (isCompare) {
        strokeColor = "#f59e0b"; // Amber 500
        fillColor = "#f59e0b20";
        textColor = "#fbbf24";
        lineWidth = 4.5;
      } else if (isSwap) {
        strokeColor = "#f43f5e"; // Rose 500
        fillColor = "#f43f5e25";
        textColor = "#fda4af";
        lineWidth = 4.5;
      } else if (isRead) {
        strokeColor = "#06b6d4"; // Cyan 500
        fillColor = "#06b6d420";
        textColor = "#67e8f9";
        lineWidth = 4.5;
      } else if (isWrite) {
        strokeColor = "#10b981"; // Emerald 500
        fillColor = "#10b98120";
        textColor = "#6ee7b7";
        lineWidth = 4.5;
      } else if (isVisited) {
        strokeColor = "#52525b"; // Zinc 600
        fillColor = "#27272a"; // optional: subtle fill
        textColor = "#d4d4d8"; // Zinc 300
        lineWidth = 4.5;
      }

      // Draw box border and back
      ctx.fillStyle = fillColor;
      ctx.fillRect(x + 4, y, cellWidth - 8, cellHeight);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;

      // Round rectangle path
      ctx.beginPath();
      ctx.roundRect(x + 4, y, cellWidth - 8, cellHeight, 6);
      ctx.stroke();

      // Write Index Indicator (outside the box at the top, centered)
      ctx.fillStyle = "#71717a"; // Zinc 500
      ctx.font = "11px var(--font-mono, monospace)";
      ctx.textAlign = "center";
      ctx.fillText(String(i), x + cellWidth / 2, yOffset - 8);

      // Write element value if not null or undefined
      if (val !== null && val !== undefined) {
        ctx.fillStyle = textColor;
        ctx.font = "20px var(--font-sans, sans-serif)";
        ctx.fillText(String(val), x + cellWidth / 2, y + cellHeight / 2 + 8);
      }
      ctx.textAlign = "left"; // reset
    });

    // Draw Swap/Compare Arrows if necessary
    if (
      currentEvent?.type === "SWAP" &&
      currentEvent.indices &&
      currentEvent.indices.length === 2
    ) {
      const idx1 = currentEvent.indices[0];
      const idx2 = currentEvent.indices[1];
      const x1 = xOffset + idx1 * cellWidth + cellWidth / 2;
      const x2 = xOffset + idx2 * cellWidth + cellWidth / 2;
      const y = yOffset + cellHeight + 15;

      ctx.beginPath();
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 2;
      ctx.arc((x1 + x2) / 2, y, Math.abs(x1 - x2) / 2, Math.PI, 0, false);
      ctx.stroke();

      // Draw Arrow pointers
      ctx.fillStyle = "#f43f5e";
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x1 - 4, y - 6);
      ctx.lineTo(x1 + 4, y - 6);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x2, y);
      ctx.lineTo(x2 - 4, y - 6);
      ctx.lineTo(x2 + 4, y - 6);
      ctx.closePath();
      ctx.fill();
    }
  };

  const renderPRAMLayout = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
  ) => {
    const data = ((currentEvent?.arraySnapshot || inputData) as number[]) || [];
    const size = data.length || 8;

    // 1. Draw Processors
    const pWidth = w - 160;
    const pSpacing = pWidth / (processorCount - 1 || 1);
    const pY = 80;

    ctx.font = "10px var(--font-mono, monospace)";
    ctx.fillStyle = "#52525b";
    ctx.fillText(
      "PARALLEL COMPUTATION CORE GRID (PRAM PROCESSORS)",
      80,
      pY - 20,
    );

    for (let p = 0; p < processorCount; p++) {
      const pX = 80 + p * pSpacing;

      // Detect if processor is active
      const isActive = currentEvent?.processors?.includes(p);
      let ringColor = "#52525b"; // Brighter gray
      let nodeFill = "#09090b";
      let textCol = "#71717a"; // Brighter gray

      if (isActive) {
        ringColor = "#f59e0b"; // active orange glow
        nodeFill = "#d9770615";
        textCol = "#fbbf24";
      }

      ctx.shadowColor = isActive ? "#f59e0b50" : "transparent";
      ctx.shadowBlur = isActive ? 10 : 0;

      ctx.fillStyle = nodeFill;
      ctx.beginPath();
      ctx.arc(pX, pY, 18, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = ringColor;
      ctx.lineWidth = isActive ? 3 : 1.5;
      ctx.stroke();

      ctx.shadowBlur = 0; // reset

      // Processor Text label
      ctx.fillStyle = textCol;
      ctx.font = "bold 11px var(--font-mono, monospace)";
      ctx.textAlign = "center";
      ctx.fillText(`P${p}`, pX, pY + 4);
    }
    ctx.textAlign = "left";

    // 2. Draw Bus Interconnect Crossbar lanes
    ctx.strokeStyle = "#3f3f46"; // Brighter gray
    ctx.lineWidth = 1;
    for (let p = 0; p < processorCount; p++) {
      const pX = 80 + p * pSpacing;
      ctx.beginPath();
      ctx.moveTo(pX, pY + 18);
      ctx.lineTo(pX, h - 135);
      ctx.stroke();
    }

    // Bus line
    ctx.strokeStyle = "#52525b"; // Brighter gray
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, h - 135);
    ctx.lineTo(w - 80, h - 135);
    ctx.stroke();

    // 3. Draw Shared Memory cells
    const mWidth = w - 160;
    const cellWidth = mWidth / size;
    const memY = h - 100;
    const memHeight = 50;

    ctx.font = "10px var(--font-mono, monospace)";
    ctx.fillStyle = "#52525b";
    ctx.fillText("SHARED CENTRAL RANDOM ACCESS MEMORY", 80, memY - 12);

    data.forEach((val, i) => {
      const mX = 80 + i * cellWidth;

      const isVisited = currentEvent?.indices?.includes(i);
      let border = "#3f3f46"; // Brighter gray border
      let back = "#09090b";
      let fontColor = "#a1a1aa";

      if (isVisited) {
        if (currentEvent?.type === "WRITE") {
          border = "#10b981";
          back = "#10b98115";
          fontColor = "#34d399";
        } else if (currentEvent?.type === "READ") {
          border = "#06b6d4";
          back = "#06b6d415";
          fontColor = "#22d3ee";
        } else if (currentEvent?.type === "COMPARE") {
          border = "#f59e0b";
          back = "#f59e0b15";
          fontColor = "#fbbf24";
        } else {
          border = "#a78bfa";
          back = "#a78bfa15";
          fontColor = "#c084fc";
        }
      }

      ctx.fillStyle = back;
      ctx.fillRect(mX + 2, memY, cellWidth - 4, memHeight);

      ctx.strokeStyle = border;
      ctx.lineWidth = isVisited ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.roundRect(mX + 2, memY, cellWidth - 4, memHeight, 4);
      ctx.stroke();

      // Label index
      ctx.fillStyle = "#71717a"; // Brighter gray label
      ctx.font = "9px var(--font-mono, monospace)";
      ctx.fillText(`[${i}]`, mX + 6, memY + 12);

      // Value
      ctx.fillStyle = fontColor;
      ctx.font = "bold 15px var(--font-sans, sans-serif)";
      ctx.textAlign = "center";
      ctx.fillText(String(val), mX + cellWidth / 2, memY + memHeight / 2 + 10);
      ctx.textAlign = "left";
    });
  };

  const renderRingLayout = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
  ) => {
    // Array sorted on logical ring of processors
    const data = ((currentEvent?.arraySnapshot || inputData) as number[]) || [];
    const pCount = data.length || 8;
    const centerX = w / 2;
    const centerY = h / 2;
    const radius = 110;

    ctx.font = "11px var(--font-mono, monospace)";
    ctx.fillStyle = "#52525b";
    ctx.fillText("DISTRIBUTED MEMORY MODEL: LOGICAL RING INTERCONNECT", 40, 40);

    // Draw Interconnect cables
    ctx.strokeStyle = "#52525b"; // Brighter gray cable
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw ring nodes
    data.forEach((val, id) => {
      const angle = (id * 2 * Math.PI) / pCount - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const isVisited = currentEvent?.indices?.includes(id);
      let ringColor = "#52525b"; // Brighter gray node border
      let fontColor = "#e4e4e7";
      let backColor = "#09090b";

      if (isVisited) {
        ringColor = "#fbbf24";
        backColor = "#f59e0b10";
        fontColor = "#fbbf24";
      }

      // Draw node bubble
      ctx.fillStyle = backColor;
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = ringColor;
      ctx.lineWidth = isVisited ? 3 : 1.5;
      ctx.stroke();

      // Draw Core ID label
      ctx.fillStyle = "#a1a1aa"; // Brighter gray label
      ctx.font = "8px var(--font-mono, monospace)";
      ctx.textAlign = "center";
      ctx.fillText(`P${id}`, x, y - 8);

      // Draw data value inside core
      ctx.fillStyle = fontColor;
      ctx.font = "bold 14px var(--font-sans, sans-serif)";
      ctx.fillText(String(val), x, y + 6);
      ctx.textAlign = "left";
    });
  };

  const renderMeshLayout = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
  ) => {
    // Grid processors
    const gridCols = 4;
    const gridRows = 2;
    const spacingX = 140;
    const spacingY = 110;
    const xStart = w / 2 - ((gridCols - 1) * spacingX) / 2;
    const yStart = h / 2 - ((gridRows - 1) * spacingY) / 2;

    ctx.font = "11px var(--font-mono, monospace)";
    ctx.fillStyle = "#52525b";
    ctx.fillText("DISTRIBUTED MEMORY MODEL: 2D GRID MESH TOPOLOGY", 40, 40);

    // Draw interconnect lines
    ctx.strokeStyle = "#3f3f46"; // Brighter gray interconnect lines
    ctx.lineWidth = 1.5;

    // Horizontal links
    for (let r = 0; r < gridRows; r++) {
      ctx.beginPath();
      ctx.moveTo(xStart, yStart + r * spacingY);
      ctx.lineTo(xStart + (gridCols - 1) * spacingX, yStart + r * spacingY);
      ctx.stroke();
    }

    // Vertical links
    for (let c = 0; c < gridCols; c++) {
      ctx.beginPath();
      ctx.moveTo(xStart + c * spacingX, yStart);
      ctx.lineTo(xStart + c * spacingX, yStart + (gridRows - 1) * spacingY);
      ctx.stroke();
    }

    // Draw processors
    const data = ((currentEvent?.arraySnapshot || inputData) as number[]) || [];
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const id = r * gridCols + c;
        const x = xStart + c * spacingX;
        const y = yStart + r * spacingY;
        const val = data[id] !== undefined ? data[id] : 0;

        const isVisited = currentEvent?.indices?.includes(id);
        let border = "#52525b"; // Brighter gray node border
        let backColor = "#09090b";
        let fontColor = "#d4d4d8";

        if (isVisited) {
          border = "#a78bfa";
          backColor = "#a78bfa10";
          fontColor = "#c084fc";
        }

        ctx.fillStyle = backColor;
        ctx.beginPath();
        ctx.roundRect(x - 26, y - 22, 52, 44, 6);
        ctx.fill();

        ctx.strokeStyle = border;
        ctx.lineWidth = isVisited ? 3 : 1.5;
        ctx.stroke();

        // Node ID
        ctx.fillStyle = "#a1a1aa"; // Brighter gray node ID
        ctx.font = "8px var(--font-mono, monospace)";
        ctx.textAlign = "center";
        ctx.fillText(`P(${r},${c})`, x, y - 8);

        // Value
        ctx.fillStyle = fontColor;
        ctx.font = "bold 13px var(--font-sans, sans-serif)";
        ctx.fillText(String(val), x, y + 10);
        ctx.textAlign = "left";
      }
    }
  };

  const renderHypercubeLayout = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
  ) => {
    // 8-node hypercube
    const data = ((currentEvent?.arraySnapshot || inputData) as number[]) || [];
    const sizeX = 140;
    const sizeY = 140;
    const offset3D = 45;
    const cX = w / 2;
    const cY = h / 2;

    const positions = [
      { x: cX - sizeX / 2, y: cY - sizeY / 2 },
      { x: cX + sizeX / 2, y: cY - sizeY / 2 },
      { x: cX + sizeX / 2, y: cY + sizeY / 2 },
      { x: cX - sizeX / 2, y: cY + sizeY / 2 },
      { x: cX - sizeX / 2 + offset3D, y: cY - sizeY / 2 - offset3D },
      { x: cX + sizeX / 2 + offset3D, y: cY - sizeY / 2 - offset3D },
      { x: cX + sizeX / 2 + offset3D, y: cY + sizeY / 2 - offset3D },
      { x: cX - sizeX / 2 + offset3D, y: cY + sizeY / 2 - offset3D },
    ];

    ctx.font = "11px var(--font-mono, monospace)";
    ctx.fillStyle = "#52525b";
    ctx.fillText(
      "COMPUTATIONAL MODEL: HYPERCUBE DIMENSION 3 INTERCONNECT",
      40,
      40,
    );

    // Draw interconnect cables
    ctx.strokeStyle = "#3f3f46"; // Brighter gray interconnect lines
    ctx.lineWidth = 1.5;

    // Draw front square
    ctx.beginPath();
    ctx.moveTo(positions[0].x, positions[0].y);
    ctx.lineTo(positions[1].x, positions[1].y);
    ctx.lineTo(positions[2].x, positions[2].y);
    ctx.lineTo(positions[3].x, positions[3].y);
    ctx.closePath();
    ctx.stroke();

    // Draw back square
    ctx.beginPath();
    ctx.moveTo(positions[4].x, positions[4].y);
    ctx.lineTo(positions[5].x, positions[5].y);
    ctx.lineTo(positions[6].x, positions[6].y);
    ctx.lineTo(positions[7].x, positions[7].y);
    ctx.closePath();
    ctx.stroke();

    // Connect corners
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(positions[i].x, positions[i].y);
      ctx.lineTo(positions[i + 4].x, positions[i + 4].y);
      ctx.stroke();
    }

    // Draw node modules
    positions.forEach((pos, idx) => {
      const val = data[idx] !== undefined ? data[idx] : 0;
      const isVisited = currentEvent?.indices?.includes(idx);
      let border = "#52525b"; // Brighter gray node border
      let backColor = "#09090b";
      let fontColor = "#d4d4d8";

      if (isVisited) {
        border = "#fbbf24";
        backColor = "#f59e0b10";
        fontColor = "#fbbf24";
      }

      ctx.fillStyle = backColor;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 18, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = border;
      ctx.lineWidth = isVisited ? 3 : 1.5;
      ctx.stroke();

      // Node core address
      ctx.fillStyle = "#a1a1aa"; // Brighter gray address label
      ctx.font = "6.5px var(--font-mono, monospace)";
      ctx.textAlign = "center";
      ctx.fillText(idx.toString(2).padStart(3, "0"), pos.x, pos.y - 4);

      // Node value
      ctx.fillStyle = fontColor;
      ctx.font = "bold 11px var(--font-sans, sans-serif)";
      ctx.fillText(String(val), pos.x, pos.y + 6);
      ctx.textAlign = "left";
    });
  };

  const renderTreeLayout = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
  ) => {
    // Array tree reduction visualizer
    const data = ((currentEvent?.arraySnapshot || inputData) as number[]) || [];
    const size = data.length || 8;
    const leavesY = h - 120;
    const leavesSpacing = (w - 160) / (size - 1 || 1);

    ctx.font = "11px var(--font-mono, monospace)";
    ctx.fillStyle = "#52525b";
    ctx.fillText(
      "COMPUTATIONAL PARADIGM: BINARY TREE SUMMATION / SCAN",
      40,
      40,
    );

    // Draw lines connecting tree leaves to aggregate layers
    ctx.strokeStyle = "#3f3f46"; // Brighter gray lines
    ctx.lineWidth = 1.5;

    // Renders physical tree reduction levels
    const depth = Math.ceil(Math.log2(size));
    let nodesInLevel = size;
    let currentY = leavesY;

    // Render tree nodes
    for (let i = 0; i < size; i++) {
      const x = 80 + i * leavesSpacing;
      const val = data[i];

      const isVisited = currentEvent?.indices?.includes(i);
      let border = "#52525b"; // Brighter gray node border
      let fontColor = "#d4d4d8";

      if (isVisited) {
        border = "#10b981";
        fontColor = "#34d399";
      }

      ctx.fillStyle = "#09090b";
      ctx.beginPath();
      ctx.arc(x, currentY, 16, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = border;
      ctx.lineWidth = isVisited ? 2.5 : 1.5;
      ctx.stroke();

      ctx.fillStyle = fontColor;
      ctx.font = "bold 11px var(--font-sans, sans-serif)";
      ctx.textAlign = "center";
      ctx.fillText(String(val), x, currentY + 4);
    }
    ctx.textAlign = "left";
  };

  const renderGraph = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const graph = getDefaultGraph(); // uses static beautifully aligned graph

    ctx.font = "11px var(--font-mono, monospace)";
    ctx.fillStyle = "#52525b";
    ctx.fillText("GRAPH TOPOLOGY ADJACENCY BUFFER VIEW", 40, 40);

    const isFinalStep = currentStep === (events?.length || 0) - 1;
    const isBFS = algorithmId === "bfs";
    const isDijkstra = algorithmId === "dijkstra";
    const isDFS = algorithmId === "dfs";
    const isAStar = algorithmId === "astar";
    const isAnyGraph = isBFS || isDijkstra || isDFS || isAStar;

    let shortestPathNodes: number[] = [];
    let shortestPathEdges: string[] = [];

    if (isFinalStep) {
      if (isBFS) {
        shortestPathNodes = [0, 1, 3, 5];
        shortestPathEdges = ["0-1", "1-3", "3-5"];
      } else if (isDFS) {
        shortestPathNodes = [0, 1, 2, 3, 4, 5];
        shortestPathEdges = ["0-1", "0-2", "1-3", "3-4", "3-5"];
      } else if (isDijkstra) {
        shortestPathNodes = [0, 1, 2, 3, 4, 5];
        shortestPathEdges = ["0-2", "1-2", "1-3", "3-4", "4-5"];
      } else if (isAStar) {
        shortestPathNodes = [0, 1, 2, 3, 5];
        shortestPathEdges = ["0-2", "1-2", "1-3", "3-5"];
      }
    }

    // 1. Draw Edges
    graph.nodes.forEach((u) => {
      const neighbors = graph.adjacencyList[u.id] || [];
      neighbors.forEach((edge) => {
        const vNode = graph.nodes.find((n) => n.id === edge.node);
        if (!vNode) return;

        const edgeId =
          u.id < vNode.id ? `${u.id}-${vNode.id}` : `${vNode.id}-${u.id}`;
        const isEdgeVisited = currentEvent?.edgeIds?.includes(edgeId);

        let strokeStyle = "#52525b"; // Brighter gray default edge line (originally #1e1e24)
        let lineWidth = 1.5;

        if (isFinalStep && isAnyGraph) {
          if (shortestPathEdges.includes(edgeId)) {
            strokeStyle = "#10b981"; // Bright green for shortest path
            lineWidth = 4;
          } else if (isEdgeVisited) {
            strokeStyle = "#065f4650"; // Visited but not in shortest path
            lineWidth = 1.5;
          } else {
            strokeStyle = "#3f3f46"; // Unvisited edges off path
            lineWidth = 1.2;
          }
        } else {
          strokeStyle = isEdgeVisited ? "#10b981" : "#52525b";
          lineWidth = isEdgeVisited ? 3 : 1.5;
        }

        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.moveTo(u.x + 100, u.y + 60);
        ctx.lineTo(vNode.x + 100, vNode.y + 60);
        ctx.stroke();

        // Label edge weights (skip for BFS and DFS)
        if (algorithmId !== "bfs" && algorithmId !== "dfs") {
          const midX = (u.x + vNode.x) / 2 + 100;
          const midY = (u.y + vNode.y) / 2 + 56;

          const isShortestEdge = shortestPathEdges.includes(edgeId);
          if (isFinalStep && (isDijkstra || isAStar) && isShortestEdge) {
            ctx.fillStyle = "#34d399";
            ctx.font = "bold 11px var(--font-mono, monospace)";
          } else {
            ctx.fillStyle = isEdgeVisited ? "#10b981" : "#71717a";
            ctx.font = "9px var(--font-mono, monospace)";
          }
          ctx.fillText(String(edge.weight), midX, midY);
        }
      });
    });

    // 2. Draw Nodes
    graph.nodes.forEach((u) => {
      const isNodeVisited = currentEvent?.nodeIds?.includes(u.id);
      const isDiscovering = currentEvent?.activeNodes?.includes(u.id);

      let border = "#52525b"; // Brighter gray node border (originally #27272a)
      let backColor = "#09090b";
      let fontColor = "#d4d4d8";
      let lineWidth = 1.5;

      if (isFinalStep && isAnyGraph) {
        if (shortestPathNodes.includes(u.id)) {
          border = "#10b981"; // Bright green for shortest path nodes
          backColor = "#065f4630";
          fontColor = "#34d399";
          lineWidth = 4;
        } else {
          border = "#10b98115"; // Muted green for visited nodes off-path
          backColor = "#09090b";
          fontColor = "#71717a";
          lineWidth = 1.5;
        }
      } else {
        if (isNodeVisited) {
          border = "#10b981"; // completed Emerald
          backColor = "#065f4620";
          fontColor = "#34d399";
          lineWidth = 3;
        } else if (isDiscovering) {
          border = "#06b6d4"; // frontier Cyan
          backColor = "#0891b210";
          fontColor = "#22d3ee";
          lineWidth = 3;
        }
      }

      ctx.fillStyle = backColor;
      ctx.beginPath();
      ctx.arc(u.x + 100, u.y + 60, 20, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = border;
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      // Label Node Name
      ctx.fillStyle = fontColor;
      ctx.font = "bold 14px var(--font-sans, sans-serif)";
      ctx.textAlign = "center";
      ctx.fillText(u.label, u.x + 100, u.y + 65);

      // Label Heuristic for A* Algorithm
      if (isAStar) {
        const goalNode = graph.nodes.find((n) => n.id === 5);
        if (goalNode) {
          const hVal = Math.round(
            Math.hypot(u.x - goalNode.x, u.y - goalNode.y) / 20,
          );
          ctx.fillStyle = "#38bdf8"; // Bright sky blue to stand out beautifully
          ctx.font = "bold 10px var(--font-mono, monospace)";
          ctx.fillText(`h=${hVal}`, u.x + 100, u.y + 32);
        }
      }

      ctx.textAlign = "left";
    });

    // 3. Draw Queue / Priority Queue / Stack visualization
    if (isAnyGraph) {
      const qState = currentEvent?.queueState || [];
      let title = "";
      if (isBFS) {
        title = "BFS ACTIVE QUEUE (FIFO)";
      } else if (isDFS) {
        title = "DFS ACTIVE STACK (LIFO) - [TOP ON LEFT]";
      } else if (isDijkstra) {
        title = "DIJKSTRA ACTIVE PRIORITY QUEUE (MIN-DIST)";
      } else if (isAStar) {
        title = "A* ACTIVE OPEN LIST (MIN-F = G + H)";
      }

      const startY = h - 65; // Draw near the bottom
      const startX = 40;

      ctx.fillStyle = "#71717a"; // Muted gray label
      ctx.font = "9px var(--font-mono, monospace)";
      ctx.fillText(title, startX, startY - 12);

      if (qState.length === 0) {
        ctx.fillStyle = "#3f3f46";
        ctx.font = "italic 11px var(--font-sans, sans-serif)";
        ctx.fillText("Empty", startX, startY + 12);
      } else {
        let currentX = startX;
        const displayState = isDFS ? [...qState].reverse() : qState;

        displayState.forEach((item, index) => {
          // Draw box for each item
          const itemWidth = isAStar ? 110 : isDijkstra ? 75 : 40;
          const itemHeight = 24;

          const isCyanHighlight = isBFS || isDFS;

          // Draw border & fill
          ctx.fillStyle = "#09090b";
          ctx.strokeStyle =
            index === 0 ? (isCyanHighlight ? "#06b6d4" : "#10b981") : "#3f3f46"; // Highlight front of queue (cyan for BFS/DFS, green for Dijkstra/A*)
          ctx.lineWidth = index === 0 ? 2 : 1;

          ctx.beginPath();
          ctx.rect(currentX, startY, itemWidth, itemHeight);
          ctx.fill();
          ctx.stroke();

          // Text inside box
          ctx.fillStyle =
            index === 0 ? (isCyanHighlight ? "#22d3ee" : "#34d399") : "#d4d4d8";
          ctx.font = isAStar
            ? "bold 9px var(--font-mono, monospace)"
            : "bold 11px var(--font-mono, monospace)";
          ctx.textAlign = "center";
          ctx.fillText(
            item,
            currentX + itemWidth / 2,
            startY + itemHeight / 2 + 4,
          );
          ctx.textAlign = "left";

          currentX += itemWidth;

          // Draw arrow to next item (if not the last one)
          if (index < displayState.length - 1) {
            ctx.strokeStyle = "#3f3f46";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(currentX + 2, startY + itemHeight / 2);
            ctx.lineTo(currentX + 10, startY + itemHeight / 2);
            // arrow head
            ctx.lineTo(currentX + 7, startY + itemHeight / 2 - 3);
            ctx.moveTo(currentX + 10, startY + itemHeight / 2);
            ctx.lineTo(currentX + 7, startY + itemHeight / 2 + 3);
            ctx.stroke();

            currentX += 12;
          }
        });
      }
    }
  };

  const computeMergeSortTree = (
    arrData: number[],
    simEvents: SimulationEvent[],
    step: number,
  ) => {
    if (!arrData || !Array.isArray(arrData) || arrData.length === 0) {
      return {};
    }
    const n = arrData.length;
    const nodesMap: Record<
      string,
      {
        l: number;
        r: number;
        id: string;
        depth: number;
        isCreated: boolean;
        isMerged: boolean;
        isMerging: boolean;
        isActive: boolean;
        values: (number | null)[];
      }
    > = {};

    const buildNodes = (l: number, r: number, depth: number = 0) => {
      const id = `${l}-${r}`;
      nodesMap[id] = {
        l,
        r,
        id,
        depth,
        isCreated: false,
        isMerged: l === r,
        isMerging: false,
        isActive: false,
        values: arrData.slice(l, r + 1),
      };
      if (l < r) {
        const mid = Math.floor((l + r) / 2);
        buildNodes(l, mid, depth + 1);
        buildNodes(mid + 1, r, depth + 1);
      }
    };
    buildNodes(0, n - 1, 0);

    const rootId = `0-${n - 1}`;
    if (nodesMap[rootId]) {
      nodesMap[rootId].isCreated = true;
    }

    let activeMergeRange: { l: number; r: number } | null = null;
    const eventsList = simEvents || [];

    for (let s = 0; s <= step; s++) {
      const e = eventsList[s];
      if (!e) continue;

      if (e.description && e.description.includes("Split list from index")) {
        const match = e.description.match(
          /Split list from index (\d+) to (\d+) at midpoint (\d+)/,
        );
        if (match) {
          const l = parseInt(match[1], 10);
          const r = parseInt(match[2], 10);
          const mid = parseInt(match[3], 10);

          const leftId = `${l}-${mid}`;
          const rightId = `${mid + 1}-${r}`;
          const parentId = `${l}-${r}`;
          const parentNode = nodesMap[parentId];

          if (nodesMap[leftId] && !nodesMap[leftId].isCreated) {
            nodesMap[leftId].isCreated = true;
            if (parentNode) {
              nodesMap[leftId].values = parentNode.values.slice(0, mid - l + 1);
            }
          }
          if (nodesMap[rightId] && !nodesMap[rightId].isCreated) {
            nodesMap[rightId].isCreated = true;
            if (parentNode) {
              nodesMap[rightId].values = parentNode.values.slice(
                mid + 1 - l,
                r - l + 1,
              );
            }
          }
        }
      }

      if (e.description && e.description.includes("Merging sorted halves")) {
        const match = e.description.match(
          /Merging sorted halves: indices \[(\d+)\.\.(\d+)\] and \[(\d+)\.\.(\d+)\]/,
        );
        if (match) {
          const l = parseInt(match[1], 10);
          const r = parseInt(match[4], 10);
          activeMergeRange = { l, r };

          const id = `${l}-${r}`;
          if (nodesMap[id]) {
            nodesMap[id].isMerging = true;
            nodesMap[id].isMerged = false;
            nodesMap[id].values = Array(r - l + 1).fill(null);
          }
        }
      }

      if (
        e.type === "WRITE" &&
        e.indices &&
        e.indices.length > 0 &&
        e.arraySnapshot
      ) {
        const k = e.indices[0];
        if (
          activeMergeRange &&
          k >= activeMergeRange.l &&
          k <= activeMergeRange.r
        ) {
          const id = `${activeMergeRange.l}-${activeMergeRange.r}`;
          const node = nodesMap[id];
          if (node && node.isMerging) {
            node.values[k - node.l] = e.arraySnapshot[k];
            if (k === node.r) {
              node.isMerged = true;
              node.isMerging = false;
            }
          }
        }
      }
    }

    const currentEvent = eventsList[step];
    if (currentEvent) {
      let activeNodeId: string | null = null;

      if (
        currentEvent.description &&
        currentEvent.description.includes("Split list from index")
      ) {
        const match = currentEvent.description.match(
          /Split list from index (\d+) to (\d+) at midpoint (\d+)/,
        );
        if (match) {
          activeNodeId = `${match[1]}-${match[2]}`;
        }
      } else if (
        currentEvent.description &&
        currentEvent.description.includes("Merging sorted halves")
      ) {
        const match = currentEvent.description.match(
          /Merging sorted halves: indices \[(\d+)\.\.(\d+)\] and \[(\d+)\.\.(\d+)\]/,
        );
        if (match) {
          activeNodeId = `${match[1]}-${match[4]}`;
        }
      } else if (activeMergeRange) {
        activeNodeId = `${activeMergeRange.l}-${activeMergeRange.r}`;
      }

      if (activeNodeId && nodesMap[activeNodeId]) {
        nodesMap[activeNodeId].isActive = true;
      }
    }

    return nodesMap;
  };

  const renderMergeSortTree = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    nodesMap: Record<string, any>,
    currentEvt: SimulationEvent | null,
  ) => {
    const rawData = currentEvt?.arraySnapshot || inputData;
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
      return;
    }
    const data = rawData as number[];
    const n = data.length;

    const maxDepth = Math.ceil(Math.log2(n));
    const topMargin = 70;
    const bottomMargin = 50;
    const availableHeight = h - topMargin - bottomMargin;
    const levelSpacing = maxDepth > 0 ? availableHeight / maxDepth : 0;

    const leftMargin = 80;
    const rightMargin = 80;
    const availableWidth = w - leftMargin - rightMargin;
    const leafSpacing = n > 1 ? availableWidth / (n - 1) : 0;

    const getXOfIndex = (i: number) => {
      return leftMargin + i * leafSpacing;
    };

    const getNodeCoords = (l: number, r: number, depth: number) => {
      const xl = getXOfIndex(l);
      const xr = getXOfIndex(r);
      const x = (xl + xr) / 2;
      const y = topMargin + depth * levelSpacing;
      return { x, y };
    };

    ctx.font = "11px var(--font-mono, monospace)";
    ctx.fillStyle = "#71717a";
    ctx.fillText("RECURSIVE DIVIDE & CONQUER TREE", 40, 35);

    // Draw lines first (so they are in the background)
    Object.keys(nodesMap).forEach((id) => {
      const node = nodesMap[id];
      if (!node.isCreated) return;

      if (node.l < node.r) {
        const mid = Math.floor((node.l + node.r) / 2);
        const leftId = `${node.l}-${mid}`;
        const rightId = `${mid + 1}-${node.r}`;

        const parentCoords = getNodeCoords(node.l, node.r, node.depth);

        const leftNode = nodesMap[leftId];
        if (leftNode && leftNode.isCreated) {
          const childCoords = getNodeCoords(
            leftNode.l,
            leftNode.r,
            leftNode.depth,
          );
          ctx.beginPath();
          ctx.moveTo(parentCoords.x, parentCoords.y + 12);
          ctx.bezierCurveTo(
            parentCoords.x,
            (parentCoords.y + childCoords.y) / 2,
            childCoords.x,
            (parentCoords.y + childCoords.y) / 2,
            childCoords.x,
            childCoords.y - 12,
          );
          const isBranchActive =
            node.isActive ||
            leftNode.isActive ||
            leftNode.isMerging ||
            node.isMerging;
          ctx.strokeStyle = isBranchActive ? "#10b98180" : "#18181b";
          ctx.lineWidth = isBranchActive ? 2.5 : 1.5;
          ctx.stroke();
        }

        const rightNode = nodesMap[rightId];
        if (rightNode && rightNode.isCreated) {
          const childCoords = getNodeCoords(
            rightNode.l,
            rightNode.r,
            rightNode.depth,
          );
          ctx.beginPath();
          ctx.moveTo(parentCoords.x, parentCoords.y + 12);
          ctx.bezierCurveTo(
            parentCoords.x,
            (parentCoords.y + childCoords.y) / 2,
            childCoords.x,
            (parentCoords.y + childCoords.y) / 2,
            childCoords.x,
            childCoords.y - 12,
          );
          const isBranchActive =
            node.isActive ||
            rightNode.isActive ||
            rightNode.isMerging ||
            node.isMerging;
          ctx.strokeStyle = isBranchActive ? "#10b98180" : "#18181b";
          ctx.lineWidth = isBranchActive ? 2.5 : 1.5;
          ctx.stroke();
        }
      }
    });

    // Draw the node groups and cells
    const activeNode = Object.values(nodesMap).find((n) => n.isActive);

    Object.keys(nodesMap).forEach((id) => {
      const node = nodesMap[id];
      if (!node.isCreated) return;

      const { x, y } = getNodeCoords(node.l, node.r, node.depth);

      const k = node.r - node.l + 1;
      const depth = node.depth;
      const cellW = Math.max(18, 30 - depth * 2.5);
      const cellH = Math.max(22, 34 - depth * 2.5);
      const nodeWidth = k * cellW;
      const startX = x - nodeWidth / 2;

      let nodeBorder = "#52525b";
      let nodeBg = "#09090b";
      let nodeShadow = "transparent";

      if (node.isActive) {
        nodeBorder = "#10b981";
        nodeBg = "#10b98110";
        nodeShadow = "#10b98130";
      } else if (node.isMerging) {
        nodeBorder = "#06b6d4";
        nodeBg = "#06b6d410";
        nodeShadow = "#06b6d420";
      } else if (node.isMerged) {
        nodeBorder = "#10b98130";
        nodeBg = "#09090b";
      }

      if (nodeShadow !== "transparent") {
        ctx.shadowColor = nodeShadow;
        ctx.shadowBlur = 8;
      }
      ctx.fillStyle = nodeBg;
      ctx.beginPath();
      ctx.roundRect(startX, y - cellH / 2, nodeWidth, cellH, 4);
      ctx.fill();
      ctx.shadowBlur = 0;

      for (let idx = 0; idx < k; idx++) {
        const globalIndex = node.l + idx;
        const cellVal =
          node.values[idx] !== undefined && node.values[idx] !== null
            ? node.values[idx]
            : null;
        const cellX = startX + idx * cellW;

        const isActiveParent = activeNode && node.id === activeNode.id;
        const isLeftChild =
          activeNode &&
          node.l === activeNode.l &&
          node.r === Math.floor((activeNode.l + activeNode.r) / 2);
        const isRightChild =
          activeNode &&
          node.l === Math.floor((activeNode.l + activeNode.r) / 2) + 1 &&
          node.r === activeNode.r;
        const isChildOfActive = isLeftChild || isRightChild;

        let isCompare = false;
        let isWrite = false;

        if (currentEvt?.type === "COMPARE") {
          if (isActiveParent) {
            const nextParentWriteIdx = node.values.indexOf(null);
            if (
              nextParentWriteIdx !== -1 &&
              globalIndex === node.l + nextParentWriteIdx
            ) {
              isCompare = true;
            }
          } else if (isChildOfActive) {
            if (currentEvt.indices?.includes(globalIndex)) {
              isCompare = true;
            }
          }
        } else if (currentEvt?.type === "WRITE") {
          if (isActiveParent) {
            if (currentEvt.indices?.includes(globalIndex)) {
              isWrite = true;
            }
          }
        }

        let cellBorder = nodeBorder;
        let cellFill = "transparent";
        let cellText = "#e4e4e7";

        if (isCompare) {
          cellBorder = "#f59e0b";
          cellFill = "#f59e0b25";
          cellText = "#fbbf24";
        } else if (isWrite) {
          cellBorder = "#10b981";
          cellFill = "#10b98125";
          cellText = "#34d399";
        } else if (node.isMerged) {
          cellText = "#34d399";
          cellBorder = "#10b98120";
        }

        if (cellFill !== "transparent") {
          ctx.fillStyle = cellFill;
          ctx.fillRect(cellX + 1, y - cellH / 2 + 1, cellW - 2, cellH - 2);
        }

        ctx.strokeStyle = cellBorder;
        ctx.lineWidth = isCompare || isWrite ? 2 : 1;
        ctx.strokeRect(cellX, y - cellH / 2, cellW, cellH);

        // Draw indices outside (above) the box cells
        ctx.fillStyle = "#71717a";
        ctx.font = `${Math.max(7, 10 - depth * 1.0)}px var(--font-mono, monospace)`;
        ctx.textAlign = "center";
        ctx.fillText(String(globalIndex), cellX + cellW / 2, y - cellH / 2 - 5);

        if (cellVal !== null && cellVal !== undefined) {
          ctx.fillStyle = cellText;
          ctx.font = `bold ${Math.max(10, 14 - depth * 1.2)}px var(--font-sans, sans-serif)`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(cellVal), cellX + cellW / 2, y);
          ctx.textBaseline = "alphabetic"; // reset to default
        }
      }
      ctx.textAlign = "left";
    });
  };

  const renderPackets = (ctx: CanvasRenderingContext2D) => {
    packets.forEach((p) => {
      const currX = p.fromX + (p.toX - p.fromX) * p.progress;
      const currY = p.fromY + (p.toY - p.fromY) * p.progress;

      // Pulse glow shadow for active floating packet
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(currX, currY, 7, 0, 2 * Math.PI);
      ctx.fill();

      ctx.shadowBlur = 0; // reset shadow

      // Tiny overlay packet text label
      ctx.fillStyle = "#000000";
      ctx.font = "bold 7px var(--font-mono, monospace)";
      ctx.textAlign = "center";
      ctx.fillText(p.label, currX, currY + 2.5);
      ctx.textAlign = "left";
    });
  };

  // Spawn packets on step change (Moved down to avoid hoisting errors and wrapped in setTimeout to avoid synchronous setState warnings)
  useEffect(() => {
    if (!currentEvent) {
      const timer = setTimeout(() => {
        setPackets([]);
      }, 0);
      lastStepRef.current = -1;
      return () => clearTimeout(timer);
    }

    // Only trigger if we moved to a new step
    if (currentEvent.step !== lastStepRef.current) {
      lastStepRef.current = currentEvent.step;

      const newPackets: MessagePacket[] = [];
      const { width, height } = dimensions;

      // PRAM or interconnection packet generation
      if (
        currentEvent.type === "SEND_MESSAGE" &&
        typeof currentEvent.from === "number" &&
        typeof currentEvent.to === "number"
      ) {
        const coords = getPacketEndpoints(
          currentEvent.from,
          currentEvent.to,
          model,
          processorCount,
          width,
          height,
          inputData,
        );
        if (coords) {
          newPackets.push({
            fromX: coords.fromX,
            fromY: coords.fromY,
            toX: coords.toX,
            toY: coords.toY,
            progress: 0,
            label: String(currentEvent.msg || "MSG"),
            color: "#10b981", // emerald
          });
        }
      } else if (
        (currentEvent.type === "READ" || currentEvent.type === "WRITE") &&
        currentEvent.processors &&
        currentEvent.indices
      ) {
        // Multi-channel reading/writing packet from processors to shared memory cells
        currentEvent.processors.forEach((pId, idx) => {
          const targetIdx = currentEvent.indices?.[idx];
          if (typeof targetIdx === "number") {
            const coords = getPRAMEndpoints(
              pId,
              targetIdx,
              processorCount,
              inputData?.length || 8,
              width,
              height,
            );
            if (coords) {
              const isRead = currentEvent.type === "READ";
              newPackets.push({
                fromX: isRead ? coords.memX : coords.pX,
                fromY: isRead ? coords.memY : coords.pY,
                toX: isRead ? coords.pX : coords.memX,
                toY: isRead ? coords.pY : coords.memY,
                progress: 0,
                label: isRead
                  ? "READ"
                  : String(currentEvent.values?.[idx] || "DATA"),
                color: isRead ? "#22d3ee" : "#10b981", // cyan vs emerald
              });
            }
          }
        });
      }

      const timer = setTimeout(() => {
        if (newPackets.length > 0) {
          setPackets(newPackets);
        } else {
          setPackets([]);
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [currentEvent, dimensions, model, processorCount, inputData]);

  // Update packet animations (Moved down to avoid hoisting errors)
  useEffect(() => {
    let animationFrameId: number;
    const update = () => {
      setPackets((prev) => {
        const filtered = prev
          .map((p) => ({ ...p, progress: p.progress + 0.04 })) // speed of packet slide
          .filter((p) => p.progress <= 1.0);
        return filtered;
      });
      animationFrameId = requestAnimationFrame(update);
    };
    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Main canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = dimensions;

    // Set pixel density ratio
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear Canvas
    ctx.fillStyle = "#09090b"; // Tailwind Zinc 950
    ctx.fillRect(0, 0, width, height);

    // Draw Subtle Tech Grid lines
    ctx.strokeStyle = "#18181b"; // Zinc 900
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // --- RENDER ROUTING BASED ON MODEL / ALGORITHM ---
    const isGraphAlgorithm =
      algorithmId === "bfs" ||
      algorithmId === "dfs" ||
      algorithmId === "astar" ||
      algorithmId === "dijkstra" ||
      algorithmId === "parallel-bfs";

    if (isGraphAlgorithm) {
      renderGraph(ctx, width, height);
    } else if (algorithmId === "merge-sort") {
      const isFinalStep =
        currentEvent && events && currentStep === events.length - 1;
      if (isFinalStep) {
        renderSequentialArray(ctx, width, height);
      } else {
        const nodesMap = computeMergeSortTree(
          inputData as number[],
          events,
          currentStep,
        );
        renderMergeSortTree(ctx, width, height, nodesMap, currentEvent);
      }
    } else {
      switch (model) {
        case "RAM":
          renderSequentialArray(ctx, width, height);
          break;
        case "PRAM-EREW":
        case "PRAM-CREW":
        case "PRAM-CRCW":
          renderPRAMLayout(ctx, width, height);
          break;
        case "Ring":
          renderRingLayout(ctx, width, height);
          break;
        case "Mesh":
          renderMeshLayout(ctx, width, height);
          break;
        case "Hypercube":
          renderHypercubeLayout(ctx, width, height);
          break;
        case "Tree":
          renderTreeLayout(ctx, width, height);
          break;
        default:
          renderSequentialArray(ctx, width, height);
          break;
      }
    }

    // Draw active animated message packets
    renderPackets(ctx);

    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [
    dimensions,
    algorithmId,
    model,
    currentEvent,
    inputData,
    processorCount,
    packets,
    events,
    currentStep,
  ]);

  return (
    <div
      ref={containerRef}
      id="simulation-canvas-container"
      className="relative w-full border border-zinc-800 bg-zinc-950 rounded-xl overflow-hidden shadow-2xl flex justify-center items-center"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          display: "block",
        }}
      />
    </div>
  );
}
