import React from "react";
import { useApp } from "../../context/AppContext";

export default function DifficultyPicker({ onPick }) {
  const { settings, setSettings } = useApp();
  const options = [2, 4, 6, 8];

  function pick(grid) {
    setSettings({ ...settings, grid });
    onPick();
  }

  return (
    <div className="container-narrow">
      <h2 className="mb-3">Choose Difficulty</h2>
      <p className="text-soft">
        Pick a grid size (rows × columns). Start with 2×2 for an easy warm game.
      </p>

      <div className="d-flex grid-gap mt-3 flex-wrap">
        {options.map((g) => {
          const isActive = settings.grid === g;
          const cls = isActive
            ? "btn btn-dark btn-big"
            : "btn btn-outline-dark btn-big";
          return (
            <button
              key={g}
              className={cls}
              onClick={() => pick(g)}
              aria-pressed={isActive}
            >
              {g} × {g}
            </button>
          );
        })}
      </div>
    </div>
  );
}
