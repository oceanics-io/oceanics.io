/**
 * React friends.
 */
import { useEffect, useRef, useState } from "react";

/**
 * Consistent styling.
 */
import { ghost } from "../palette";

/**
 * Dedicated worker loader.
 */
import useWasmWorkers from "./useWasmWorkers";

/**
 * The bin size is known, since the bins are precalculated.
 */
const COUNT = 100;

/**
 * Bin size from bin count.
 */
const Δw = 1.0/COUNT;

/**
 * Calculate and draw a histogram from count data 
 * where 0.0 < x < 1.0.
 */
export default ({
    histogram, 
    caption,
    foreground = ghost
}) => {

    /**
     * Handle to assign to canvas element instance
     */
    const ref = useRef(null);

    /**
     * Web worker for reducing histogram bins to the statistics
     * required for consistent/adjustable rendering.
     */
    const { worker } = useWasmWorkers()

    /**
     * Summary stats include max and total. Set asynchonously by
     * result of web worker calculation.
     */
    const [ statistics, setStatistics ] = useState(null);

    /**
     * Use background worker to calculate summary statistics.
     * 
     * Return a callback to gracefully kill the worker when the component
     * unmounts. 
     */
    useEffect(()=>{
        if (!worker.current) return;

        worker.current.histogramReducer(histogram).then(setStatistics);

    }, [ worker ]);

    /**
     * Message displayed with the histogram
     */
    const [ message, setMessage ] = useState("Calculating...");

    /**
     * Once total number of observations is known,
     * set the display message giving metadata
     */
    useEffect(() => {
        if (statistics)
            setMessage(`${caption} (N=${statistics.total})`)
    }, [ statistics ]);

    /*
     * Draw histogram peaks to the 2D canvas when it loads.
     */
    useEffect(()=>{
        if (!statistics || !ref.current) return;

        const ctx = ref.current.getContext("2d");
        ctx.fillStyle = foreground;
        
        histogram.forEach(([x, n]) => {
            ctx.fillRect(
                ref.current.width * (x - Δw),
                ref.current.height,
                ref.current.width * Δw,
                ref.current.height * -n / statistics.max
            );
        });
    }, [ statistics ]);

    return { statistics, ref, message };
}
    