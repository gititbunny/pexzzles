import React from "react";
import { useApp } from "../../context/AppContext";

export default function DifficultyPicker({ onPick }) {
  const { settings, setSettings } = useApp();

  function pick(grid) {
    setSettings({ ...settings, grid });
    onPick();
  }

  return (
    <div className="container-narrow">
      <h2 className="mb-3">Choose Difficulty</h2>
      <p className="text-soft">
        Pick a grid size that feels good. You can always try a harder one later.
      </p>
      <div className="d-flex grid-gap mt-3">
        <button className="btn btn-dark btn-big" onClick={() => pick(4)}>
          4 × 4
        </button>
        <button
          className="btn btn-outline-dark btn-big"
          onClick={() => pick(6)}
        >
          6 × 6
        </button>
        <button
          className="btn btn-outline-dark btn-big"
          onClick={() => pick(8)}
        >
          8 × 8
        </button>
      </div>
    </div>
  );
}
