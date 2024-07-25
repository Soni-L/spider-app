"use client";
import React, { act, memo, useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import {
  NotInterested,
  Pause,
  PlayArrow,
  PlayCircle,
  RadioButtonChecked,
  StopCircle,
} from "@mui/icons-material";

const ACTION_STATE = {
  PLAY: "PLAY",
  REST: "REST",
  CAPTURE: "CAPTURE",
};

export default memo(function PageActions() {
  const [eventArray, setEventArray] = useState([]);
  const [actionState, setActionState] = useState(ACTION_STATE.REST);

  const handlePlay = (actionState) => {
    if (actionState === ACTION_STATE.PLAY) {
      setActionState(ACTION_STATE.REST);
    }

    if (actionState === ACTION_STATE.REST) {
      setActionState(ACTION_STATE.PLAY);
    }
  };

  const handleCapture = (actionState) => {
    if (actionState === ACTION_STATE.CAPTURE) {
      setActionState(ACTION_STATE.REST);
    }

    if (actionState === ACTION_STATE.REST) {
      setActionState(ACTION_STATE.CAPTURE);
    }
  };

  useEffect(() => {
    if (eventArray.length > 0) {
      console.log(eventArray[eventArray.length - 1]);
      //document.body.style.cursor = "none";
    }
  }, [eventArray]);

  useEffect(() => {
    const handleIframeEvent = (event) => {
      if (event.origin !== window.location.origin) {
        // Ensure the message is from the expected origin
        return;
      }

      const { originName, type } = event.data;

      if (originName !== "target_site_iframe") {
        return;
      }

      if (type === "click") {
        if (actionState === ACTION_STATE.CAPTURE) {
          setEventArray((prevArray: any) => [...prevArray, event.data]);
        }
      }
    };

    window.addEventListener("message", handleIframeEvent);

    return () => {
      window.removeEventListener("message", handleIframeEvent);
    };
  }, [actionState]);

  return (
    <div
      style={{
        flex: "0 0 auto",
        height: "100%",
        width: "350px",
        borderLeft: "3px solid gray",
      }}
    >
      <>
        <div
          style={{
            display: "flex",
            height: "58px",
            width: "100%",
            borderBottom: "1px solid gray",
          }}
        >
          <IconButton
            size="small"
            onClick={() => handlePlay(actionState)}
            disabled={
              actionState === ACTION_STATE.CAPTURE || eventArray?.length === 0
            }
          >
            {actionState === ACTION_STATE.PLAY ? (
              <Pause color="warning" />
            ) : (
              <PlayArrow
                sx={{
                  color:
                    actionState === ACTION_STATE.CAPTURE ||
                    eventArray?.length === 0
                      ? "gray"
                      : "green",
                }}
              />
            )}
          </IconButton>

          <IconButton
            size="small"
            onClick={() => handleCapture(actionState)}
            disabled={actionState === ACTION_STATE.PLAY}
          >
            {actionState === ACTION_STATE.CAPTURE ? (
              <StopCircle color="error" />
            ) : (
              <RadioButtonChecked
                sx={{
                  color: actionState === ACTION_STATE.PLAY ? "gray" : "black",
                }}
              />
            )}
          </IconButton>

          <IconButton
            size="small"
            style={{ marginLeft: "auto" }}
            onClick={() => setEventArray([])}
          >
            <NotInterested />
          </IconButton>
        </div>
        {eventArray.map((eventItem, index) => (
          <div
            style={{
              width: "100%",
              border: "1px solid gray",
              padding: "2px 0",
            }}
            key={index}
          >
            <span style={{ fontWeight: "bold" }}>{eventItem.type + " "}</span>{" "}
            {eventItem.content}
          </div>
        ))}
      </>
    </div>
  );
});
