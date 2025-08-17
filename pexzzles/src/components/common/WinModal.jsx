import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Confetti from "react-confetti";

function randMsg(name, timeStr, grid) {
  const msgs = [
    `Whooray, ${name}! You solved it in ${timeStr}. You’re a smarty pants!`,
    `Legendary focus, ${name}! ${timeStr} on a ${grid}×${grid} board!`,
    `Brilliant work, ${name}! ${timeStr} flat—keep that brain buff!`,
    `You did that, ${name}! ${timeStr} and all tiles aligned.`,
  ];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

function fmt(s) {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
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
  const [dims, setDims] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });
  useEffect(() => {
    function onResize() {
      setDims({ w: window.innerWidth, h: window.innerHeight });
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!open) return null;
  const timeStr = fmt(seconds);

  return createPortal(
    <>
      <Confetti
        width={dims.w}
        height={dims.h}
        numberOfPieces={220}
        recycle={false}
      />
      <div
        className="modal fade show"
        style={{ display: "block", background: "rgba(0,0,0,.5)" }}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: "16px" }}>
            <div className="modal-header">
              <h5 className="modal-title">Puzzle Solved 🎉</h5>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: "18px", fontWeight: 700 }}>
                {randMsg(name, timeStr, grid)}
              </p>
              <ul className="mb-0">
                <li>
                  Time: <strong>{timeStr}</strong>
                </li>
                <li>
                  Grid:{" "}
                  <strong>
                    {grid}×{grid}
                  </strong>
                </li>
                <li>
                  Moves: <strong>{moves}</strong>
                </li>
                <li>
                  Hints used: <strong>{hintsUsed}</strong>
                </li>
              </ul>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={onNew}>
                Start new game
              </button>
              <button className="btn btn-dark" onClick={onSave}>
                Save result
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
