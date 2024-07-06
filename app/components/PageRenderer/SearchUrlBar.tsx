import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { useTargetSite, useTargetSiteDispatch } from "@/app/page";
import ReplayIcon from "@mui/icons-material/Replay";
import CloseIcon from "@mui/icons-material/Close";

export default function SearchUrlBar({
  onSearch,
  loading = false,
}: {
  onSearch: Function;
  loading: boolean;
}) {
  const targetSite = useTargetSite();
  const targetSiteDispatch = useTargetSiteDispatch();

  function isValidURL(url: string) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(url);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px",
        backgroundColor: "lightgray",
        borderBottom: "2px solid gray",
      }}
    >
      <Button
        style={{ borderRadius: "10px", margin: "0", height: "40px" }}
        variant="outlined"
        onClick={() => targetSiteDispatch({ type: "siteUrl", value: "" })}
      >
        <CloseIcon />
      </Button>
      <TextField
        sx={{ flexGrow: 1, backgroundColor: "white", margin: "0" }}
        size="small"
        value={targetSite.siteUrl}
        placeholder="Enter the url of your target site"
      ></TextField>
      <Button
        style={{ borderRadius: "10px", margin: "0", height: "40px" }}
        variant="outlined"
        onClick={() => onSearch(targetSite.siteUrl)}
      >
        {loading ? (
          <CircularProgress size={20} sx={{ color: "white" }} />
        ) : (
          <ReplayIcon />
        )}
      </Button>
    </div>
  );
}
