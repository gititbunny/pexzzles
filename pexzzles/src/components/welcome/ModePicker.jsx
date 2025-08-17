import React from "react";

export default function ModePicker({ onDaily, onCustom }) {
  return (
    <div className="container-narrow">
      <h2 className="mb-3">Choose a Mode</h2>
      <p className="text-soft">
        Play today’s shared challenge or create your own puzzle.
      </p>

      <div className="d-flex grid-gap mt-3 flex-wrap">
        <button className="btn btn-dark btn-big" onClick={onDaily}>
          🎯 Daily Challenge
        </button>
        <button className="btn btn-outline-dark btn-big" onClick={onCustom}>
          🧩 Custom Puzzle
        </button>
      </div>

      <div className="mt-3 text-soft" style={{ fontSize: 14 }}>
        The Daily Challenge gives everyone the same image and tile layout for
        today—great for comparing times with friends and family.
      </div>
    </div>
  );
}
