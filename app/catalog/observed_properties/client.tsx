"use client";
import React from "react";
import useCollection from "@catalog/useCollection";
import specification from "@app/../specification.json";
import type { ObservedProperties } from "@oceanics/app";
import { NamedNode } from "../Node";
/**
 * Get schema metadata from the OpenAPI specification.
 */
const components = specification.components;
const { title: left } = components.schemas.ObservedProperties;
/**
 * Display an index of all or some subset of the
 * available nodes in the database.
 */
export default function Page({}) {
  /**
   * Retrieve node data use Web Worker.
   */
  const { collection, message } = useCollection({
    left,
    limit: components.parameters.limit.schema.default,
    offset: components.parameters.offset.schema.default,
  });
  /**
   * Client Component
   */
  return (
    <>
      <p>{message}</p>
      {collection.map(({ uuid, ...rest }: Omit<ObservedProperties, "free">) => {
        return (
          <NamedNode key={uuid} name={rest.name} uuid={uuid}>
            <p>description: {rest.description}</p>
          </NamedNode>
        );
      })}
    </>
  );
}