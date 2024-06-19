import React, { useRef } from "react";
import { TextField, Button } from "@mui/material";

export default function SearchUrlBar({ onSearch }) {
  const inputUrl = useRef<HTMLInputElement | null>(null);
  return (
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
        onClick={() => onSearch(inputUrl.current?.value)}
      >
        Go
      </Button>
    </div>
  );
}
