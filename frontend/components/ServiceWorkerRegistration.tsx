"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    void navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch(() => {
        // A service worker requires a valid HTTPS certificate. The UI remains
        // usable when running on an unsecured development address.
      });
  }, []);
  return null;
}
