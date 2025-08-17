import React from "react";

export default function ModePicker({ onDaily, onCustom }) {
  return (
    <div className="page-center">
      <div className="center-card">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h2 className="m-0">Choose a Mode</h2>
        </div>

        <p className="lead">
          Play today’s shared challenge or create your own puzzle.
        </p>

        <div className="mode-actions mt-2 mb-2">
          <button className="btn btn-dark btn-big" onClick={onDaily}>
            🎯 Daily Challenge
          </button>
          <button className="btn btn-outline-dark btn-big" onClick={onCustom}>
            🧩 Custom Puzzle
          </button>
        </div>

        <div className="mode-note">
          The Daily Challenge gives everyone the same image and tile layout for
          today—great for comparing times with friends and family.
        </div>
      </div>
    </div>
  );
}
