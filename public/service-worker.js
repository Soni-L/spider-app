// public/service-worker.js
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
});

self.addEventListener("fetch", (event) => {
  // Intercept network requests
  event.respondWith(
    (async () => {
      const url = new URL(event.request.url);

      if (url.origin === self.location.origin) {
        // For same-origin requests, you can modify or handle responses here
        try {
          const response = await fetch(event.request);
          const modifiedResponse = new Response(response.body, {
            ...response,
            headers: {
              ...response.headers,
              "X-Custom-Header": "Modified", // Example modification
            },
          });
          return modifiedResponse;
        } catch (error) {
          console.error("Fetch failed:", error);
          return new Response("Error fetching the resource.", { status: 500 });
        }
      } else {
        // For cross-origin requests, you might need to handle differently
        try {
          const response = await fetch(event.request);
          const contentType = response.headers.get("Content-Type");

          if (contentType && contentType.includes("text/html")) {
            const text = await response.text();
            // Example modification of HTML content
            const modifiedText = text.replace(
              /<meta http-equiv="Content-Security-Policy"[^>]*>/i,
              ""
            );
            return new Response(modifiedText, {
              headers: response.headers,
              status: response.status,
              statusText: response.statusText,
            });
          }

          return response;
        } catch (error) {
          console.error("Fetch failed:", error);
          return new Response("Error fetching the resource.", { status: 500 });
        }
      }
    })()
  );
});
