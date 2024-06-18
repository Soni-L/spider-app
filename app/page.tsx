"use client";

import { TextField, Button } from "@mui/material";
import { useRef, useState } from "react";
import PageRenderer from "./components/PageRenderer";

type SiteViewModalProps = {
  open: boolean;
  url: string;
};

export default function Home() {
  const inputUrl = useRef<HTMLInputElement | null>(null);
  const [siteViewModalProps, setSiteViewModalProps] =
    useState<SiteViewModalProps>({ open: false, url: "" });

  return (
    <main>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "200px",
          margin: "auto",
          gap: "10px",
          padding: "30px 0",
        }}
      >
        <TextField
          size="small"
          inputRef={inputUrl}
          placeholder="Input url"
        ></TextField>
        <Button
          variant="contained"
          onClick={() =>
            setSiteViewModalProps({
              url: inputUrl?.current?.value || "",
              open: true,
            })
          }
        >
          Open Site
        </Button>
      </div>
      {siteViewModalProps.open && (
        <PageRenderer
          open={siteViewModalProps.open}
          url={siteViewModalProps.url}
          handleClose={() => setSiteViewModalProps({ open: false, url: "" })}
        />
      )}
    </main>
  );
}
