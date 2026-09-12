"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { verifyPairing, savePcUrl } from "@/lib/pairing";
import InstallPrompt from "./InstallPrompt";

export default function PairingScanner({ onPaired }: { onPaired: (url: string) => void }) {
  const [status, setStatus] = useState<"idle" | "scanning" | "checking" | "error">("idle");
  const [error, setError] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "qr-reader";

  useEffect(() => {
    return () => {
      // stop the camera stream on unmount — otherwise the browser
      // keeps the camera "on" (privacy indicator stays lit) after
      // the user navigates away
      scannerRef.current?.stop().catch(() => {});
    };
  }, []);

  async function startScan() {
    setStatus("scanning");
    setError("");
    const scanner = new Html5Qrcode(containerId);
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          if (scannerRef.current !== scanner) return;

          await scanner.stop().catch(() => {});
          scannerRef.current = null;
          setStatus("checking");

          const ok = await verifyPairing(decodedText);
          if (ok) {
            savePcUrl(decodedText);
            onPaired(decodedText);
          } else {
            setError("That QR code isn't a RemoteDeck server.");
            setStatus("idle");
          }
        },
        () => {}
      );
    } catch (cause) {
      scannerRef.current = null;
      setStatus("error");

      if (cause instanceof DOMException && cause.name === "NotAllowedError") {
        setError("Camera permission was denied. Allow camera access and try again.");
      } else if (cause instanceof DOMException && cause.name === "NotFoundError") {
        setError("No camera was found on this device.");
      } else {
        setError("Camera scanning requires HTTPS. Open this page using an HTTPS address.");
      }
    }
  }

  return (
    <main className="pairing-page">
      <section className="pairing-shell" aria-labelledby="pairing-title">
        <div className="pairing-intro">
          <div className="brand-mark" aria-hidden="true">▶</div>
          <p className="eyebrow">RemoteDeck</p>
          <h1 id="pairing-title">Connect your media remote</h1>
          <p className="pairing-copy">
            Scan the QR code shown by RemoteDeck on your PC to connect securely
            over your local network.
          </p>
        </div>
        <div className="scanner-stage">
          <div id={containerId} className="qr-reader" />
          {status === "idle" || status === "error" ? (
            <button className="pair-button" type="button" onClick={startScan}>
              <span aria-hidden="true">⌁</span> Scan PC QR code
            </button>
          ) : (
            <p className="scanner-status" aria-live="polite">
              {status === "scanning" ? "Point your camera at the QR code" : "Verifying connection..."}
            </p>
          )}
          {error && <p className="pairing-error" role="alert">{error}</p>}
        </div>
        <InstallPrompt />
      </section>
    </main>
  );
}