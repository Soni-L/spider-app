import React, { useState, useEffect, useRef } from "react";
import SearchUrlBar from "./SearchUrlBar";

export default function PageRenderer() {
  const iframeRef = useRef(null);
  const [html, setHtml] = useState("");
  const [styles, setStyles] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const data = await fetchPageContent(url);
      setStyles(data.styles);
      setHtml(data.html);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDocument =
        iframeRef?.current?.contentDocument ||
        iframeRef?.current?.contentWindow?.document;
      iframeDocument.open();
      iframeDocument.write(html);

      if (iframeDocument.head) {
        // Create a new style element
        const styleElement = iframeDocument.createElement("style");
        styleElement.textContent = styles;
        console.log(styleElement);
        // Append the style element to the head or body
        iframeDocument.head.appendChild(styleElement);
      }

      iframeDocument.close();
    }
  }, [html, styles]);

  return (
    <div
      style={{
        height: "100%",
        width: "calc(100vw - 350px)",
        overflowY: "hidden",
      }}
    >
      <SearchUrlBar onSearch={(url: string) => loadPage(url)} loading={loading}/>
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
