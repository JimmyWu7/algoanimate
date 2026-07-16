import { useState, useEffect, useRef, useCallback } from "react";
import { SimulationEvent, AlgorithmId, RuntimeStats } from "@/types/algorithms";
import { generateEvents } from "@/algorithms/generators";
import { ALGORITHM_REGISTRY } from "@/lib/algorithm-registry";

export function useSimulation(
  algorithmId: AlgorithmId,
  initialInputSize?: number,
  initialProcessorCount?: number,
) {
  const metadata = ALGORITHM_REGISTRY.find((a) => a.id === algorithmId)!;

  const [inputSize, setInputSize] = useState(
    initialInputSize || metadata.defaultInputSize,
  );
  const [processorCount, setProcessorCount] = useState(
    initialProcessorCount || metadata.defaultProcessorCount || 4,
  );
  const [speed, setSpeed] = useState(50); // slider 1-100, maps to 1000ms down to 100ms
  const [inputData, setInputData] = useState<any>(null);
  const [events, setEvents] = useState<SimulationEvent[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate default input data based on type and size
  const generateNewInput = useCallback((size: number, id: AlgorithmId) => {
    const alg = ALGORITHM_REGISTRY.find((a) => a.id === id);
    if (alg?.category === "Graphs") {
      // Return null to use default static graph in generators
      return null;
    }
    if (id === "pointer-jumping") {
      // return a list array of size
      return Array.from({ length: size }, (_, i) => i);
    }
    // Default array
    const arr = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 90) + 10,
    );
    return arr;
  }, []);

  // Initialize input data
  useEffect(() => {
    const timer = setTimeout(() => {
      const newInput = generateNewInput(inputSize, algorithmId);
      setInputData(newInput);
      setIsPlaying(false);
      setCurrentStep(0);
    }, 0);
    return () => clearTimeout(timer);
  }, [algorithmId, inputSize, generateNewInput]);

  // Generate events whenever inputData or processorCount changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const data = inputData || generateNewInput(inputSize, algorithmId);
      const evs = generateEvents(algorithmId, data, processorCount);
      setEvents(evs);
      setCurrentStep(0);
      setIsPlaying(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [algorithmId, inputData, processorCount, inputSize, generateNewInput]);

  // Map slider speed to millisecond delay (higher speed = shorter delay)
  const getDelay = useCallback(() => {
    return Math.max(100, 1100 - speed * 10);
  }, [speed]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Step operations
  const stepForward = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < events.length - 1) {
        return prev + 1;
      } else {
        setIsPlaying(false);
        return prev;
      }
    });
  }, [events]);

  const stepBackward = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const jumpToStep = useCallback(
    (step: number) => {
      setCurrentStep(Math.max(0, Math.min(events.length - 1, step)));
    },
    [events],
  );

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  // Play/Pause toggler
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Handling auto-play timer
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isPlaying && events.length > 0) {
      const delay = getDelay();
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < events.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return prev;
          }
        });
      }, delay);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, events, getDelay]);

  // Function to trigger a new random input array/graph
  const randomizeInput = useCallback(() => {
    const newInput = generateNewInput(inputSize, algorithmId);
    setInputData(newInput);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [algorithmId, inputSize, generateNewInput]);

  // Custom input loader
  const uploadInput = useCallback((customData: any) => {
    setInputData(customData);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  // Compute live cumulative statistics based on actions up to currentStep
  const stats: RuntimeStats = (() => {
    let comps = 0;
    let reads = 0;
    let writes = 0;
    let swaps = 0;
    let commCost = 0;

    // Up to current step
    for (let i = 0; i <= currentStep && i < events.length; i++) {
      const ev = events[i];
      if (ev.type === "COMPARE") comps++;
      if (ev.type === "READ") reads++;
      if (ev.type === "WRITE") writes++;
      if (ev.type === "SWAP") swaps++;
      if (ev.type === "SEND_MESSAGE") commCost += 1;
    }

    // Determine current active processors
    const currEvent = events[currentStep];
    const activeProcs = currEvent?.processors?.length || 0;
    const isParallel = metadata.type === "parallel";

    // Work & Span calculations
    // Sequential Work = comps + swaps + reads + writes
    // Parallel Work = total operations across all lanes
    const totalOps = comps + swaps + reads + writes;
    const work = totalOps || 5; // offset default so it doesn't show 0

    // Span estimation: log tree depth or barriered sequence count
    let span = totalOps;
    if (isParallel) {
      // Span is significantly smaller for parallel. Let's estimate it based on steps log2
      const stepEventsCount = events.length;
      const stepFactor = currentStep / (stepEventsCount || 1);
      const targetSpanMax = Math.ceil(Math.log2(inputSize) * 3) + 1;
      span = Math.max(2, Math.ceil(targetSpanMax * stepFactor));
    }

    const speedup = isParallel ? parseFloat((work / span).toFixed(2)) : 1;
    const efficiency = isParallel
      ? parseFloat((speedup / processorCount).toFixed(2))
      : 1;

    return {
      comparisons: comps,
      reads,
      writes,
      swaps,
      activeProcessorsCount: isParallel ? activeProcs : currEvent ? 1 : 0,
      idleProcessorsCount: isParallel
        ? Math.max(0, processorCount - activeProcs)
        : 0,
      communicationCost: commCost,
      work,
      span,
      speedup: Math.min(processorCount, speedup), // capping at processorCount
      efficiency: Math.min(1.0, efficiency),
    };
  })();

  return {
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
  };
}
