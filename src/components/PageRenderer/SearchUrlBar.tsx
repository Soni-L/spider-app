import { TextField, Button, CircularProgress } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import CloseIcon from "@mui/icons-material/Close";
import useCrawlerSession from "../../hooks/useCrawlerSession";

export default function SearchUrlBar({
  onSearch,
  loading = false,
}: {
  onSearch: Function;
  loading: boolean;
}) {
  const { crawlerSession, updateCrawlerSession } = useCrawlerSession();

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
        onClick={() => updateCrawlerSession({ targetSiteUrl: "" })}
      >
        <CloseIcon />
      </Button>
      <TextField
        sx={{ flexGrow: 1, backgroundColor: "white", margin: "0" }}
        size="small"
        value={crawlerSession.targetSiteUrl}
        placeholder="Enter the url of your target site"
      ></TextField>
      <Button
        style={{ borderRadius: "10px", margin: "0", height: "40px" }}
        variant="outlined"
        onClick={() => onSearch(crawlerSession.targetSiteUrl)}
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
