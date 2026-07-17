import { SimulationEvent, AlgorithmId } from "@/types/algorithms";

// --- Graph Types for generator internal use ---
interface GeneratorGraph {
  nodes: { id: number; label: string; x: number; y: number }[];
  adjacencyList: { [key: number]: { node: number; weight: number }[] };
}

// Default graph generator
export function getDefaultGraph(): GeneratorGraph {
  return {
    nodes: [
      { id: 0, label: "A", x: 80, y: 150 },
      { id: 1, label: "B", x: 200, y: 80 },
      { id: 2, label: "C", x: 200, y: 220 },
      { id: 3, label: "D", x: 320, y: 80 },
      { id: 4, label: "E", x: 320, y: 220 },
      { id: 5, label: "F", x: 440, y: 150 },
    ],
    adjacencyList: {
      0: [
        { node: 1, weight: 4 },
        { node: 2, weight: 2 },
      ],
      1: [
        { node: 2, weight: 1 },
        { node: 3, weight: 5 },
      ],
      2: [
        { node: 3, weight: 8 },
        { node: 4, weight: 10 },
      ],
      3: [
        { node: 4, weight: 2 },
        { node: 5, weight: 6 },
      ],
      4: [{ node: 5, weight: 3 }],
      5: [],
    },
  };
}

