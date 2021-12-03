/**
 * React and friends.
 */
import React, { useEffect } from "react";
import type { FC } from "react";

import useMapBox from "oceanics-io-ui/build/hooks/useMapBox";
//  import useWasmRuntime from "../hooks/useWasmRuntime";
import useSharedWorkerState from "../hooks/useSharedWorkerState";
import useFragmentQueue, {
  OBJECT_STORAGE_URL,
} from "../hooks/useFragmentQueue";
import useObjectStorage from "../hooks/useObjectStorage";

export const DEFAULT_MAP_PROPS = {
  zoom: 10,
  antialias: false,
  pitchWithRotate: false,
  dragRotate: false,
  touchZoomRotate: false,
  center: [-70, 43.7],
  style: {
    version: 8,
    name: "Dark",
    sources: {
      mapbox: {
        type: "vector",
        url: "mapbox://mapbox.mapbox-streets-v8",
      },
    },
    sprite: "mapbox://sprites/mapbox/dark-v10",
    glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": "#444",
        },
      },
      {
        id: "water",
        source: "mapbox",
        "source-layer": "water",
        type: "fill",
        paint: {
          "fill-color": "#000",
        },
      },
      {
        id: "cities",
        source: "mapbox",
        "source-layer": "place_label",
        type: "symbol",
        layout: {
          "text-field": "{name_en}",
          "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 4, 9, 6, 12],
        },
        paint: {
          "text-color": "#ccc",
          "text-halo-width": 2,
          "text-halo-color": "#000",
        },
      },
    ],
  },
};

const createBathysphereWorker = () => {
  return new Worker(
    new URL("../workers/useBathysphereApi.worker.ts", import.meta.url)
  );
};

interface ISqualltalk {
  map: {
    accessToken: string;
    defaults: {
      zoom: number;
      center: [number, number];
    };
  };
  height?: string;
}

/**
 * Page component rendered by GatsbyJS.
 */
const Squalltalk: FC<ISqualltalk> = ({ map, height = "500px" }) => {
  const { ref, map: mapBox } = useMapBox(map);

  const worker = useSharedWorkerState("bathysphere");
  //    const {runtime} = useWasmRuntime();
  const fs = useObjectStorage(OBJECT_STORAGE_URL, worker.ref);

  useEffect(() => {
    worker.start(createBathysphereWorker());
  }, []);

  useFragmentQueue({ worker: worker.ref, map: mapBox, fs });

  return (
    <>
      <link
        href="https://api.mapbox.com/mapbox-gl-js/v1.5.0/mapbox-gl.css"
        rel="stylesheet"
      />
      <div style={{ height }} ref={ref} />
    </>
  );
};

export const Standalone: FC<{center: [number, number], zoom: number}> = ({center, zoom}) => {
  return (
    <Squalltalk
      height={"250px"}
      map={{
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
        defaults: {
            ...DEFAULT_MAP_PROPS,
            center,
            zoom
        },
      }}
    />
  );
};

Squalltalk.displayName = "Squalltalk";
export default Squalltalk;