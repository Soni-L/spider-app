// src/App.js
import { useState } from "react";
import { TextField, Button } from "@mui/material";
import PageRenderer from "./components/PageRenderer/PageRenderer";
import CaptureActions from "./components/CaptureActions/CaptureActions";
import useCrawlerSession from "./hooks/useCrawlerSession";
import "./App.css";

function isValidURL(url: string) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(url);
}

function App() {
  const [inputUrl, setInputUrl] = useState<string>("");
  const { crawlerSession, updateCrawlerSession } = useCrawlerSession();

  return (
    <main
      style={{
        display: "flex",
        height: "calc(100vh - 49px)",
        overflow: "hidden",
      }}
    >
      {crawlerSession.targetSiteUrl === "" ? (
        <div
          style={{
            width: "600px",
            height: "50px",
            margin: "0 auto",
            position: "relative",
            top: "80px",
            display: "flex",
            gap: "2px",
          }}
        >
          <TextField
            sx={{
              flexGrow: 1,
              backgroundColor: "white",
              margin: "0",
            }}
            size="small"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                updateCrawlerSession({ targetSiteUrl: inputUrl });
                ev.preventDefault();
              }
            }}
            placeholder="Enter the url of your target site"
            error={inputUrl.length > 0 && !isValidURL(inputUrl)}
          ></TextField>
          <Button
            style={{
              borderRadius: "0 10px 10px 0",
              margin: "0",
              height: "40px",
            }}
            variant="contained"
            onClick={() => updateCrawlerSession({ targetSiteUrl: inputUrl })}
            disabled={!isValidURL(inputUrl)}
          >
            GO
          </Button>
        </div>
      ) : (
        <>
          <PageRenderer />
          <CaptureActions />
        </>
      )}
    </main>
  );
}

export default App;
