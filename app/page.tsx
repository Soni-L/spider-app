"use client";

import { TextField, Button } from "@mui/material";
import { useRef, useState } from "react";
import PageRenderer from "./components/PageRenderer";

export default function Home() {
  const inputUrl = useRef<HTMLInputElement | null>(null);
  const [targetSiteUrl, setTargetSiteUrl] = useState<string>("");

  return (
    <main
      style={{
        display: "flex",
        height: "calc(100vh - 49px)",
        overflow: "hidden",
      }}
    >
      <div style={{ flexGrow: 1 }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            padding: "8px 0",
            height: "55px",
            backgroundColor: "lightgray",
          }}
        >
          <TextField
            size="small"
            inputRef={inputUrl}
            placeholder="Input url"
          ></TextField>
          <Button
            style={{ borderRadius: "10px", margin: "0" }}
            variant="contained"
            onClick={() => setTargetSiteUrl(inputUrl?.current?.value || "")}
          >
            Go
          </Button>
        </div>
        <PageRenderer url={targetSiteUrl} />
      </div>

      <div
        style={{
          backgroundColor: "#F0EAD6",
          height: "100%",
          width: "300px",
          borderLeft: "3px solid gray",
        }}
      ></div>
    </main>
  );
}
