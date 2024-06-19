import React, { useState } from "react";
import SearchUrlBar from "./SearchUrlBar";

export default function PageRenderer() {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState([]);

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
    setCss(data.css);
  };

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
          overflowY: "scroll",
        }}
      >
        {html && css.length >= 0 && (
          <>
            {css.length > 0 && <style>{css.join("\n")}</style>}
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </>
        )}
      </div>
    </div>
  );
}
