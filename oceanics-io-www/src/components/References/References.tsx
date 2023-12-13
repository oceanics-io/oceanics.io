// @ts-ignore
import React, { useMemo } from "react";
import type { MouseEventHandler } from "react";
import Stub from "./Stub";
import type { Memo, QueryType } from "oceanics-io-www-wasm";

/**
 * Main page inputs
 */
export interface DocumentIndexType {
  className: string
  documents: Memo[];
  query: QueryType;
  onShowMore: MouseEventHandler<HTMLButtonElement>;
  onClearConstraints: MouseEventHandler<HTMLButtonElement>;
  onClickLabel: (label: string) => MouseEventHandler<HTMLAnchorElement>;
  pagingIncrement: number;
  navigate: (...args: unknown[]) => void;
}

/**
 * Base component for web landing page.
 *
 * Optionally use query parameters and hash anchor to filter content.
 */
const Index = ({
  className,
  documents,
  query,
  onShowMore,
  onClearConstraints,
  onClickLabel,
  pagingIncrement
}: DocumentIndexType) => {
  /**
   * The array of visible articles sorted in reverse chronological order.
   * The initial value is the subset from 0 to the increment constant.
   *
   * Filters based on selected tag from user interface, removes work in progress ("wip")
   * and "internal" labels.
   */
  const available: Document[] = useMemo(() => {
    const compare = (first: Document, second: Document) => {
      return (
        second.metadata.published.getTime() - first.metadata.published.getTime()
      );
    };

    const labelOrPublic = ({ metadata }: Document): boolean => {
      const matchTag: string[] = metadata.labels.map(({ value }) => value);
      const matchRef: string[] = metadata.references?.map((ref) => ref.hash)??[];
      const selectedTag: string = query.label ?? "";
      const selectedRef: string = query.reference?.toString() ?? "";
      return (
        !matchTag.includes("wip") &&
        !matchTag.includes("internal") &&
        (!selectedTag || matchTag.includes(selectedTag)) &&
        (!selectedRef || matchRef.includes(selectedRef))
      );
    };

    return documents.sort(compare).filter(labelOrPublic);
  }, [query]);

  /**
   * We need to know the total number visible, and the total number possible,
   * in other words after the filter but before the slice.
   */
  const visible: Document[] = useMemo(() => {
    return available.slice(0, query.items ?? pagingIncrement);
  }, [available, query, pagingIncrement]);

  /**
   * Remove button from DOM when we have no more results. To do this
   * we need to know the total number visible, and the total number possible,
   * in other words after the filter but before the slice.
   */
  const showMore = useMemo(() => {
    return {
      style: {
        display: visible.length === available.length ? "none" : undefined,
      },
      text: "More arcana",
    };
  }, [visible, available]);

  return (
    <div className={className}>
      {visible.map((document) => (
        <Stub key={document.metadata.title} document={document} onClickLabel={onClickLabel}/>
      ))}
      <button onClick={onShowMore} style={showMore.style}>
        {showMore.text}
      </button>
      <button onClick={onClearConstraints}>{"Clear selection"}</button>
    </div>
  );
};

/**
 * Default export is the base version
 */
export default Index;