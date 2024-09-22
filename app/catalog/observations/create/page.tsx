"use client";
import React, { useRef } from "react";
import specification from "@app/../specification.json";
import style from "@catalog/things/create/page.module.css";
import Markdown from "react-markdown";
import useCreate, {TextInput, NumberInput} from "@catalog/useCreate";

const { Observations } = specification.components.schemas;
const { properties } = Observations;
/**
 * Display an index of all or some subset of the
 * available nodes in the database.
 */
export default function Create({}) {
  /**
   * Form data is synced with user input
   */
  const uuid = useRef<HTMLInputElement | null>(null);
  const phenomenonTime = useRef<HTMLInputElement | null>(null);
  const result = useRef<HTMLInputElement | null>(null);
  const resultTime = useRef<HTMLInputElement | null>(null);
  const resultQuality = useRef<HTMLInputElement | null>(null);
  const validTimeStart = useRef<HTMLInputElement | null>(null);
  const validTimeEnd = useRef<HTMLInputElement | null>(null);
  const parameters = useRef<HTMLInputElement | null>(null);
  /**
   * Web Worker.
   */
  const { onSubmit, disabled, create, message } = useCreate({
    left: Observations.title,
  });
  /**
   * On submission, we delegate the request to our background
   * worker, which will report on success/failure.
   */
  const onSubmitCallback = () => {
    return {
      uuid: uuid.current?.value,
      phenomenonTime: phenomenonTime.current?.value,
      result: result.current?.value,
      resultTime: resultTime.current?.value,
      resultQuality: resultQuality.current?.value,
      validTime: [
        validTimeStart.current?.value, 
        validTimeEnd.current?.value
      ],
      parameters: parameters.current?.value
    };
  };
  /**
   * Client Component
   */
  return (
    <>
      <Markdown>{Observations.description}</Markdown>
      <p>{message}</p>
      <hr />
      <form
        className={style.form}
        onSubmit={onSubmit(onSubmitCallback)}
        ref={create}
      >
        <TextInput
          name={"uuid"}
          inputRef={uuid}
          required
          description={properties.uuid.description}
          defaultValue={crypto.randomUUID()}
        ></TextInput>
        <NumberInput
          name={"phenomenonTime"}
          inputRef={phenomenonTime}
          required
          description={properties.phenomenonTime.description}
          defaultValue={performance.now()}
        ></NumberInput>
        <NumberInput
          name={"result"}
          inputRef={result}
          required
          description={properties.result.description}
        ></NumberInput>
        <NumberInput
          name={"resultTime"}
          inputRef={resultTime}
          description={properties.resultTime.description}
        ></NumberInput>
        <TextInput
          name={"resultQuality"}
          inputRef={resultQuality}
          description={properties.resultQuality.description}
        ></TextInput>
        <TextInput
          name={"validTimeStart"}
          inputRef={validTimeStart}
          description={properties.validTime.description}
        ></TextInput>
        <TextInput
          name={"validTimeStart"}
          inputRef={validTimeEnd}
          description={properties.validTime.description}
        ></TextInput>
        <TextInput
          name={"parameters"}
          inputRef={parameters}
          description={properties.parameters.description}
        ></TextInput>
        <button className={style.submit} disabled={disabled}>
          Create
        </button>
      </form>
    </>
  );
}