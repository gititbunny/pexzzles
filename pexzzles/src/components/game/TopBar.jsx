import React from "react";
import { FaLightbulb } from "react-icons/fa";

function fmt(s) {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}

export default function TopBar({ seconds, correct, total, hintsLeft, onHint }) {
  return (
    <div className="topbar">
      <div className="stat">⏱ {fmt(seconds)}</div>
      <div className="stat">
        ✔ {correct} / {total}
      </div>
      <button
        className="btn btn-dark hint-btn"
        onClick={onHint}
        disabled={hintsLeft <= 0}
      >
        <FaLightbulb className="me-1" /> Hint ({hintsLeft})
      </button>
    </div>
  );
}
