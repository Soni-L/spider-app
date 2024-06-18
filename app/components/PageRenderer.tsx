import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PageRenderer({ open, url, handleClose }) {
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

    loadPage();
  }, []);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Scraper
          </Typography>
        </Toolbar>
      </AppBar>
      {html && css.length > 0 && (
        <div style={{ height: "400px", width: "400px" }}>
          <style>{css.join("\n")}</style>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )}
    </Dialog>
  );
}
