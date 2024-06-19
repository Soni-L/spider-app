import React, { useEffect, useState } from "react";
import Slide from "@mui/material/Slide";

export default function PageRenderer({ url }) {
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

  useEffect(() => {
    const loadPage = async () => {
      const data = await fetchPageContent(url);
      setHtml(data.html);
      setCss(data.css);
    };

    if (url) loadPage();
  }, [url]);

  return (
    <div>
      {html && css.length > 0 && (
        <>
          <style>{css.join("\n")}</style>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </>
      )}
    </div>
  );
}
