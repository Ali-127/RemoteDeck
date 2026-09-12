"use client";

import { useEffect } from "react";

type MediaSessionProps = {
  onCommand: (path: string, label: string) => void;
};

export default function MediaSession({ onCommand }: MediaSessionProps) {
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const session = navigator.mediaSession;
    const audio = new Audio(
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YQAAAAA=",
    );
    audio.loop = true;
    audio.volume = 0;
    session.metadata = new MediaMetadata({
      title: "RemoteDeck",
      artist: "Connected to your PC",
      album: "Media remote",
    });
    session.playbackState = "paused";

    const activateSession = () => {
      void audio.play().then(() => {
        session.playbackState = "playing";
      }).catch(() => {});
    };

    const handlers: Array<[MediaSessionAction, () => void]> = [
      ["play", () => { activateSession(); onCommand("/play-pause", "Play"); }],
      ["pause", () => onCommand("/play-pause", "Pause")],
      ["previoustrack", () => onCommand("/seek/backward", "Seek backward")],
      ["nexttrack", () => onCommand("/seek/forward", "Seek forward")],
      ["seekbackward", () => onCommand("/seek/backward", "Seek backward")],
      ["seekforward", () => onCommand("/seek/forward", "Seek forward")],
    ];
    handlers.forEach(([action, handler]) => session.setActionHandler(action, handler));

    window.addEventListener("pointerdown", activateSession, { once: true });

    return () => {
      window.removeEventListener("pointerdown", activateSession);
      handlers.forEach(([action]) => session.setActionHandler(action, null));
      audio.pause();
      session.playbackState = "none";
      session.metadata = null;
    };
  }, [onCommand]);

  return null;
}
