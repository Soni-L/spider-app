import React, { useEffect } from "react";

export default function PageActions() {
  useEffect(() => {
    const handleIframeEvent = (event) => {
      if (event.origin !== window.location.origin) {
        // Ensure the message is from the expected origin
        return;
      }

      const { type, detail } = event.data;

      if (type === "click" || type === "mousemove" || type === "keydown") {
        console.log(`Event type: ${type}, Detail:`, detail);
      }
    };

    window.addEventListener("message", handleIframeEvent);

    return () => {
      window.removeEventListener("message", handleIframeEvent);
    };
  }, []);
  return (
    <div
      style={{
        flex: "0 0 auto",
        backgroundColor: "lightgray",
        height: "100%",
        width: "350px",
        borderLeft: "3px solid gray",
      }}
    ></div>
  );
}
