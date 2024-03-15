import { useState, useEffect, useRef, useMemo } from "react";
type ModuleType = typeof import("@oceanics-io/wasm");
import type { InteractiveDataStream } from "@oceanics-io/wasm";

export interface IDataStream {
    /**
     * Hex color for the time series
     */
    streamColor: string;
    /**
     * Hex color for 
     */
    overlayColor: string;
    /**
     * Hex color for background blending
     */
    backgroundColor: string;
    /**
     * How thick to draw the time series line
     */
    lineWidth: number;
    /**
     * How large to draw the points
     */
    pointSize: number;
    /**
     * Buffer of observations visible at once
     */
    capacity: number;
    /**
     * Axis tick length
     */
    tickSize: number;
    /**
     * Canvas-drawn text size
     */
    fontSize: number;
    /**
     * Space between ticks and text labels
     */
    labelPadding: number;
}

/*
 * Time series data container. Uses a synchronous WASM runtime
 * to draw to canvas and do various transformations of the data.
 */
export const useDataStream = ({
    capacity,
    ...props
}: IDataStream) => {

    /**
     * Reference to pass to target canvas
     */
    const ref = useRef<HTMLCanvasElement|null>(null);

    /**
     * Runtime will be passed to calling Hook or Component. 
     */
    const [ runtime, setRuntime ] = useState<ModuleType|null>(null);

    /**
     * Dynamically load the WASM, add debugging, and save to React state.
     */
    useEffect(() => {
        try {
            (async () => {
                const wasm = await import("@oceanics-io/wasm");
                wasm.panic_hook();
                setRuntime(wasm);
            })()   
        } catch (err) {
            console.error("Unable to load WASM runtime")
        }
    }, []);

    /**
     * The data stream structure. 
     */
    const [ dataStream, setStream ] = useState<InteractiveDataStream|null>(null);

    /**
     * Create the data stream once the runtime has loaded. 
     */
    useEffect(() => {
        if (runtime) setStream(new runtime.InteractiveDataStream(capacity));
    }, [ runtime, capacity ]);

    /**
     * Label for user interface.
     */
    const [ message, setMessage ] = useState<string>("Loading...");

    /**
     * Run the animation loop.
     */
    useEffect(() => {
        if (!runtime || !dataStream || !ref.current) return;
        const canvas: HTMLCanvasElement = ref.current;

        // use location based sunlight function
        const fcn = (t: number) => {
            const days = t / 5000.0 % 365.0;
            const hours = days % 1.0;
            // const latitude = 46.0;
            return Math.sin(hours)
            // return runtime.photosynthetically_active_radiation(days, latitude, hours);
        };

        canvas.addEventListener("mousemove", ({clientX, clientY}) => {
            const {left, top} = canvas.getBoundingClientRect();
            dataStream.update_cursor(clientX-left, clientY-top);
        });

        [canvas.width, canvas.height] = ["width", "height"].map(
            dim => Number(getComputedStyle(canvas).getPropertyValue(dim).slice(0, -2))
        );

        const start = performance.now();
        let requestId: number|null = null;

        (function render() {
            const time = performance.now() - start;
            dataStream.push(time, fcn(time));
            dataStream.draw(canvas, time, props);
            setMessage(`Light (N=${dataStream.size()})`);
            requestId = requestAnimationFrame(render);
        })()

        return () => {if (requestId) cancelAnimationFrame(requestId)};
    }, [ dataStream, ref, props, runtime ]);

    return {
        ref,
        runtime, 
        dataStream,
        message
    }
};


export default useDataStream;