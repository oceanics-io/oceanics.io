"use client";
import Markdown from "react-markdown";
import React, { useRef, useEffect, type MouseEventHandler } from "react";
import useCatalog from "./useCatalog";
import styles from "./catalog.module.css";
import "mapbox-gl/dist/mapbox-gl.css";

interface ICatalog {
  /**
   * Source on the server to fetch the JSON
   * specification from.
   */
  src: string;
  /**
   * Current zoom level
   */
  zoomLevel: number;
}

const DEFAULT_MAP_PROPS = {
  zoom: 10,
  antialias: false,
  pitchWithRotate: false,
  dragRotate: false,
  touchZoomRotate: false,
  center: [-70, 43.7] as [number, number],
  style: {
    version: 8,
    name: "Dark",
    sources: {
      mapbox: {
        type: "vector",
        url: "mapbox://mapbox.mapbox-streets-v8",
      },
    },
    sprite: "mapbox://sprites/mapbox/dark-v8",
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

export type ChannelType = {
    id: string,
    /**
     * Source of the raw data
     */
    url: string,
    /**
     * The type of the data. 
     */
    type: string,
    /**
     * Hook for Styled Components to apply CSS
     */
    className?: string,
    /**
     * How to render the data
     */
    component: string,
    /**
     * Does not appear when zoomed in further
     */
    maxzoom: number,
    /**
     * Not rendered when zoomed further out
     */
    minzoom: number,
    /**
     * Current zoom level passed in for rendering in cards
     * whether or not the channel is currently visible
     */
    zoomLevel: number,
    /**
     * The provider and legal owner of the data
     */
    attribution?: string,
    /**
     * URL that links to the provider
     */
    info: string,
    /**
     * Render and update view on click
     */
    onClick: MouseEventHandler
}

/**
 * A channel abstracts access to a data source. 
 */
function Channel ({
    id,
    url,
    type,
    className,
    component="default",
    maxzoom=21,
    minzoom=1,
    zoomLevel,
    info="",
    onClick,
}: ChannelType) {
    const inView = (zoomLevel >= minzoom) && (zoomLevel <= maxzoom)
    return (
        <div className={className}>
            <h1>{id.replace(/-/g, ' ')}</h1>
            <div className={"zoom"}>
                <div className={inView?"visible":""}>
                    {`zoom: ${minzoom}-${maxzoom}`}
                </div>
            </div>
            <a onClick={onClick}>{`< render as ${type} with <${component}/> popup`}</a>
            <a href={url}>{"> download"}</a>
            <a href={info}>{"> attribution"}</a>
        </div>
    )
}


/**
 * The OpenApi component uses an OpenAPI specification for a
 * simulation backend, and uses it to construct an interface.
 */
export default function Catalog({ src, zoomLevel }: ICatalog) {
  const worker = useRef<Worker>();
  useEffect(() => {
    worker.current = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
  }, []);

  /**
   * List of collections to build selection from.
   *
   * If there is no `behind`, can be inserted in front, otherwise need to find the index
   * of the behind value, and insert after.
   */
  // const validLayerOrder = (channels: ChannelType[]) => {

  //     // Memoize just ID and BEHIND
  //     const triggers = {};

  //     // Queue to build
  //     const layerQueue: number[] = [];

  //     channels.forEach(({behind=null, id}) => {

  //         // no behind value
  //         if (behind === null) {
  //             queue.push(id);
  //             return;
  //         }

  //         // find behind value
  //         const ind = layerQueue.findIndex(behind);

  //         if (ind === -1) {
  //             if (behind in triggers) {
  //                 triggers[behind].push(id)
  //             } else {
  //                 triggers[behind] = [id]
  //             }
  //             return;
  //         }

  //         layerQueue.splice(ind+1, 0, id);

  //     });
  // }

  /**
   * OpenAPI spec structure will be populated asynchronously once the
   * web worker is available.
   */
  const { api, ref } = useCatalog({
    src,
    worker,
    map: {
      accessToken: "",
      defaults: DEFAULT_MAP_PROPS as any,
    },
  });

  return (
    <div className={styles.api}>
      <div ref={ref} />
      <div className={styles.catalog}>
        <Channel
          zoomLevel={zoomLevel}
          id="home"
          url="www.oceanics.io"
          maxzoom={21}
          minzoom={1}
          type="point"
          component="Location"
          info="www.oceanics.io"
          onClick={() => {
            console.log("click");
          }}
        />
      </div>
      <h1>{api.info.title}</h1>
      <Markdown>{api.info.description}</Markdown>
      {api.operations.map((operation) => {
        const requestBodyId = `${operation.path}-${operation.method}-request-body`;
        const requestQueryId = `${operation.path}-${operation.method}-query`;
        return (
          <div key={operation.summary}>
            <h2>{operation.summary}</h2>
            <h3>path</h3>
            <Markdown>{`\`${operation.path}\``}</Markdown>
            <h3>method</h3>
            <Markdown>{operation.method.toUpperCase()}</Markdown>
            <h3>description</h3>
            <Markdown>{operation.description}</Markdown>
            <form id={requestBodyId} className={styles.form}>
              <h1>{"request body"}</h1>
              {(operation.requestBody ?? []).map(
                ({ description, ...props }) => (
                  <div key={`${requestBodyId}-${props.id}`}>
                    <label htmlFor={props.id}>{props.name}</label>
                    <input {...props} />
                    <div>{description}</div>
                  </div>
                )
              )}
            </form>
            <form id={requestQueryId} className={styles.form}>
              <h1>{"query parameters"}</h1>
              {(operation.parameters ?? []).map(({ description, ...props }) => (
                <div key={`${requestQueryId}-${props.id}`}>
                  <label htmlFor={props.id}>{props.name}</label>
                  <input {...props} />
                  <div>{description}</div>
                </div>
              ))}
            </form>
          </div>
        );
      })}
    </div>
  );
}