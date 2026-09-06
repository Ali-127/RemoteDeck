"use client"
import { sendCommand } from "@/lib/api";

export default function Home() {
  console.log(sendCommand)
  return (
    <main className="grid grid-cols-2 gap-4 p-4">
      <button onClick={() => sendCommand("/play-pause")}>⏯ Play/Pause</button>
      <button onClick={() => sendCommand("/seek/backward")}>⏪ Back</button>
      <button onClick={() => sendCommand("/seek/forward")}>⏩ Forward</button>
      <button onClick={() => sendCommand("/volume/up")}>🔊 Vol+</button>
      <button onClick={() => sendCommand("/volume/down")}>🔉 Vol-</button>
      <button onClick={() => sendCommand("/subtitle/sync-plus")}>Sub +</button>
      <button onClick={() => sendCommand("/subtitle/sync-minus")}>Sub -</button>
    </main>
  );
}