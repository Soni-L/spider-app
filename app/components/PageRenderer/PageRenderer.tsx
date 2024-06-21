"use client";
import React, { memo, useState, useEffect, useRef } from "react";
import SearchUrlBar from "./SearchUrlBar";

// Function to get XPath of an element
function getXPath(node) {
  if (node.hasAttribute("id")) {
    return "//" + node.tagName + '[@id="' + node.id + '"]';
  }

  if (node.hasAttribute("class")) {
    return (
      "//" + node.tagName + '[@class="' + node.getAttribute("class") + '"]'
    );
  }

  var old = "/" + node.tagName;
  var new_path = this.xpath(node.parentNode) + old;

  return new_path;
}

export default memo(function PageRenderer() {
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
      iframeDocument.close();

      if (iframeDocument.head) {
        // Create a new style element
        const styleElement = iframeDocument.createElement("style");
        styleElement.textContent = styles;
        // Append the style element to the head or body
        iframeDocument.head.appendChild(styleElement);
      }

      // Function to handle and stop events
      const handleEvent = (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.parent.postMessage(
          {
            originName: "target_site_iframe",
            type: event.type,
            xPath: getXPath(event.target),
            content: event.target.innerText,
          },
          "*"
        );
      };

      // Add event listeners to stop events and send messages to the parent window
      ["click"].forEach((eventType) => {
        iframeDocument.addEventListener(eventType, handleEvent);
      });

      // Cleanup event listeners on component unmount
      return () => {
        ["click", "mousemove", "keydown"].forEach((eventType) => {
          iframeDocument.removeEventListener(eventType, handleEvent);
        });
      };
    }
  }, [html, styles]);

  useEffect(() => {
    const handleEvent = (event) => {
      const eventData = {
        type: event.type,
        timestamp: new Date().toISOString(),
        details: event.detail || event.target.value || null,
      };
      window.parent.postMessage(eventData, "*");
    };

    const events = ["click", "mousemove", "keypress"];
    events.forEach((eventType) => {
      window.addEventListener(eventType, handleEvent);
    });

    return () => {
      events.forEach((eventType) => {
        window.removeEventListener(eventType, handleEvent);
      });
    };
  }, []);

  return (
    <div
      style={{
        height: "100%",
        width: "calc(100vw - 350px)",
        overflowY: "hidden",
      }}
    >
      <SearchUrlBar
        onSearch={(url: string) => loadPage(url)}
        loading={loading}
      />
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
});
