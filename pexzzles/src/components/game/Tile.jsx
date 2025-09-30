import React from "react";

export default function Tile({
  index,
  correctIndex,
  bgUrl,
  grid,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
  selected,
}) {
  const row = Math.floor(correctIndex / grid);
  const col = correctIndex % grid;
  const bgSize = `${grid * 100}% ${grid * 100}%`;
  const bgPos = `${(col * 100) / (grid - 1)}% ${(row * 100) / (grid - 1)}%`;

  const isCorrect = index === correctIndex;

  return (
    <div
      className={`tile ${isCorrect ? "correct" : ""}`}
      tabIndex={0}
      aria-label={`Tile ${index + 1} of ${grid * grid} ${
        isCorrect ? "correct" : "not correct"
      }`}
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{ outline: selected ? "3px solid rgba(238, 94, 7,.7)" : "none" }}
    >
      <div
        className="tile-inner"
        style={{
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: bgSize,
          backgroundPosition: bgPos,
        }}
      />
    </div>
  );
}
