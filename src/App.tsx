// src/App.js
import { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import PageRenderer from "./components/PageRenderer/PageRenderer";
import CaptureActions from "./components/CaptureActions/CaptureActions";
import useCrawlerSession from "./hooks/useCrawlerSession";
import "./App.css";
import { io } from "socket.io-client";
import { isValidURL } from "./helpers/helperFunctions";

const socket = io(import.meta.env.VITE_APP_SOCKET_URL);

function App() {
  const [inputUrl, setInputUrl] = useState<string>("");
  const { crawlerSession, updateCrawlerSession } = useCrawlerSession();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("connect");
      socket.off("message");
    };
  }, []);

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
