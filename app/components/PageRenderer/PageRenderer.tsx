"use client";
import React, { memo, useState, useEffect, useRef } from "react";
import SearchUrlBar from "./SearchUrlBar";
import { useTargetSite } from "../../page";

const getElementTreeXPath = function (element) {
  var paths = [];

  // Use nodeName (instead of localName) so namespace prefix is included (if any).
  for (
    ;
    element && element.nodeType == Node.ELEMENT_NODE;
    element = element.parentNode
  ) {
    var index = 0;
    var hasFollowingSiblings = false;
    for (
      var sibling = element.previousSibling;
      sibling;
      sibling = sibling.previousSibling
    ) {
      // Ignore document type declaration.
      if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE) continue;

      if (sibling.nodeName == element.nodeName) ++index;
    }

    for (
      var sibling = element.nextSibling;
      sibling && !hasFollowingSiblings;
      sibling = sibling.nextSibling
    ) {
      if (sibling.nodeName == element.nodeName) hasFollowingSiblings = true;
    }

    var tagName =
      (element.prefix ? element.prefix + ":" : "") + element.localName;
    var pathIndex =
      index || hasFollowingSiblings ? "[" + (index + 1) + "]" : "";
    paths.splice(0, 0, tagName + pathIndex);
  }

  return paths.length ? "/" + paths.join("/") : null;
};

function getXPath(element) {
  if (element && element.id) return '//*[@id="' + element.id + '"]';
  else return getElementTreeXPath(element);
}

export default memo(function PageRenderer() {
  const targetSite = useTargetSite();
  const iframeRef = useRef(null);
  const [html, setHtml] = useState("");
  const [styles, setStyles] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPageContent = async (url: string) => {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/fetch-page?url=${encodeURIComponent(url)}`,
      { method: "GET", credentials: "include" }
    );
    const data = await response.json();
    return data;
  };

  const rerenderFromUserAction = async (xpath) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user-actions?action=click&xpath=${xpath}&url=${targetSite.siteUrl}`,
        { method: "GET", credentials: "include" }
      );

      const data = await response.json();
      setStyles(data.styles);
      setHtml(data.html);
      setLoading(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
    loadPage(targetSite.siteUrl);
  }, []);

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDocument =
        iframeRef?.current?.contentDocument ||
        iframeRef?.current?.contentWindow?.document;
      iframeDocument.open();
      iframeDocument.write(html);
      iframeDocument.close();

      // Remove all <script> tags
      const scripts = iframeDocument.getElementsByTagName("script");
      while (scripts.length > 0) {
        scripts[0].parentNode.removeChild(scripts[0]);
      }

      if (iframeDocument.head) {
        // Create a new style element
        const styleElement = iframeDocument.createElement("style");
        styleElement.textContent = styles;
        // Append the style element to the head or body
        iframeDocument.head.appendChild(styleElement);
      }

      // Function to handle and stop events
      const handleEvent = async (event) => {
        let element = event.target;
        let outerText = element.outerText;
        let displayContent = outerText || element.tagName;
        event.preventDefault();
        event.stopPropagation();

        let xpath = getXPath(event.target);
        if (event.type == "click") {
          if (iframeRef?.current?.contentWindow?.document)
            iframeRef.current.contentWindow.document.body.style.cursor = "wait";
          await rerenderFromUserAction(xpath);
          if (iframeRef?.current?.contentWindow?.document)
            iframeRef.current.contentWindow.document.body.style.cursor = "none";
        }
        window.parent.postMessage(
          {
            originName: "target_site_iframe",
            type: event.type,
            xPath: xpath,
            content: displayContent,
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
          position: "relative",
        }}
      >
        <>
          <div
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              backgroundColor: "gray",
              opacity: "0.9",
              zIndex: 100,
              display: loading == true ? "block" : "none",
            }}
          ></div>
          <iframe
            ref={iframeRef}
            sandbox
            style={{ width: "100%", height: "100%", border: "0", margin: 0 }}
            title="Embedded Content"
          />
        </>
      </div>
    </div>
  );
});
