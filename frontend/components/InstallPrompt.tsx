"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const subscribeToNothing = () => () => {};

function subscribeToInstallState(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia("(display-mode: standalone)");
  mediaQuery.addEventListener("change", onStoreChange);
  window.addEventListener("appinstalled", onStoreChange);
  return () => {
    mediaQuery.removeEventListener("change", onStoreChange);
    window.removeEventListener("appinstalled", onStoreChange);
  };
}

function getInstallState() {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function getIOSState() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const isInstalled = useSyncExternalStore(subscribeToInstallState, getInstallState, () => false);
  const isIOS = useSyncExternalStore(subscribeToNothing, getIOSState, () => false);

  useEffect(() => {
    const captureInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", captureInstall);
    return () => {
      window.removeEventListener("beforeinstallprompt", captureInstall);
    };
  }, []);

  if (isInstalled || (!isIOS && !installEvent)) return null;

  return (
    <div className="install-prompt">
      {isIOS ? (
        <p>Install RemoteDeck: tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.</p>
      ) : (
        <button type="button" onClick={async () => {
          await installEvent?.prompt();
          setInstallEvent(null);
        }}>Install app</button>
      )}
    </div>
  );
}
