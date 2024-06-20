"use client";
import PageActions from "./components/PageActions/PageActions";
import PageRenderer from "./components/PageRenderer/PageRenderer";

export default function Home() {

  return (
    <main
      style={{
        display: "flex",
        height: "calc(100vh - 49px)",
        overflow: "hidden",
      }}
    >
      <PageRenderer />
      <PageActions />
    </main>
  );
}
