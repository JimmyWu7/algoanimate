# Parallel & Sequential Algorithm Visualizer

An immersive, production-quality educational sandbox designed to visualize traditional sequential algorithms alongside advanced parallel models. Unlike standard sequential visualizers, this platform focuses deeply on parallel computation, multi-processor interconnects, shared memory access, and message-routing topologies.

---

## 🎨 Design Philosophy & Aesthetic

Inspired by high-end developer interfaces (Linear, Vercel, Raycast), the visualizer employs:

- **Carbon Slate Workspace**: Generous negative space, dark backgrounds, and subtle technical grids.
- **Micro-Animations & Message Packets**: Time-interpolated floating packet particles sliding between nodes at 60 FPS, providing tactile, clear representations of reads/writes and communications.
- **Cyberpunk Glow Accents**: Utilizing canvas blur shadows to highlight active cores, data-reads (Cyan), data-writes (Emerald), and comparisons (Amber).

---

## 🏗️ Software Architecture

The application adheres to a strict, event-driven simulation boundary:

1. **The Simulation Engine (`/hooks/use-simulation.ts`)**: Generates and manages the playback timeline, step boundaries, synchronization barriers, and aggregates live-updating complexity statistics (Work, Span, Speedup, Efficiency).
2. **The Generators (`/algorithms/generators.ts`)**: Isolated algorithm executors that operate strictly in memory. They do _not_ animate directly; instead, they emit sequential visual events (e.g. `COMPARE`, `SWAP`, `READ`, `WRITE`, `SEND_MESSAGE`, `BARRIER`).
3. **The Renderer (`/components/canvas-visualizer.tsx`)**: A high-performance, single-canvas visualizer that reads the current active event frame and draws appropriate hardware, processor lattices, arrays, or node networks.
4. **The Synchronizer (`/components/algorithm-view.tsx`)**: Reaches into the active step and links visual components directly with line highlights inside the pseudocode panel.

---

## 📁 Complete Folder Structure

```
├── app/
│   ├── globals.css          # Tailwind CSS global styling
│   ├── layout.tsx           # Global Next.js layout & metadata
│   └── page.tsx             # Root page, handles view transitions & sidebar state
├── components/
│   ├── algorithm-view.tsx   # Active simulation workstation (panels, logs, tabs)
│   ├── canvas-visualizer.tsx# Responsive 60fps HTML5 Canvas renderer
│   ├── dashboard.tsx        # High-end index landing deck (search, cards, metrics)
│   ├── settings.tsx         # Preferences (core allocation, accessibility filters)
│   └── sidebar.tsx          # Collapsible vertical navigation rails
├── hooks/
│   ├── use-mobile.ts        # Responsive window screen helper
│   └── use-simulation.ts    # Reusable event-driven playback state controller
├── lib/
│   ├── algorithm-registry.ts# Static catalog database (descriptions, pseudocode)
│   └── utils.ts             # CN tailwind helper utilities
├── types/
│   └── algorithms.ts        # Fully typed interfaces for simulation events
├── metadata.json            # Application metadata
├── package.json             # NPM package configurations
└── README.md                # Platform documentation
```

---

## 🚀 Key Visualized Topologies & Engines

### 1. Sequential Engines (RAM Model)

- **Sorting networks**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort.
- **Structures & Traversals**: Binary Search, Breadth-First Search (BFS), Dijkstra's Routing.

### 2. Parallel Engines (PRAM & Distributed Networks)

- **Parallel Reduction (Sum)**: Visualizes a binary reduction tree where multiple cores collapse elements in logarithmic $O(\log N)$ stages.
- **Parallel Prefix Sum (Scan)**: Hillis-Steele prefix addition showing concurrent reads and writes with barrier synchronizations.
- **Bitonic Sort Network**: Demonstrates hypercube-modeled comparative structures where spacing splits divide data in parallel phases.
- **Odd-Even Sort (Ring)**: Highlights adjacent processor communication along a linked Ring topology.
- **Pointer Jumping**: Features List Ranking where elements shrink path dependencies from linear to logarithmic lengths.
- **Parallel BFS**: Dispatches concurrently scanning frontiers to graph nodes.

---

## 🛠️ Performance & Accessibility Controls

- **Core Allocations**: Scale logical processors dynamically from 2 to 12 cores.
- **Interactive Inputs**: Randomize arrays, custom index inputs, or slide sizes instantly.
- **Reduce Motion Filter**: One-tap accessibility switch to disable high-frequency animations or floating packet slides.
- **Dual Visual Themes**: Swap styles between **Cosmic Zinc** (minimal slate carbon) and **Aurora Emerald** (high luminance highlight).

---

## 🛣️ Future Engineering Roadmap

1. **Workspace Syncing**: Save custom graph matrix configurations or array sets inside client-side index buffers.
2. **Audio-Synthesizer Nodes**: Map comparative array indices to auditory sine-waves for multi-sensory educational aid.
3. **Multi-User Realtime Canvas**: Dispatch shared room states allowing teachers to lecture and sync active simulation playheads across student screens concurrently.
