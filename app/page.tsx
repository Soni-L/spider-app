"use client";
import { useRef, useState } from "react";

export default function Home() {
  const inputUrl = useRef<HTMLInputElement | null>(null);

  return (
    <main>
      <input ref={inputUrl}></input>
      <button onClick={() => console.log(inputUrl?.current?.value)}>
        submit
      </button>
    </main>
  );
}
