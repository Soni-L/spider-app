import React, { useState, useEffect, useRef } from "react";
import SearchUrlBar from "./SearchUrlBar";

export default function PageRenderer() {
  const iframeRef = useRef(null);
  const [html, setHtml] = useState("");

  const fetchPageContent = async (url: string) => {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/fetch-page?url=${encodeURIComponent(url)}`
    );
    const data = await response.json();
    return data;
  };

  const loadPage = async (url: string) => {
    const data = await fetchPageContent(url);
    setHtml(data.html);
  };

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDocument =
        iframeRef?.current?.contentDocument ||
        iframeRef?.current?.contentWindow?.document;
      iframeDocument.open();
      iframeDocument.write(html);
      iframeDocument.close();
    }
  }, [html]);

  return (
    <div
      style={{
        height: "100%",
        width: "calc(100vw - 350px)",
        overflowY: "hidden",
      }}
    >
      <SearchUrlBar onSearch={(url: string) => loadPage(url)} />
      <div
        style={{
          height: "calc(100vh - 110px)",
          width: "100%",
        }}
      >
        <iframe
          ref={iframeRef}
          style={{ width: "100%", height: "100%", border: "0", margin: 0 }}
          title="Embedded Content"
        />
      </div>
    </div>
  );
}
