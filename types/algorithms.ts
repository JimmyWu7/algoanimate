export type AlgorithmType = "sequential" | "parallel";

export type AlgorithmId =
  | "bubble-sort"
  | "selection-sort"
  | "insertion-sort"
  | "merge-sort"
  | "quick-sort"
  | "bucket-sort"
  | "radix-sort"
  | "heap-sort"
  | "timsort"
  | "greedy"
  | "binary-search"
  | "bfs"
  | "dfs"
  | "astar"
  | "dijkstra"
  | "prim"
  | "kruskal"
  | "parallel-reduction"
  | "parallel-prefix-sum"
  | "bitonic-sort"
  | "odd-even-sort"
  | "pointer-jumping"
  | "parallel-matrix-multiplication"
  | "parallel-bfs";

export type ComputationalModelId =
  | "RAM"
  | "PRAM-EREW"
  | "PRAM-CREW"
  | "PRAM-CRCW"
  | "Ring"
  | "Mesh"
  | "Hypercube"
  | "Tree"
  | "Butterfly";

export interface AlgorithmMetadata {
  id: AlgorithmId;
  name: string;
  type: AlgorithmType;
  category:
    | "Sorting"
    | "Searching"
    | "Graphs"
    | "Greedy & Optimization"
    | "Parallel Computing"
    | "Numerical";
  model: ComputationalModelId;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  workComplexity: string;
  spanComplexity: string;
  processorComplexity: string;
  advantages: string[];
  disadvantages: string[];
  applications: string[];
  pseudocode: string[];
  defaultInputSize: number;
  maxInputSize: number;
  defaultProcessorCount?: number;
  maxProcessorCount?: number;
}

export type EventType =
  | "COMPARE"
  | "SWAP"
  | "READ"
  | "WRITE"
  | "SEND_MESSAGE"
  | "RECEIVE_MESSAGE"
  | "PROCESSOR_ACTIVE"
  | "PROCESSOR_IDLE"
  | "LOCK"
  | "UNLOCK"
  | "BARRIER"
  | "HIGHLIGHT"
  | "CREATE_NODE"
  | "DELETE_NODE"
  | "MOVE"
  | "MERGE"
  | "SPLIT";

export interface SimulationEvent {
  type: EventType;
  step: number;
  line: number; // 0-indexed line of pseudocode
  description: string;
  // Payload of visual changes
  indices?: number[]; // indices of array elements being modified or accessed
  pairs?: [number, number][]; // specific pairs of indices being compared or swapped in parallel
  values?: number[]; // values being written or compared
  processors?: number[]; // processor IDs involved
  from?: number; // message path source
  to?: number; // message path target
  msg?: string | number; // message content
  nodeIds?: number[]; // graph nodes
  edgeIds?: string[]; // graph edges: 'u-v'
  mstEdges?: string[]; // list of edges accepted into Minimum Spanning Tree
  mstTotalWeight?: number; // running total weight of MST
  rejectedEdges?: string[]; // edges rejected because they create cycles
  candidateEdge?: string; // current edge under evaluation
  disjointSets?: { [key: number]: number }; // parent pointers for Union-Find
  activeNodes?: number[]; // currently active elements
  queueState?: string[]; // state of the queue/priority queue for BFS/Dijkstra/Prim
  matrixCoords?: { r: number; c: number; processorId?: number }[]; // for matrix mult
  arraySnapshot?: number[]; // snapshot of array-based states at this step
  k?: number; // current bitonic sublist size
  j?: number; // current comparison spacing / offset
  heapSize?: number; // active heap size for heap sort
  radixData?: {
    buckets: number[][];
    exp: number;
    stage: "distribute" | "collect";
  };
  bucketData?: {
    buckets: number[][];
    minVal: number;
    maxVal: number;
    range: number;
    stage: "distribute" | "sort" | "concatenate";
  };
  timsortData?: {
    runSize: number;
    minRun?: number;
    runs: { start: number; end: number; sorted: boolean }[];
    runStack?: { start: number; len: number }[];
    stackAction?: string;
    activeRunIndex?: number;
    mergeRange?: [number, number, number]; // [left, mid, right]
  };
  greedyData?: {
    capacity: number;
    currentWeight: number;
    currentValue: number;
    items: {
      id: number;
      label: string;
      weight: number;
      value: number;
      density: number;
      fractionTaken: number;
      status:
        | "unconsidered"
        | "considering"
        | "taken"
        | "partially_taken"
        | "skipped";
    }[];
  };
  pValues?: number[];
  pChunks?: (number[] | string)[];
  sendingProcessors?: number[];
  idleProcessors?: number[];
  communications?: { fromP: number; toP: number; label: string }[];
  blockRanges?: [number, number][];
}

export interface SimulationState {
  events: SimulationEvent[];
  currentStep: number;
  isPlaying: boolean;
  speed: number; // multiplier, e.g. 1 = 1s per step, 5 = 200ms per step
  processorCount: number;
  inputSize: number;
  inputData: any; // array, graph representation, matrix, etc.
}

export interface RuntimeStats {
  comparisons: number;
  reads: number;
  writes: number;
  swaps: number;
  activeProcessorsCount: number;
  idleProcessorsCount: number;
  communicationCost: number;
  work: number;
  span: number;
  speedup: number;
  efficiency: number;
}

export interface Node {
  id: number;
  label: string;
  x: number;
  y: number;
  status: "idle" | "active" | "highlight";
}

export interface Edge {
  id: string; // 'u-v'
  source: number;
  target: number;
  weight?: number;
  status: "idle" | "active" | "highlight";
}
