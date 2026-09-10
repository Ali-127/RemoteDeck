"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { verifyPairing, savePcUrl } from "@/lib/pairing";

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
    <div>
      {(status === "idle" || status === "error") && (
        <button onClick={startScan}>Pair with PC</button>
      )}
      <div id={containerId} style={{ width: 300 }} />
      {status === "scanning" && <p>Scanning...</p>}
      {status === "checking" && <p>Verifying…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}