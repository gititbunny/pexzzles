import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useApp } from "../../context/AppContext";
import { FaTrophy, FaTimes, FaTrash, FaCalendarDay } from "react-icons/fa";

function fmtTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function ScoreboardDrawer({ open, onClose }) {
  const { scoreboard, setScoreboard } = useApp();
  const [gridFilter, setGridFilter] = useState("all");
  const [dailyOnly, setDailyOnly] = useState(false);

  const filtered = useMemo(() => {
    let runs = scoreboard;
    if (gridFilter !== "all") {
      const g = Number(gridFilter);
      runs = runs.filter((run) => run.grid === g);
    }
    if (dailyOnly) {
      runs = runs.filter((run) => !!run.dailySeed);
    }
    return runs;
  }, [scoreboard, gridFilter, dailyOnly]);

  function clearAll() {
    if (!scoreboard.length) return;
    const ok = confirm("Clear all saved results? This cannot be undone.");
    if (ok) setScoreboard([]);
  }

  function deleteOne(id) {
    setScoreboard(scoreboard.filter((r) => r.id !== id));
  }

  if (!open) return null;

  const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.4)",
    zIndex: 1060,
  };
  const drawer = {
    position: "fixed",
    top: 0,
    right: 0,
    height: "100%",
    width: "420px",
    maxWidth: "100%",
    background: "#fff",
    boxShadow: "var(--shadow)",
    borderLeft: "1px solid var(--border)",
    zIndex: 1061,
    display: "flex",
    flexDirection: "column",
  };
  const header = {
    padding: "16px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
  const body = {
    padding: "12px 16px",
    overflowY: "auto",
    flex: 1,
  };

  return createPortal(
    <>
      <div
        style={overlay}
        onClick={onClose}
        aria-label="Close scoreboard overlay"
      />
      <aside
        style={drawer}
        aria-label="Scoreboard drawer"
        role="dialog"
        aria-modal="true"
      >
        <div style={header}>
          <div className="d-flex align-items-center gap-2">
            <FaTrophy aria-hidden className="text-warning" />
            <strong>Scoreboard</strong>
          </div>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
          >
            <FaTimes className="me-1" /> Close
          </button>
        </div>

        <div className="px-3 pt-3">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="gridFilter" className="form-label mb-0 me-2">
                Filter:
              </label>
              <select
                id="gridFilter"
                className="form-select form-select-sm"
                style={{ width: 120 }}
                value={gridFilter}
                onChange={(e) => setGridFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="2">2×2</option>
                <option value="4">4×4</option>
                <option value="6">6×6</option>
                <option value="8">8×8</option>
              </select>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="dailyOnly"
                checked={dailyOnly}
                onChange={(e) => setDailyOnly(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="dailyOnly">
                Daily only
              </label>
            </div>

            <button
              className="btn btn-sm btn-outline-danger ms-auto"
              onClick={clearAll}
              disabled={!scoreboard.length}
            >
              <FaTrash className="me-1" /> Clear all
            </button>
          </div>
        </div>

        <div style={body}>
          {filtered.length === 0 ? (
            <div className="text-soft">No saved results yet.</div>
          ) : (
            <ul className="list-unstyled m-0">
              {filtered.map((run) => (
                <li key={run.id} className="mb-3">
                  <div
                    className="d-flex gap-2 align-items-stretch"
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "var(--shadow)",
                      background: "#fff",
                    }}
                  >
                    <div style={{ width: 84, minWidth: 84 }}>
                      <div
                        className="square"
                        style={{
                          backgroundImage: `url(${run.image.thumbUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    </div>
                    <div className="flex-grow-1 p-2">
                      <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <div>
                          <strong>
                            {fmtTime(run.timeSeconds)} • {run.grid}×{run.grid}
                          </strong>{" "}
                          {run.dailySeed ? (
                            <span
                              className="badge text-bg-warning ms-1"
                              title="Daily Challenge"
                            >
                              <FaCalendarDay className="me-1" /> {run.dailySeed}
                            </span>
                          ) : null}
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteOne(run.id)}
                          title="Delete this entry"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <div className="text-soft" style={{ fontSize: 12 }}>
                        Score <strong>{run.score}</strong> • Moves{" "}
                        <strong>{run.moves}</strong> • Hints{" "}
                        <strong>{run.hintsUsed}</strong>
                      </div>
                      <div className="text-soft" style={{ fontSize: 12 }}>
                        {new Date(run.dateISO).toLocaleString()} •{" "}
                        {run.name || "Player"}
                      </div>
                      <div className="text-soft" style={{ fontSize: 12 }}>
                        Photo by{" "}
                        <a
                          href={run.image.authorUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {run.image.authorName}
                        </a>{" "}
                        on{" "}
                        <a
                          href="https://unsplash.com"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Unsplash
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>,
    document.body
  );
}
