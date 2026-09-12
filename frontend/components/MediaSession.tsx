"use client";

import { useEffect } from "react";

type MediaSessionProps = {
  onCommand: (path: string, label: string) => void;
};

export default function MediaSession({ onCommand }: MediaSessionProps) {
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const session = navigator.mediaSession;
    session.metadata = new MediaMetadata({ title: "RemoteDeck", artist: "Connected to your PC", album: "Media remote" });
    session.playbackState = "playing";

    const handlers: Array<[MediaSessionAction, () => void]> = [
      ["play", () => onCommand("/play-pause", "Play")],
      ["pause", () => onCommand("/play-pause", "Pause")],
      ["previoustrack", () => onCommand("/seek/backward", "Seek backward")],
      ["nexttrack", () => onCommand("/seek/forward", "Seek forward")],
      ["seekbackward", () => onCommand("/seek/backward", "Seek backward")],
      ["seekforward", () => onCommand("/seek/forward", "Seek forward")],
    ];
    handlers.forEach(([action, handler]) => session.setActionHandler(action, handler));

    return () => {
      handlers.forEach(([action]) => session.setActionHandler(action, null));
      session.playbackState = "none";
      session.metadata = null;
    };
  }, [onCommand]);

  return null;
}
