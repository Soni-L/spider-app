"use client";
import React, { memo, useEffect, useState } from "react";
export default memo(function PageActions() {
  const [eventArray, setEventArray] = useState([]);

  useEffect(() => {
    const handleIframeEvent = (event) => {
      if (event.origin !== window.location.origin) {
        // Ensure the message is from the expected origin
        return;
      }

      const { originName, type, pathname } = event.data;

      if (originName !== "target_site_iframe") {
        return;
      }

      if (type === "click") {
        setEventArray((prevArray: any) => [...prevArray, { type, pathname }]);
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
});
