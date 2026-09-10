"use client"
import PairingScanner from "@/components/PairingScanner";
import { sendCommand } from "@/lib/api";
import { getSavedPcUrl } from "@/lib/pairing";
import { useState } from "react";

export default function Home() {
  const [pcUrl, setPcUrl] = useState<string | null>(() => getSavedPcUrl())

  if(!pcUrl) return <PairingScanner onPaired={setPcUrl} />

  return (
    <main className="grid grid-cols-1 gap-4 p-4">
      <button onClick={() => sendCommand(pcUrl, "/play-pause")}>⏯ Play/Pause</button>
      <button onClick={() => sendCommand(pcUrl, "/seek/backward")}>⏪ Back</button>
      <button onClick={() => sendCommand(pcUrl, "/seek/forward")}>⏩ Forward</button>
      <button onClick={() => sendCommand(pcUrl, "/volume/up")}>🔊 Vol+</button>
      <button onClick={() => sendCommand(pcUrl, "/volume/down")}>🔉 Vol-</button>
      <button onClick={() => sendCommand(pcUrl, "/subtitle/sync-plus")}>Sub +</button>
      <button onClick={() => sendCommand(pcUrl, "/subtitle/sync-minus")}>Sub -</button>
    </main>
  );
}