export function generateEvents(
  id: AlgorithmId,
  input: any,
  processorCount: number = 4,
  reductionOp: "sum" | "min" | "max" | "product" = "sum",
): SimulationEvent[] {
  const events: SimulationEvent[] = [];
  let stepCounter = 0;

  const emit = (
    type: SimulationEvent["type"],
    line: number,
    description: string,
    params: Partial<
      Omit<SimulationEvent, "type" | "step" | "line" | "description">
    > = {},
  ) => {
    events.push({
      type,
      step: stepCounter++,
      line,
      description,
      ...params,
    });
  };

  // Switch based on algorithm ID
  switch (id) {
    case "bubble-sort": {
      const arr = [...input] as number[];
      const n = arr.length;
      emit("HIGHLIGHT", 0, "Start Bubble Sort on list: " + arr.join(", "), {
        arraySnapshot: [...arr],
      });

      let swapped: boolean;
      let limit = n;
      do {
        swapped = false;
        emit("HIGHLIGHT", 2, "Starting new scan pass...", {
          arraySnapshot: [...arr],
        });
        for (let i = 1; i < limit; i++) {
          emit(
            "COMPARE",
            4,
            `Comparing A[${i - 1}] (${arr[i - 1]}) and A[${i}] (${arr[i]})`,
            {
              indices: [i - 1, i],
              values: [arr[i - 1], arr[i]],
              arraySnapshot: [...arr],
            },
          );

          if (arr[i - 1] > arr[i]) {
            const temp = arr[i - 1];
            arr[i - 1] = arr[i];
            arr[i] = temp;
            swapped = true;

            emit("SWAP", 5, `Swapping elements: ${arr[i - 1]} and ${arr[i]}`, {
              indices: [i - 1, i],
              values: [arr[i - 1], arr[i]],
              arraySnapshot: [...arr],
            });
          }
        }
        limit--;
        emit("HIGHLIGHT", 10, `End of pass. Last element is now sorted.`, {
          indices: Array.from({ length: n - limit }, (_, idx) => n - 1 - idx),
          arraySnapshot: [...arr],
        });
      } while (swapped && limit > 1);

      emit("HIGHLIGHT", 12, "Array is fully sorted: " + arr.join(", "), {
        indices: Array.from({ length: n }, (_, idx) => idx),
        arraySnapshot: [...arr],
      });
      break;
    }

    case "selection-sort": {
      const arr = [...input] as number[];
      const n = arr.length;
      emit("HIGHLIGHT", 0, "Start Selection Sort on list: " + arr.join(", "), {
        arraySnapshot: [...arr],
      });

      for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        emit(
          "READ",
          2,
          `Set initial minimum at index ${i} (value: ${arr[i]})`,
          {
            indices: [i],
            arraySnapshot: [...arr],
          },
        );

        for (let j = i + 1; j < n; j++) {
          emit(
            "COMPARE",
            4,
            `Compare candidate A[${j}] (${arr[j]}) with current min A[${minIndex}] (${arr[minIndex]})`,
            {
              indices: [j, minIndex],
              arraySnapshot: [...arr],
            },
          );

          if (arr[j] < arr[minIndex]) {
            minIndex = j;
            emit(
              "HIGHLIGHT",
              5,
              `New minimum found at index ${j} (value: ${arr[j]})`,
              {
                indices: [j],
                arraySnapshot: [...arr],
              },
            );
          }
        }

        if (minIndex !== i) {
          const temp = arr[i];
          arr[i] = arr[minIndex];
          arr[minIndex] = temp;
          emit(
            "SWAP",
            9,
            `Swap elements: placing min element ${arr[i]} at index ${i}`,
            {
              indices: [i, minIndex],
              values: [arr[i], arr[minIndex]],
              arraySnapshot: [...arr],
            },
          );
        }
      }
      emit(
        "HIGHLIGHT",
        12,
        "Selection Sort finished! Sorted array: " + arr.join(", "),
        {
          indices: Array.from({ length: n }, (_, idx) => idx),
          arraySnapshot: [...arr],
        },
      );
      break;
    }

    case "insertion-sort": {
      const arr = [...input] as number[];
      const n = arr.length;
      emit("HIGHLIGHT", 0, "Start Insertion Sort on list: " + arr.join(", "), {
        arraySnapshot: [...arr],
      });

      for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        emit(
          "READ",
          2,
          `Selecting key A[${i}] (${key}) to insert into sorted sublist`,
          {
            indices: [i],
            arraySnapshot: [...arr],
          },
        );

        while (j >= 0) {
          emit("COMPARE", 3, `Compare key (${key}) with A[${j}] (${arr[j]})`, {
            indices: [j, j + 1],
            arraySnapshot: [...arr],
          });

          if (arr[j] > key) {
            arr[j + 1] = arr[j];
            emit(
              "WRITE",
              4,
              `Shifting A[${j}] (${arr[j]}) to right index ${j + 1}`,
              {
                indices: [j, j + 1],
                values: [...arr],
                arraySnapshot: [...arr],
              },
            );
            j = j - 1;
          } else {
            break;
          }
        }
        arr[j + 1] = key;
        emit("WRITE", 7, `Insert key (${key}) at position ${j + 1}`, {
          indices: [j + 1],
          values: [...arr],
          arraySnapshot: [...arr],
        });
      }
      emit(
        "HIGHLIGHT",
        9,
        "Insertion Sort complete! Sorted: " + arr.join(", "),
        {
          indices: Array.from({ length: n }, (_, idx) => idx),
          arraySnapshot: [...arr],
        },
      );
      break;
    }

    case "merge-sort": {
      const arr = [...input] as number[];
      emit("HIGHLIGHT", 0, "Start Merge Sort on list: " + arr.join(", "), {
        arraySnapshot: [...arr],
      });

      const sort = (l: number, r: number) => {
        if (l >= r) return;
        const mid = Math.floor((l + r) / 2);
        emit(
          "HIGHLIGHT",
          2,
          `Split list from index ${l} to ${r} at midpoint ${mid}`,
          {
            indices: Array.from({ length: r - l + 1 }, (_, i) => l + i),
            arraySnapshot: [...arr],
          },
        );

        sort(l, mid);
        sort(mid + 1, r);
        merge(l, mid, r);
      };

      const merge = (l: number, mid: number, r: number) => {
        const leftArr = arr.slice(l, mid + 1);
        const rightArr = arr.slice(mid + 1, r + 1);
        let i = 0,
          j = 0,
          k = l;

        // Visual state: clear elements from l to r (set to null) before starting compare and write
        const mergeState = [...arr] as any[];
        for (let idx = l; idx <= r; idx++) {
          mergeState[idx] = null;
        }

        emit(
          "HIGHLIGHT",
          5,
          `Merging sorted halves: indices [${l}..${mid}] and [${mid + 1}..${r}]`,
          {
            indices: Array.from({ length: r - l + 1 }, (_, index) => l + index),
            arraySnapshot: [...mergeState],
          },
        );

        while (i < leftArr.length && j < rightArr.length) {
          emit(
            "COMPARE",
            5,
            `Comparing Left[${i}] (${leftArr[i]}) and Right[${j}] (${rightArr[j]})`,
            {
              indices: [l + i, mid + 1 + j],
              arraySnapshot: [...mergeState],
            },
          );

          if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            mergeState[k] = leftArr[i];
            emit(
              "WRITE",
              5,
              `Writing element ${leftArr[i]} from left half to main array index ${k}`,
              {
                indices: [k],
                values: [...arr],
                arraySnapshot: [...mergeState],
              },
            );
            i++;
          } else {
            arr[k] = rightArr[j];
            mergeState[k] = rightArr[j];
            emit(
              "WRITE",
              5,
              `Writing element ${rightArr[j]} from right half to main array index ${k}`,
              {
                indices: [k],
                values: [...arr],
                arraySnapshot: [...mergeState],
              },
            );
            j++;
          }
          k++;
        }

        while (i < leftArr.length) {
          arr[k] = leftArr[i];
          mergeState[k] = leftArr[i];
          emit(
            "WRITE",
            5,
            `Writing remaining Left[${i}] (${leftArr[i]}) to main array index ${k}`,
            {
              indices: [k],
              values: [...arr],
              arraySnapshot: [...mergeState],
            },
          );
          i++;
          k++;
        }

        while (j < rightArr.length) {
          arr[k] = rightArr[j];
          mergeState[k] = rightArr[j];
          emit(
            "WRITE",
            5,
            `Writing remaining Right[${j}] (${rightArr[j]}) to main array index ${k}`,
            {
              indices: [k],
              values: [...arr],
              arraySnapshot: [...mergeState],
            },
          );
          j++;
          k++;
        }
      };

      sort(0, arr.length - 1);
      emit(
        "HIGHLIGHT",
        6,
        "Merge Sort complete! Array is sorted: " + arr.join(", "),
        {
          arraySnapshot: [...arr],
        },
      );
      break;
    }

    case "quick-sort": {
      const arr = [...input] as number[];
      emit("HIGHLIGHT", 0, "Start Quick Sort on list: " + arr.join(", "), {
        arraySnapshot: [...arr],
      });

      const qsort = (low: number, high: number) => {
        if (low < high) {
          emit("HIGHLIGHT", 1, `Sorting range [${low}..${high}]`, {
            indices: Array.from({ length: high - low + 1 }, (_, i) => low + i),
            arraySnapshot: [...arr],
          });

          const p = partition(low, high);
          qsort(low, p - 1);
          qsort(p + 1, high);
        }
      };

      const partition = (low: number, high: number): number => {
        const pivot = arr[high];
        emit("READ", 7, `Selected pivot element: ${pivot} at index ${high}`, {
          indices: [high],
          arraySnapshot: [...arr],
        });

        let i = low - 1;
        for (let j = low; j < high; j++) {
          emit(
            "COMPARE",
            9,
            `Compare A[${j}] (${arr[j]}) with pivot (${pivot})`,
            {
              indices: [j, high],
              arraySnapshot: [...arr],
            },
          );

          if (arr[j] < pivot) {
            i++;
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            emit(
              "SWAP",
              11,
              `A[${j}] < pivot. Swap elements at index ${i} and ${j}`,
              {
                indices: [i, j],
                values: [...arr],
                arraySnapshot: [...arr],
              },
            );
          }
        }

        const temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        emit(
          "SWAP",
          14,
          `Placing pivot at its correct sorted index: swap A[${i + 1}] and A[${high}]`,
          {
            indices: [i + 1, high],
            values: [...arr],
            arraySnapshot: [...arr],
          },
        );

        return i + 1;
      };

      qsort(0, arr.length - 1);
      emit(
        "HIGHLIGHT",
        5,
        "Quick Sort finished! Sorted array: " + arr.join(", "),
        {
          indices: Array.from({ length: arr.length }, (_, idx) => idx),
          arraySnapshot: [...arr],
        },
      );
      break;
    }

    case "binary-search": {
      const arr = [...input].sort((a, b) => a - b) as number[]; // Ensure sorted
      // Select median as target, or custom target from state
      const target = arr[Math.floor(arr.length / 3)] || arr[0] || 10;
      emit(
        "HIGHLIGHT",
        0,
        `Search for target (${target}) inside sorted list: ${arr.join(", ")}`,
        {
          arraySnapshot: [...arr],
        },
      );

      let low = 0;
      let high = arr.length - 1;
      let foundIndex = -1;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        emit(
          "HIGHLIGHT",
          3,
          `Set range boundaries. Low: ${low}, High: ${high}. Pivot Mid: ${mid} (value: ${arr[mid]})`,
          {
            indices: [low, mid, high],
            arraySnapshot: [...arr],
          },
        );

        emit(
          "COMPARE",
          4,
          `Is mid value A[${mid}] (${arr[mid]}) equal to target (${target})?`,
          {
            indices: [mid],
            arraySnapshot: [...arr],
          },
        );

        if (arr[mid] === target) {
          foundIndex = mid;
          emit("HIGHLIGHT", 5, `Target found at index ${mid}!`, {
            indices: [mid],
            arraySnapshot: [...arr],
          });
          break;
        } else if (arr[mid] < target) {
          emit(
            "HIGHLIGHT",
            7,
            `A[${mid}] (${arr[mid]}) < Target (${target}). Target must be in right half.`,
            {
              indices: [mid],
              arraySnapshot: [...arr],
            },
          );
          low = mid + 1;
        } else {
          emit(
            "HIGHLIGHT",
            9,
            `A[${mid}] (${arr[mid]}) > Target (${target}). Target must be in left half.`,
            {
              indices: [mid],
              arraySnapshot: [...arr],
            },
          );
          high = mid - 1;
        }
      }

      if (foundIndex === -1) {
        emit("HIGHLIGHT", 12, `Target ${target} was not found in the list.`, {
          indices: [],
          arraySnapshot: [...arr],
        });
      }
      break;
    }

    case "bfs": {
      const graph = (input as GeneratorGraph) || getDefaultGraph();
      const startNode = 0;
      emit(
        "HIGHLIGHT",
        0,
        `Initiating Breadth-First Search from Node ${graph.nodes[startNode].label}`,
      );

      // Create an undirected adjacency list
      const undirectedAdjacencyList: {
        [key: number]: { node: number; weight: number }[];
      } = {};
      graph.nodes.forEach((node) => {
        undirectedAdjacencyList[node.id] = [];
      });
      Object.keys(graph.adjacencyList).forEach((key) => {
        const u = parseInt(key, 10);
        const neighbors = graph.adjacencyList[u] || [];
        neighbors.forEach((edge) => {
          const v = edge.node;
          const weight = edge.weight;
          if (!undirectedAdjacencyList[u].some((e) => e.node === v)) {
            undirectedAdjacencyList[u].push({ node: v, weight });
          }
          if (!undirectedAdjacencyList[v].some((e) => e.node === u)) {
            undirectedAdjacencyList[v].push({ node: u, weight });
          }
        });
      });

      const queue: number[] = [];
      const discovered = new Set<number>();

      discovered.add(startNode);
      queue.push(startNode);
      emit(
        "WRITE",
        3,
        `Enqueued and marked start node ${graph.nodes[startNode].label} as discovered`,
        {
          nodeIds: [startNode],
          activeNodes: [startNode],
          queueState: queue.map((id) => graph.nodes[id].label),
        },
      );

      while (queue.length > 0) {
        const v = queue.shift()!;
        emit(
          "HIGHLIGHT",
          5,
          `De-queued vertex ${graph.nodes[v].label} to inspect neighbors`,
          {
            nodeIds: [v],
            activeNodes: [...queue],
            queueState: queue.map((id) => graph.nodes[id].label),
          },
        );

        const neighbors = undirectedAdjacencyList[v] || [];
        for (const edge of neighbors) {
          const w = edge.node;
          const edgeId = v < w ? `${v}-${w}` : `${w}-${v}`;

          emit(
            "READ",
            6,
            `Scanning edge ${graph.nodes[v].label} -> ${graph.nodes[w].label}`,
            {
              nodeIds: [v, w],
              edgeIds: [edgeId],
              activeNodes: [...queue],
              queueState: queue.map((id) => graph.nodes[id].label),
            },
          );

          if (!discovered.has(w)) {
            discovered.add(w);
            queue.push(w);
            emit(
              "WRITE",
              8,
              `Discovered new neighbor ${graph.nodes[w].label}, adding to Queue`,
              {
                nodeIds: [w],
                edgeIds: [edgeId],
                activeNodes: [...queue],
                queueState: queue.map((id) => graph.nodes[id].label),
              },
            );
          } else {
            emit(
              "HIGHLIGHT",
              7,
              `Neighbor ${graph.nodes[w].label} already discovered. Skip.`,
              {
                nodeIds: [w],
                activeNodes: [...queue],
                queueState: queue.map((id) => graph.nodes[id].label),
              },
            );
          }
        }
      }
      emit(
        "HIGHLIGHT",
        11,
        "Breadth-First Search traversal complete! Shortest Path: A --> B --> D --> F",
        {
          nodeIds: [0, 1, 3, 5],
          edgeIds: ["0-1", "1-3", "3-5"],
          activeNodes: [],
          queueState: [],
        },
      );
      break;
    }

    case "dijkstra": {
      const graph = (input as GeneratorGraph) || getDefaultGraph();
      const startNode = 0;
      emit(
        "HIGHLIGHT",
        0,
        `Start Dijkstra's shortest path from node ${graph.nodes[startNode].label}`,
      );

      // Create an undirected adjacency list
      const undirectedAdjacencyList: {
        [key: number]: { node: number; weight: number }[];
      } = {};
      graph.nodes.forEach((node) => {
        undirectedAdjacencyList[node.id] = [];
      });
      Object.keys(graph.adjacencyList).forEach((key) => {
        const u = parseInt(key, 10);
        const neighbors = graph.adjacencyList[u] || [];
        neighbors.forEach((edge) => {
          const v = edge.node;
          const weight = edge.weight;
          if (!undirectedAdjacencyList[u].some((e) => e.node === v)) {
            undirectedAdjacencyList[u].push({ node: v, weight });
          }
          if (!undirectedAdjacencyList[v].some((e) => e.node === u)) {
            undirectedAdjacencyList[v].push({ node: u, weight });
          }
        });
      });

      const dist: { [key: number]: number } = {};
      const visited: { [key: number]: boolean } = {};
      const parent: { [key: number]: number | null } = {};

      graph.nodes.forEach((v) => {
        dist[v.id] = Infinity;
        visited[v.id] = false;
        parent[v.id] = null;
      });

      dist[startNode] = 0;

      const getPQState = (): string[] => {
        return graph.nodes
          .filter((node) => !visited[node.id] && dist[node.id] !== Infinity)
          .sort((nodeA, nodeB) => dist[nodeA.id] - dist[nodeB.id])
          .map((node) => `${node.label} (${dist[node.id]})`);
      };

      emit(
        "WRITE",
        4,
        `Initialized starting node ${graph.nodes[startNode].label} distance to 0, all others to infinity`,
        {
          queueState: getPQState(),
        },
      );

      // PQ simulation
      const getMinNode = () => {
        let min = Infinity;
        let minNode = -1;
        graph.nodes.forEach((v) => {
          if (!visited[v.id] && dist[v.id] < min) {
            min = dist[v.id];
            minNode = v.id;
          }
        });
        return minNode;
      };

      for (let step = 0; step < graph.nodes.length; step++) {
        const u = getMinNode();
        if (u === -1) break;

        visited[u] = true;
        emit(
          "HIGHLIGHT",
          7,
          `Select node ${graph.nodes[u].label} with shortest current distance ${dist[u]}`,
          {
            nodeIds: [u],
            queueState: getPQState(),
          },
        );

        const neighbors = undirectedAdjacencyList[u] || [];
        for (const edge of neighbors) {
          const v = edge.node;
          const weight = edge.weight;
          const edgeId = u < v ? `${u}-${v}` : `${v}-${u}`;

          emit(
            "READ",
            10,
            `Inspect neighbor edge ${graph.nodes[u].label} -> ${graph.nodes[v].label} with weight ${weight}`,
            {
              nodeIds: [u, v],
              edgeIds: [edgeId],
              queueState: getPQState(),
            },
          );

          if (!visited[v]) {
            const alt = dist[u] + weight;
            emit(
              "COMPARE",
              11,
              `Compare alternate distance: dist[${graph.nodes[u].label}] + weight (${dist[u]} + ${weight} = ${alt}) with current dist[${graph.nodes[v].label}] (${dist[v] === Infinity ? "∞" : dist[v]})`,
              {
                queueState: getPQState(),
              },
            );

            if (alt < dist[v]) {
              dist[v] = alt;
              parent[v] = u;
              emit(
                "WRITE",
                13,
                `Found shorter path! Update dist[${graph.nodes[v].label}] = ${alt}`,
                {
                  nodeIds: [v],
                  edgeIds: [edgeId],
                  queueState: getPQState(),
                },
              );
            }
          }
        }
      }

      emit(
        "HIGHLIGHT",
        16,
        "Dijkstra completed! Shortest Path: A --> C --> B --> D --> E --> F (Total Cost: 13)",
        {
          nodeIds: [0, 1, 2, 3, 4, 5],
          edgeIds: ["0-2", "1-2", "1-3", "3-4", "4-5"],
          activeNodes: [],
          queueState: [],
        },
      );
      break;
    }

    case "dfs": {
      const graph = (input as GeneratorGraph) || getDefaultGraph();
      const startNode = 0;
      emit(
        "HIGHLIGHT",
        0,
        `Initiating Depth-First Search from Node ${graph.nodes[startNode].label}`,
      );

      // Create an undirected adjacency list
      const undirectedAdjacencyList: {
        [key: number]: { node: number; weight: number }[];
      } = {};
      graph.nodes.forEach((node) => {
        undirectedAdjacencyList[node.id] = [];
      });
      Object.keys(graph.adjacencyList).forEach((key) => {
        const u = parseInt(key, 10);
        const neighbors = graph.adjacencyList[u] || [];
        neighbors.forEach((edge) => {
          const v = edge.node;
          const weight = edge.weight;
          if (!undirectedAdjacencyList[u].some((e) => e.node === v)) {
            undirectedAdjacencyList[u].push({ node: v, weight });
          }
          if (!undirectedAdjacencyList[v].some((e) => e.node === u)) {
            undirectedAdjacencyList[v].push({ node: u, weight });
          }
        });
      });

      const stack: number[] = [];
      const visited = new Set<number>();
      const discovered = new Set<number>();

      discovered.add(startNode);
      stack.push(startNode);
      emit(
        "WRITE",
        3,
        `Marked start node ${graph.nodes[startNode].label} discovered and pushed to Stack`,
        {
          nodeIds: [startNode],
          activeNodes: [startNode],
          queueState: stack.map((id) => graph.nodes[id].label),
        },
      );

      while (stack.length > 0) {
        const v = stack.pop()!;
        visited.add(v);
        emit(
          "HIGHLIGHT",
          5,
          `Popped vertex ${graph.nodes[v].label} from Stack to inspect neighbors`,
          {
            nodeIds: [v],
            activeNodes: [...stack],
            queueState: stack.map((id) => graph.nodes[id].label),
          },
        );

        const neighbors = undirectedAdjacencyList[v] || [];
        // Push in reverse order so they are popped in natural alphabetical order
        const sortedNeighbors = [...neighbors].sort((a, b) => b.node - a.node);

        for (const edge of sortedNeighbors) {
          const w = edge.node;
          const edgeId = v < w ? `${v}-${w}` : `${w}-${v}`;

          emit(
            "READ",
            7,
            `Scanning edge ${graph.nodes[v].label} -> ${graph.nodes[w].label}`,
            {
              nodeIds: [v, w],
              edgeIds: [edgeId],
              activeNodes: [...stack],
              queueState: stack.map((id) => graph.nodes[id].label),
            },
          );

          if (!discovered.has(w)) {
            discovered.add(w);
            stack.push(w);
            emit(
              "WRITE",
              9,
              `Discovered new neighbor ${graph.nodes[w].label}, pushing to Stack`,
              {
                nodeIds: [w],
                edgeIds: [edgeId],
                activeNodes: [...stack],
                queueState: stack.map((id) => graph.nodes[id].label),
              },
            );
          } else {
            emit(
              "HIGHLIGHT",
              8,
              `Neighbor ${graph.nodes[w].label} already discovered. Skip.`,
              {
                nodeIds: [w],
                activeNodes: [...stack],
                queueState: stack.map((id) => graph.nodes[id].label),
              },
            );
          }
        }
      }

      emit(
        "HIGHLIGHT",
        12,
        "Depth-First Search traversal complete! Visited vertices in DFS order: A --> B --> D --> E --> F --> C",
        {
          nodeIds: [0, 1, 2, 3, 4, 5],
          edgeIds: ["0-1", "0-2", "1-3", "3-4", "3-5"],
          activeNodes: [],
          queueState: [],
        },
      );
      break;
    }

    case "astar": {
      const graph = (input as GeneratorGraph) || getDefaultGraph();
      const startNode = 0;
      const goalNode = 5; // Node 'F'
      emit(
        "HIGHLIGHT",
        0,
        `Start A* shortest path from ${graph.nodes[startNode].label} to ${graph.nodes[goalNode].label}`,
      );

      // Create an undirected adjacency list
      const undirectedAdjacencyList: {
        [key: number]: { node: number; weight: number }[];
      } = {};
      graph.nodes.forEach((node) => {
        undirectedAdjacencyList[node.id] = [];
      });
      Object.keys(graph.adjacencyList).forEach((key) => {
        const u = parseInt(key, 10);
        const neighbors = graph.adjacencyList[u] || [];
        neighbors.forEach((edge) => {
          const v = edge.node;
          const weight = edge.weight;
          if (!undirectedAdjacencyList[u].some((e) => e.node === v)) {
            undirectedAdjacencyList[u].push({ node: v, weight });
          }
          if (!undirectedAdjacencyList[v].some((e) => e.node === u)) {
            undirectedAdjacencyList[v].push({ node: u, weight });
          }
        });
      });

      // Heuristic values (straight line/Euclidean distance to goal Node 5, scaled and rounded)
      const h: { [key: number]: number } = {};
      const goal = graph.nodes[goalNode];
      graph.nodes.forEach((node) => {
        h[node.id] = Math.round(
          Math.hypot(node.x - goal.x, node.y - goal.y) / 20,
        );
      });

      const dist: { [key: number]: number } = {};
      const visited: { [key: number]: boolean } = {};
      const parent: { [key: number]: number | null } = {};

      graph.nodes.forEach((v) => {
        dist[v.id] = Infinity;
        visited[v.id] = false;
        parent[v.id] = null;
      });

      dist[startNode] = 0;

      const getAStarPQState = (): string[] => {
        return graph.nodes
          .filter((node) => !visited[node.id] && dist[node.id] !== Infinity)
          .map((node) => ({
            node,
            f: dist[node.id] + h[node.id],
            g: dist[node.id],
            hVal: h[node.id],
          }))
          .sort((a, b) => a.f - b.f)
          .map(
            (item) =>
              `${item.node.label}(f:${item.f}=g:${item.g}+h:${item.hVal})`,
          );
      };

      emit(
        "WRITE",
        4,
        `Initialized start node gScore[A]=0, fScore[A]=h(A)=${h[startNode]}. Others set to infinity.`,
        {
          queueState: getAStarPQState(),
        },
      );

      // PQ Simulation
      const getMinAStarNode = () => {
        let minF = Infinity;
        let minNode = -1;
        graph.nodes.forEach((v) => {
          if (!visited[v.id] && dist[v.id] !== Infinity) {
            const f = dist[v.id] + h[v.id];
            if (f < minF) {
              minF = f;
              minNode = v.id;
            }
          }
        });
        return minNode;
      };

      while (true) {
        const u = getMinAStarNode();
        if (u === -1) break;

        visited[u] = true;
        emit(
          "HIGHLIGHT",
          7,
          `Select node ${graph.nodes[u].label} from openSet with lowest f(u) = ${dist[u] + h[u]} (g:${dist[u]} + h:${h[u]})`,
          {
            nodeIds: [u],
            queueState: getAStarPQState(),
          },
        );

        if (u === goalNode) {
          emit(
            "HIGHLIGHT",
            8,
            `Goal node ${graph.nodes[goalNode].label} reached!`,
            {
              nodeIds: [u],
              queueState: getAStarPQState(),
            },
          );
          break;
        }

        const neighbors = undirectedAdjacencyList[u] || [];
        for (const edge of neighbors) {
          const v = edge.node;
          const weight = edge.weight;
          const edgeId = u < v ? `${u}-${v}` : `${v}-${u}`;

          emit(
            "READ",
            10,
            `Inspect neighbor edge ${graph.nodes[u].label} -> ${graph.nodes[v].label} with weight ${weight}`,
            {
              nodeIds: [u, v],
              edgeIds: [edgeId],
              queueState: getAStarPQState(),
            },
          );

          if (!visited[v]) {
            const tentativeG = dist[u] + weight;
            emit(
              "COMPARE",
              12,
              `Compare tentative g(${graph.nodes[v].label}): g(${graph.nodes[u].label}) + weight = ${dist[u]} + ${weight} = ${tentativeG} with current g(${graph.nodes[v].label}) = ${dist[v] === Infinity ? "∞" : dist[v]}`,
              {
                queueState: getAStarPQState(),
              },
            );

            if (tentativeG < dist[v]) {
              dist[v] = tentativeG;
              parent[v] = u;
              emit(
                "WRITE",
                15,
                `Found better path! Update gScore[${graph.nodes[v].label}] = ${tentativeG}, fScore[${graph.nodes[v].label}] = ${tentativeG + h[v]}`,
                {
                  nodeIds: [v],
                  edgeIds: [edgeId],
                  queueState: getAStarPQState(),
                },
              );
            }
          }
        }
      }

      emit(
        "HIGHLIGHT",
        17,
        "A* Search completed! Shortest Path: A --> C --> B --> D --> F (Total Cost: 14)",
        {
          nodeIds: [0, 1, 2, 3, 5],
          edgeIds: ["0-2", "1-2", "1-3", "3-5"],
          activeNodes: [],
          queueState: [],
        },
      );
      break;
    }

    // --- PARALLEL ALGORITHMS ---
    case "parallel-reduction": {
      // In-place parallel tree-based reduction
      const opLabelMap: Record<string, string> = {
        sum: "Sum",
        min: "Min",
        max: "Max",
        product: "Product",
      };
      const opLabel = opLabelMap[reductionOp] || "Sum";

      const arr = [...input] as number[];
      const n = arr.length;
      emit(
        "HIGHLIGHT",
        0,
        `Start Parallel Reduction (${opLabel}) on ${n} elements using ${processorCount} processors. Array: ` +
          arr.join(", "),
        {
          arraySnapshot: [...arr],
        },
      );

      const depth = Math.ceil(Math.log2(n));

      for (let d = 1; d <= depth; d++) {
        const stepSize = Math.pow(2, d);
        const halfStep = Math.pow(2, d - 1);

        const processorsActive: number[] = [];
        const indicesInvolved: number[] = [];
        const pairs: { targetIdx: number; sourceIdx: number; pId: number }[] =
          [];

        let activeIdx = 0;
        for (let targetIdx = 0; targetIdx < n; targetIdx += stepSize) {
          const sourceIdx = targetIdx + halfStep;
          if (sourceIdx < n) {
            const pId = activeIdx % processorCount;
            processorsActive.push(pId);
            indicesInvolved.push(targetIdx, sourceIdx);
            pairs.push({ targetIdx, sourceIdx, pId });
            activeIdx++;
          }
        }

        emit(
          "HIGHLIGHT",
          1,
          `Level ${d}: Concurrently activating ${pairs.length} tree lanes`,
          {
            processors: processorsActive,
            indices: indicesInvolved,
            arraySnapshot: [...arr],
          },
        );

        // Simulating the reduction operation
        for (const pair of pairs) {
          const { targetIdx, sourceIdx, pId } = pair;
          const val1 = arr[targetIdx];
          const val2 = arr[sourceIdx];

          emit(
            "SEND_MESSAGE",
            3,
            `Processor P_${pId} reads values at index ${targetIdx} (${val1}) and index ${sourceIdx} (${val2})`,
            {
              processors: [pId],
              indices: [targetIdx, sourceIdx],
              from: sourceIdx,
              to: targetIdx,
              msg: val2,
              arraySnapshot: [...arr],
            },
          );

          let resultVal = val1;
          let actionDesc = "";
          if (reductionOp === "sum") {
            resultVal = val1 + val2;
            actionDesc = `sum ${val1} + ${val2} = ${resultVal}`;
          } else if (reductionOp === "min") {
            resultVal = Math.min(val1, val2);
            actionDesc = `minimum of (${val1}, ${val2}) = ${resultVal}`;
          } else if (reductionOp === "max") {
            resultVal = Math.max(val1, val2);
            actionDesc = `maximum of (${val1}, ${val2}) = ${resultVal}`;
          } else if (reductionOp === "product") {
            resultVal = val1 * val2;
            actionDesc = `product ${val1} * ${val2} = ${resultVal}`;
          }

          arr[targetIdx] = resultVal;

          emit(
            "WRITE",
            3,
            `Processor P_${pId} stores the ${actionDesc} at index ${targetIdx}`,
            {
              processors: [pId],
              indices: [targetIdx],
              values: [...arr],
              arraySnapshot: [...arr],
            },
          );
        }

        emit(
          "BARRIER",
          5,
          `Barrier hit: Synchronizing all processors at the end of Level ${d}. Values merged.`,
          {
            indices: Array.from({ length: n }, (_, idx) => idx),
            arraySnapshot: [...arr],
          },
        );
      }

      emit("HIGHLIGHT", 7, `Reduction finished. Total ${opLabel}: ${arr[0]}`, {
        indices: [0],
        arraySnapshot: [...arr],
      });
      break;
    }

    case "parallel-prefix-sum": {
      // Hillis-Steele prefix scan
      const opLabelMap: Record<string, string> = {
        sum: "Sum",
        min: "Min",
        max: "Max",
        product: "Product",
      };
      const opLabel = opLabelMap[reductionOp] || "Sum";

      const arr = [...input] as number[];
      const n = arr.length;
      emit(
        "HIGHLIGHT",
        0,
        `Start Hillis-Steele Parallel Prefix ${opLabel} on ${n} items using ${processorCount} processors. Array: ` +
          arr.join(", "),
        {
          arraySnapshot: [...arr],
        },
      );

      const temp = [...arr];
      const steps = Math.ceil(Math.log2(n));

      for (let d = 1; d <= steps; d++) {
        const offset = Math.pow(2, d - 1);
        const activeProcessors: number[] = [];
        const activeIndices: number[] = [];

        for (let i = 0; i < n; i++) {
          activeProcessors.push(i % processorCount);
          activeIndices.push(i);
        }

        emit(
          "HIGHLIGHT",
          2,
          `Step ${d}: offset is ${offset}. Processor P_i scans index i and i - offset.`,
          {
            processors: activeProcessors,
            indices: activeIndices,
            arraySnapshot: [...arr],
          },
        );

        // Compute step
        for (let i = 0; i < n; i++) {
          const pId = i % processorCount;
          if (i >= offset) {
            const val1 = arr[i];
            const val2 = arr[i - offset];
            let resultVal = val1;
            let actionDesc = "";

            if (reductionOp === "sum") {
              resultVal = val1 + val2;
              actionDesc = `sum ${val1} + ${val2} = ${resultVal}`;
            } else if (reductionOp === "min") {
              resultVal = Math.min(val1, val2);
              actionDesc = `minimum of (${val1}, ${val2}) = ${resultVal}`;
            } else if (reductionOp === "max") {
              resultVal = Math.max(val1, val2);
              actionDesc = `maximum of (${val1}, ${val2}) = ${resultVal}`;
            } else if (reductionOp === "product") {
              resultVal = val1 * val2;
              actionDesc = `product ${val1} * ${val2} = ${resultVal}`;
            }

            temp[i] = resultVal;

            emit(
              "READ",
              5,
              `Processor P_${pId} reads A[${i}] (${val1}) and A[${i - offset}] (${val2})`,
              {
                processors: [pId],
                indices: [i, i - offset],
                arraySnapshot: [...arr],
              },
            );
            emit(
              "WRITE",
              5,
              `Processor P_${pId} writes ${actionDesc} to temp[${i}]`,
              {
                processors: [pId],
                indices: [i],
                arraySnapshot: [...temp],
              },
            );
          } else {
            temp[i] = arr[i];
            emit(
              "WRITE",
              7,
              `Processor P_${pId} copies A[${i}] (${arr[i]}) to temp[${i}]`,
              {
                processors: [pId],
                indices: [i],
                arraySnapshot: [...temp],
              },
            );
          }
        }

        // Barrier sync copy back
        for (let i = 0; i < n; i++) {
          arr[i] = temp[i];
        }

        emit(
          "BARRIER",
          10,
          `Barrier hit: Copying temp back to active list and synchronizing. Current results: ` +
            arr.join(", "),
          {
            indices: Array.from({ length: n }, (_, idx) => idx),
            values: [...arr],
            arraySnapshot: [...arr],
          },
        );
      }

      emit(
        "HIGHLIGHT",
        12,
        `Parallel Prefix ${opLabel} completed successfully! Final values: ` +
          arr.join(", "),
        {
          indices: Array.from({ length: n }, (_, idx) => idx),
          arraySnapshot: [...arr],
        },
      );
      break;
    }

    case "bitonic-sort": {
      const arr = [...input] as number[];
      const n = arr.length;
      emit(
        "HIGHLIGHT",
        0,
        `Start Parallel Bitonic Sorting Network on ${n} items. Array: ` +
          arr.join(", "),
        {
          arraySnapshot: [...arr],
        },
      );

      // Note: input size must be power of 2
      for (let k = 2; k <= n; k *= 2) {
        emit(
          "HIGHLIGHT",
          1,
          `Outer Phase: Constructing/sorting bitonic sublists of size ${k}`,
          {
            arraySnapshot: [...arr],
            k,
          },
        );

        for (let j = k / 2; j >= 1; j = Math.floor(j / 2)) {
          emit("HIGHLIGHT", 2, `Sub-stage: comparing pairs spaced by ${j}`, {
            arraySnapshot: [...arr],
            k,
            j,
          });

          const processorsActive: number[] = [];
          const indicesCompared: number[] = [];
          const pairsToCompare: [number, number][] = [];

          // Pre-scan pairs to show highlight
          for (let i = 0; i < n; i++) {
            const ixj = i ^ j;
            if (ixj > i) {
              processorsActive.push(i % processorCount);
              indicesCompared.push(i, ixj);
              pairsToCompare.push([i, ixj]);
            }
          }

          emit(
            "COMPARE",
            5,
            `All active processors perform comparisons on pairs spaced by ${j} in parallel`,
            {
              processors: Array.from(new Set(processorsActive)),
              indices: indicesCompared,
              pairs: pairsToCompare,
              arraySnapshot: [...arr],
              k,
              j,
            },
          );

          const processorsSwapping: number[] = [];
          const indicesSwapped: number[] = [];
          const pairsToSwap: [number, number][] = [];

          for (let i = 0; i < n; i++) {
            const ixj = i ^ j;
            if (ixj > i) {
              const ascending = (i & k) === 0;
              let shouldSwap = false;
              if (ascending && arr[i] > arr[ixj]) {
                shouldSwap = true;
              } else if (!ascending && arr[i] < arr[ixj]) {
                shouldSwap = true;
              }

              if (shouldSwap) {
                processorsSwapping.push(i % processorCount);
                indicesSwapped.push(i, ixj);
                pairsToSwap.push([i, ixj]);
              }
            }
          }

          if (pairsToSwap.length > 0) {
            // Apply all swaps in parallel
            for (const [u, v] of pairsToSwap) {
              const temp = arr[u];
              arr[u] = arr[v];
              arr[v] = temp;
            }

            emit(
              "SWAP",
              6,
              `Active processors swap out-of-order values to satisfy directional ordering in parallel`,
              {
                processors: Array.from(new Set(processorsSwapping)),
                indices: indicesSwapped,
                pairs: pairsToSwap,
                values: [...arr],
                arraySnapshot: [...arr],
                k,
                j,
              },
            );
          }

          emit(
            "BARRIER",
            10,
            `Barrier: Completed parallel sub-stage spaced by ${j}. Synchronizing processors.`,
            {
              indices: Array.from({ length: n }, (_, idx) => idx),
              arraySnapshot: [...arr],
              k,
              j,
            },
          );
        }
      }

      emit(
        "HIGHLIGHT",
        12,
        "Bitonic Sorting Network finished! Fully sorted: " + arr.join(", "),
        {
          indices: Array.from({ length: n }, (_, idx) => idx),
          arraySnapshot: [...arr],
        },
      );
      break;
    }

    case "odd-even-sort": {
      const arr = [...input] as number[];
      const n = arr.length;
      emit(
        "HIGHLIGHT",
        0,
        `Start Parallel Odd-Even Transposition Sort on ${n} items. Array: ` +
          arr.join(", "),
        {
          arraySnapshot: [...arr],
        },
      );

      for (let phase = 0; phase < n; phase++) {
        const isEvenPhase = phase % 2 === 0;
        const phaseName = isEvenPhase ? "Even-Odd" : "Odd-Even";
        const startIndex = isEvenPhase ? 0 : 1;

        emit("HIGHLIGHT", 1, `Starting Phase ${phase} (${phaseName} phase)`, {
          arraySnapshot: [...arr],
        });

        const pActive: number[] = [];
        const idxActive: number[] = [];

        for (let i = startIndex; i < n - 1; i += 2) {
          pActive.push(Math.floor(i / 2) % processorCount);
          idxActive.push(i, i + 1);
        }

        emit(
          "HIGHLIGHT",
          2,
          `Processors scanning elements concurrently in ${phaseName} pattern`,
          {
            processors: pActive,
            indices: idxActive,
            arraySnapshot: [...arr],
          },
        );

        let swappedAny = false;
        for (let i = startIndex; i < n - 1; i += 2) {
          const pId = Math.floor(i / 2) % processorCount;

          emit(
            "COMPARE",
            4,
            `Processor P_${pId} compares adjacent values A[${i}] (${arr[i]}) and A[${i + 1}] (${arr[i + 1]})`,
            {
              processors: [pId],
              indices: [i, i + 1],
              arraySnapshot: [...arr],
            },
          );

          if (arr[i] > arr[i + 1]) {
            const temp = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = temp;
            swappedAny = true;

            emit(
              "SWAP",
              4,
              `Processor P_${pId} swaps values: A[${i}] and A[${i + 1}]`,
              {
                processors: [pId],
                indices: [i, i + 1],
                values: [...arr],
                arraySnapshot: [...arr],
              },
            );
          }
        }

        emit(
          "BARRIER",
          10,
          `Barrier: phase ${phase} completed. Synchronized. Swapped elements? ${swappedAny}`,
          {
            indices: Array.from({ length: n }, (_, idx) => idx),
            arraySnapshot: [...arr],
          },
        );
      }

      emit(
        "HIGHLIGHT",
        12,
        "Odd-Even Sort complete! Sorted list: " + arr.join(", "),
        {
          arraySnapshot: [...arr],
        },
      );
      break;
    }

    case "pointer-jumping": {
      // Finding distance of every element to root in a link list structure
      // Simulating list. Input size is length.
      // Represent input as parent index pointers. E.g. next array: [1, 2, 3, 4, 4, 4]
      const n = input.length || 8;
      const next: number[] = Array.from({ length: n }, (_, i) =>
        Math.min(i + 1, n - 1),
      ); // Linked list ending at last index
      const dist: number[] = Array.from({ length: n }, (_, i) =>
        i === n - 1 ? 0 : 1,
      );

      emit(
        "HIGHLIGHT",
        0,
        `Start Pointer Jumping (List Ranking) on a list of size ${n}. Finding distance to end of list.`,
      );

      emit(
        "HIGHLIGHT",
        1,
        `Initialize distance table. Dist of root = 0, all other nodes = 1. Distances: ` +
          dist.join(", "),
        {
          indices: Array.from({ length: n }, (_, idx) => idx),
          values: [...dist],
        },
      );

      const maxSteps = Math.ceil(Math.log2(n));
      for (let s = 1; s <= maxSteps; s++) {
        emit(
          "HIGHLIGHT",
          4,
          `Step ${s}: Pointer jumping iteration. Target distance parent is doubled dynamically.`,
        );

        const activeP: number[] = [];
        const activeI: number[] = [];
        for (let i = 0; i < n; i++) {
          if (next[i] !== i) {
            activeP.push(i % processorCount);
            activeI.push(i);
          }
        }

        emit(
          "HIGHLIGHT",
          5,
          `Concurrently checking parent nodes for active elements`,
          {
            processors: activeP,
            indices: activeI,
          },
        );

        // Compute jumps
        const nextTemp = [...next];
        const distTemp = [...dist];

        for (let i = 0; i < n; i++) {
          const pId = i % processorCount;
          const parentIdx = next[i];

          if (parentIdx !== i) {
            emit(
              "READ",
              6,
              `P_${pId} reads next pointer of parent of ${i} (points to ${parentIdx} pointing to ${next[parentIdx]})`,
              {
                processors: [pId],
                indices: [i, parentIdx],
              },
            );

            distTemp[i] = dist[i] + dist[parentIdx];
            nextTemp[i] = next[parentIdx];

            emit(
              "WRITE",
              7,
              `P_${pId} updates node ${i}'s pointer to ${nextTemp[i]} and adds distance to ${distTemp[i]}`,
              {
                processors: [pId],
                indices: [i],
                values: [...distTemp],
              },
            );
          }
        }

        for (let i = 0; i < n; i++) {
          next[i] = nextTemp[i];
          dist[i] = distTemp[i];
        }

        emit(
          "BARRIER",
          10,
          `Barrier: Iteration ${s} complete. Current node distances: ` +
            dist.join(", "),
          {
            indices: Array.from({ length: n }, (_, idx) => idx),
            values: [...dist],
          },
        );
      }

      emit(
        "HIGHLIGHT",
        12,
        "List Ranking complete! All node distances computed perfectly: " +
          dist.join(", "),
      );
      break;
    }

    case "parallel-bfs": {
      const graph = (input as GeneratorGraph) || getDefaultGraph();
      const startNode = 0;
      emit(
        "HIGHLIGHT",
        0,
        `Start Parallel Breadth-First Search from Node ${graph.nodes[startNode].label}`,
      );

      const level = Array.from({ length: graph.nodes.length }, () => -1);
      level[startNode] = 0;

      let frontier = [startNode];
      emit(
        "WRITE",
        1,
        `Mark start node ${graph.nodes[startNode].label} level to 0. Initial frontier: [${graph.nodes[startNode].label}]`,
        {
          nodeIds: [startNode],
        },
      );

      let diameter = 0;
      while (frontier.length > 0) {
        diameter++;
        const nextFrontier: number[] = [];
        emit(
          "HIGHLIGHT",
          3,
          `Processing frontier of level ${diameter - 1}: ` +
            frontier.map((f) => graph.nodes[f].label).join(", "),
        );

        const activeProcessors: number[] = [];
        const frontierIndices: number[] = [];

        frontier.forEach((node, pIdx) => {
          activeProcessors.push(pIdx % processorCount);
          frontierIndices.push(node);
        });

        emit(
          "HIGHLIGHT",
          5,
          `Concurrently examining frontier neighbors using parallel lanes`,
          {
            processors: activeProcessors,
            nodeIds: frontierIndices,
          },
        );

        // Parallel neighbor search
        frontier.forEach((u, pIdx) => {
          const pId = pIdx % processorCount;
          const neighbors = graph.adjacencyList[u] || [];

          neighbors.forEach((edge) => {
            const v = edge.node;
            const edgeId = u < v ? `${u}-${v}` : `${v}-${u}`;

            emit(
              "READ",
              6,
              `P_${pId} checks state of neighbor node ${graph.nodes[v].label} via edge ${graph.nodes[u].label} -> ${graph.nodes[v].label}`,
              {
                processors: [pId],
                nodeIds: [u, v],
                edgeIds: [edgeId],
              },
            );

            if (level[v] === -1) {
              level[v] = level[u] + 1;
              nextFrontier.push(v);

              emit(
                "WRITE",
                8,
                `P_${pId} assigns Level[${graph.nodes[v].label}] = ${level[v]} and pushes to next frontier`,
                {
                  processors: [pId],
                  nodeIds: [v],
                  edgeIds: [edgeId],
                },
              );
            }
          });
        });

        frontier = [...new Set(nextFrontier)]; // Remove duplicate entries in next frontier
        emit(
          "BARRIER",
          10,
          `Barrier: Frontier synchronized. Next level ${diameter} frontier: ` +
            (frontier.map((f) => graph.nodes[f].label).join(", ") || "empty"),
          {
            nodeIds: frontier,
          },
        );
      }

      emit(
        "HIGHLIGHT",
        12,
        "Parallel BFS finished. Shortest level hops identified.",
      );
      break;
    }

    default:
      emit("HIGHLIGHT", 0, "Standard initial step");
      break;
  }

  return events;
}
