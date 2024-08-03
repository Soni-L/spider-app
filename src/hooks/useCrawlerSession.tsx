import { useLocalStorage } from "@uidotdev/usehooks";
import { v4 as uuidv4 } from "uuid";

const ACTION_STATE = {
  PLAY: "PLAY",
  REST: "REST",
  CAPTURE: "CAPTURE",
};

const useCrawlerSession = () => {
  const [crawlerSession, setCrawlerSession] = useLocalStorage(
    "crawler-session-data",
    {
      crawlerSessionId: uuidv4(),
      backendBrowerInstanceId: "",
      targetSiteUrl: "",
      eventActionState: ACTION_STATE.REST,
      capturedUserEvents: [],
    }
  );

  const updateCrawlerSession = (values : object) => {
    setCrawlerSession((newCrawlerSession) => {
      return { ...newCrawlerSession, ...values };
    });
  };

  return {
    crawlerSession,
    updateCrawlerSession,
  };
};

export default useCrawlerSession;
