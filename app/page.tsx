"use client";

import { useRef, useState } from "react";
import PageRenderer from "./components/PageRenderer";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        height: "calc(100vh - 49px)",
        overflow: "hidden",
      }}
    >
      <PageRenderer />
      <div
        style={{
          flex: "0 0 auto",
          backgroundColor: "lightgray",
          height: "100%",
          width: "350px",
          borderLeft: "3px solid gray",
        }}
      ></div>
    </main>
  );
}
