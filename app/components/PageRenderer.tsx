import React, { useEffect, useState, useRef } from "react";
import { TextField, Button } from "@mui/material";

export default function PageRenderer() {
  const inputUrl = useRef<HTMLInputElement | null>(null);

  const [html, setHtml] = useState("");
  const [css, setCss] = useState([]);

  const fetchPageContent = async (url) => {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/fetch-page?url=${encodeURIComponent(url)}`
    );
    const data = await response.json();
    return data;
  };

  const loadPage = async () => {
    const data = await fetchPageContent(inputUrl?.current?.value);
    setHtml(data.html);
    setCss(data.css);
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        overflowY: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px",
          backgroundColor: "lightgray",
          borderBottom: "2px solid gray",
        }}
      >
        <TextField
          sx={{ flexGrow: 1, backgroundColor: "white", margin: "0" }}
          size="small"
          inputRef={inputUrl}
          placeholder="Enter the url of your target site"
        ></TextField>
        <Button
          style={{ borderRadius: "10px", margin: "0", height: "40px" }}
          variant="contained"
          onClick={loadPage}
        >
          Go
        </Button>
      </div>
      <div
        style={{
          height: "calc(100vh - 110px)",
          width: "100%",
          overflowY: "scroll",
        }}
      >
        {html && css.length > 0 && (
          <>
            <style>{css.join("\n")}</style>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </>
        )}
      </div>
    </div>
  );
}
