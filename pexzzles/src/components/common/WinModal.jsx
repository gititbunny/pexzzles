import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaSave, FaRedo } from "react-icons/fa";

function fmtTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function randomCongrats(name, time) {
  const msgs = [
    `Puzzle Solved 🎉\nBrilliant work, ${name}! ${time} flat—keep that brain buff!`,
    `Whooray ${name}!!! You solved this puzzle in ${time}. You are such a smarty pants!!!`,
    `👏 Well done, ${name}! Finished in ${time}. Your brain is on fire!`,
    `🎯 Amazing ${name}! You cracked it in ${time}. Keep up the sharp work!`,
  ];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

export default function WinModal({
  open,
  name,
  seconds,
  grid,
  moves,
  hintsUsed,
  onSave,
  onNew,
}) {
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(false), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  if (!open) return null;

  const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.5)",
    zIndex: 1050,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const modal = {
    background: "#fff",
    borderRadius: "16px",
    maxWidth: "480px",
    width: "100%",
    padding: "24px",
    position: "relative",
    boxShadow: "var(--shadow)",
  };
  const closeBtn = {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  };

  function handleSave() {
    onSave();
    setToast(true);
  }

  return createPortal(
    <>
      <div style={overlay} role="dialog" aria-modal="true">
        <div style={modal}>
          <button style={closeBtn} onClick={onNew} aria-label="Close">
            <FaTimes />
          </button>

          <h3 className="mb-3">Puzzle Solved 🎉</h3>
          <p style={{ whiteSpace: "pre-line" }}>
            {randomCongrats(name, fmtTime(seconds))}
          </p>

          <ul className="list-unstyled text-soft" style={{ fontSize: 14 }}>
            <li>
              ⏱️ Time: <strong>{fmtTime(seconds)}</strong>
            </li>
            <li>
              🧩 Grid:{" "}
              <strong>
                {grid}×{grid}
              </strong>
            </li>
            <li>
              🔄 Moves: <strong>{moves}</strong>
            </li>
            <li>
              💡 Hints used: <strong>{hintsUsed}</strong>
            </li>
          </ul>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button className="btn btn-outline-dark" onClick={handleSave}>
              <FaSave className="me-1" /> Save Game
            </button>
            <button className="btn btn-dark" onClick={onNew}>
              <FaRedo className="me-1" /> Start New Game
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#222",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            zIndex: 1100,
            boxShadow: "var(--shadow)",
          }}
        >
          ✅ Game Saved!
        </div>
      )}
    </>,
    document.body
  );
}
