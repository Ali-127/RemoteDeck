"use client";

import PairingScanner from "@/components/PairingScanner";
import VolumeWheel from "@/components/VolumeWheel";
import { sendCommand } from "@/lib/api";
import { getSavedPcUrl } from "@/lib/pairing";
import { useState, type ReactNode } from "react";

type CommandButtonProps = {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  primary?: boolean;
};

function CommandButton({
  label,
  icon,
  onClick,
  primary = false,
}: CommandButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`remote-button ${primary ? "remote-button-primary" : ""}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default function Home() {
  const [pcUrl, setPcUrl] = useState<string | null>(() => getSavedPcUrl());
  const [lastAction, setLastAction] = useState("Ready");
  function command(path: string, label: string) {
    if (!pcUrl) return;
    setLastAction(label);
    void sendCommand(pcUrl, path).catch(() =>
      setLastAction("Connection failed"),
    );
  }
  if (!pcUrl) return <PairingScanner onPaired={setPcUrl} />;
  return (
    <main className="remote-page">
      <section className="remote-shell" aria-label="Remote controls">
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              RemoteDeck
            </p>
            <h1 className="mt-1 text-xl font-semibold text-white">
              Media remote
            </h1>
          </div>
          <span className="connection-pill">
            <span /> Connected
          </span>
        </header>
        <div className="grid gap-6 p-6 sm:grid-cols-[1fr_170px]">
          <div className="space-y-6">
            <section>
              <p className="section-label">Playback</p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <CommandButton
                  label="Back"
                  onClick={() => command("/seek/backward", "Seek backward")}
                  icon={<span className="text-2xl">↶</span>}
                />
                <CommandButton
                  label="Play / pause"
                  primary
                  onClick={() => command("/play-pause", "Play / pause")}
                  icon={<span className="text-3xl">▶</span>}
                />
                <CommandButton
                  label="Forward"
                  onClick={() => command("/seek/forward", "Seek forward")}
                  icon={<span className="text-2xl">↷</span>}
                />
              </div>
            </section>
            <section>
              <p className="section-label">Subtitles</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <CommandButton
                  label="Delay"
                  onClick={() =>
                    command("/subtitle/sync-minus", "Subtitle delay")
                  }
                  icon={<span className="text-xl">−</span>}
                />
                <CommandButton
                  label="Advance"
                  onClick={() =>
                    command("/subtitle/sync-plus", "Subtitle advance")
                  }
                  icon={<span className="text-xl">+</span>}
                />
              </div>
            </section>
          </div>
          <section className="volume-panel">
            <p className="section-label text-center">Volume</p>
            <div className="mt-4">
              <VolumeWheel
                onVolumeUp={() => command("/volume/up", "Volume up")}
                onVolumeDown={() => command("/volume/down", "Volume down")}
              />
            </div>
          </section>
        </div>
        <footer
          className="border-t border-white/10 px-6 py-4 text-center text-sm text-slate-400"
          aria-live="polite"
        >
          {lastAction}
        </footer>
      </section>
    </main>
  );
}
