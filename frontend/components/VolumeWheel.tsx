"use client";

import { useRef, useState } from "react";

type VolumeWheelProps = {
  onVolumeUp: () => void;
  onVolumeDown: () => void;
};

const DRAG_STEP_PX = 18;

export default function VolumeWheel({
  onVolumeUp,
  onVolumeDown,
}: VolumeWheelProps) {
  const [active, setActive] = useState(false);
  const lastY = useRef<number | null>(null);
  const carriedDistance = useRef(0);

  function resetInteraction() {
    setActive(false);
    lastY.current = null;
    carriedDistance.current = 0;
  }

  function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (lastY.current === null) return;
    carriedDistance.current += lastY.current - event.clientY;
    lastY.current = event.clientY;

    while (Math.abs(carriedDistance.current) >= DRAG_STEP_PX) {
      if (carriedDistance.current > 0) {
        onVolumeUp();
        carriedDistance.current -= DRAG_STEP_PX;
      } else {
        onVolumeDown();
        carriedDistance.current += DRAG_STEP_PX;
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        aria-label="Volume wheel. Drag up to increase volume and down to decrease volume."
        className={`volume-wheel ${active ? "volume-wheel-active" : ""}`}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          lastY.current = event.clientY;
          setActive(true);
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={resetInteraction}
        onPointerCancel={resetInteraction}
        onWheel={(event) => {
          event.preventDefault();
          if (event.deltaY < 0) onVolumeUp();
          if (event.deltaY > 0) onVolumeDown();
        }}
      >
        <span className="volume-wheel-ridges" aria-hidden="true" />
        <span className="volume-wheel-center" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M4 10v4h4l5 4V6L8 10H4Z" />
            <path d="M16 9.5a4 4 0 0 1 0 5" />
            <path d="M18.8 7a7.5 7.5 0 0 1 0 10" />
          </svg>
        </span>
      </button>
      <p className="text-center text-xs font-medium tracking-wide text-slate-400">
        Drag or scroll
      </p>
      <div className="grid w-full grid-cols-2 gap-2">
        <button
          type="button"
          className="mini-control"
          onClick={onVolumeDown}
          aria-label="Volume down"
        >
          −
        </button>
        <button
          type="button"
          className="mini-control"
          onClick={onVolumeUp}
          aria-label="Volume up"
        >
          +
        </button>
      </div>
    </div>
  );
}
