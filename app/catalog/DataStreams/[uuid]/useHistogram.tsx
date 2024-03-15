import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

export type Listener = (args: { data: { data: unknown, type: string, message?: string}}) => void;

// In-memory log truncation
const LIMIT = 10;

// Actual handler
const onMessageHandler = (
    setValue: Dispatch<SetStateAction<string[]>>
) => ({data}: {data: string}) => {
    setValue((prev: string[]) => [...prev.slice(0, LIMIT-1), data]);
}

/**
 * Lifecycle controller for web workers. You need to actually start
 * the worker with the source code loaded externally.
 * 
 * Webpack needs a static path at build time to make loadable chunks
 * from the worker script.
 * 
 * There is probably a more clever way to do this.
 */
const useWorker = (createWorker: () => Worker) => {

    const listening = useRef<boolean>(false);
    const worker = useRef<Worker>(createWorker());
    const [, setMessages] = useState<string[]>([]);
    const listener = onMessageHandler(setMessages);

    // Init and start only once
    const start = () => {
        worker.current?.addEventListener("message", listener, { passive: true });
        listening.current = true
        worker.current?.postMessage({ type: "status" });
    }

    // Remove listener and kill worker.
    const terminate = () => {
        if (!worker.current) return;
        if (listening.current) worker.current.removeEventListener("message", listener);
        worker.current.terminate();
    }

    // Add external event listener.
    const listen = (callback: Listener) => {
        worker.current?.addEventListener("message", callback, { passive: true });
        return () => {
            worker.current?.removeEventListener("message", callback);
        };
    }

    // Shorthand to send a message, or silently fail
    const post = (message: {type: string, data: any}) => {
        worker.current?.postMessage(message);
    }

    // Start if we get a worker on load.
    useEffect(() => {
        start();
        return terminate;
    }, [])

    return {
        ref: worker,
        terminate,
        listen,
        post
    }
}


export type HistogramData = [number, number][];
export interface IHistogram {
  data: HistogramData;
  caption: string;
  foreground: string;
}
/**
 * Data structure passed back from the worker
 */
export interface HistogramResult {
  /**
   * Total number of observations.
   */
  total: number;
  /**
   * Maximum value of observations. Used to set
   * the height of visualization canvas axis.
   */
  max: number;
}
/**
 * Known worker messages on this side of the fence.
 */
const MESSAGES = {
  status: "status",
  error: "error",
  reduce: "reduce",
};
/**
 * This has to be defined in global scope to force Webpack to bundle the script.
 */
const createWorker = () =>
  new Worker(new URL("./Histogram.worker.ts", import.meta.url), {
    type: "module",
  });

/**
 * The bin size is known, since the bins are precalculated.
 */
const COUNT = 100;
/**
 * Bin size from bin count.
 */
const Δw = 1.0 / COUNT;

/**
 * Calculate and draw a histogram from count data
 * where 0.0 < x < 1.0.
 */
export const useHistogram = ({
  data,
  caption,
  foreground,
}: IHistogram) => {
  /**
   * Handle to assign to canvas element instance
   */
  const ref = useRef<HTMLCanvasElement | null>(null);
  /**
   * Background worker for number crunching
   */
  const worker = useWorker(createWorker);
  /**
   * Message displayed with the histogram
   */
  const [message, setMessage] = useState("Calculating...");
  /**
   * Summary stats include max and total. Set asynchonously by
   * result of web worker calculation.
   */
  const [statistics, setStatistics] = useState<HistogramResult>({
    total: 0,
    max: 0,
  });
  /**
   * Once total number of observations is known,
   * set the display message giving metadata
   */
  useEffect(() => {
    if (statistics) setMessage(`${caption} (N=${statistics.total})`);
  }, [statistics]);
  /**
   * Use background worker to calculate summary statistics.
   *
   * Return a callback to gracefully kill the worker when the component
   * unmounts.
   */
  useEffect(() => {
    worker.post({
      type: MESSAGES.reduce,
      data,
    });
  }, []);
  /**
   * Start listening to worker messages.
   */
  useEffect(() => {
    return worker.listen(({ data }) => {
      switch (data.type) {
        case MESSAGES.status:
          console.log(data.type, data.data);
          return;
        case MESSAGES.reduce:
          console.log(data.type, data.data);
          setStatistics(data.data as HistogramResult);
          setMessage(`${caption} (N=${statistics.total})`);
          return;
        case MESSAGES.error:
          console.error(data.message, data.type, data.data);
          return;
        default:
          console.warn(data.type, data.data);
          return;
      }
    });
  }, []);
  /*
   * Draw histogram peaks to the 2D canvas when it loads.
   */
  useEffect(() => {
    if (!statistics || !ref.current) return;
    const canvas: HTMLCanvasElement = ref.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw TypeError("Canvas Context is Null");
    }
    ctx.fillStyle = foreground;
    data.forEach(([x, n]: [number, number]) => {
      ctx.fillRect(
        canvas.width * (x - Δw),
        canvas.height,
        canvas.width * Δw,
        (canvas.height * -n) / statistics.max
      );
    });
  }, [statistics]);
  /**
   * Exposes summary data, canvas ref, and a data-driven
   * status message.
   */
  return { statistics, ref, message };
};
/**
 * Enable default import of the top level hook
 */
export default useHistogram;