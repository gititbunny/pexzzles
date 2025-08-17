import React, { useEffect, useMemo, useState } from "react";
import "../../styles/game.css";
import TopBar from "./TopBar";
import Tile from "./Tile";
import useTimer from "../../hooks/useTimer";
import HintModal from "../common/HintModal";
import WinModal from "../common/WinModal";
import { useApp } from "../../context/AppContext";

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
}

function shuffleWithRng(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleRandom(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PuzzleBoard({
  image,
  grid,
  onNewGame,
  shuffleSeed = null,
  dailySeed = null,
}) {
  const total = grid * grid;
  const indexes = useMemo(
    () => Array.from({ length: total }, (_, i) => i),
    [total]
  );
  const { name, scoreboard, setScoreboard } = useApp();

  const [order, setOrder] = useState(() => shuffleRandom(indexes));
  const [selected, setSelected] = useState(null);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [hintOpen, setHintOpen] = useState(false);
  const [moves, setMoves] = useState(0);
  const [winOpen, setWinOpen] = useState(false);

  const correct = useMemo(
    () => order.reduce((sum, idx, i) => sum + (idx === i ? 1 : 0), 0),
    [order]
  );

  const { seconds, startTimer, stopTimer, resetTimer } = useTimer(true);

  useEffect(() => {
    let newOrder;
    if (shuffleSeed) {
      const seedInt = hashSeed(`${shuffleSeed}:${image?.id || ""}:${grid}`);
      const rng = mulberry32(seedInt);
      newOrder = shuffleWithRng(indexes, rng);
    } else {
      newOrder = shuffleRandom(indexes);
    }
    setOrder(newOrder);
    setSelected(null);
    setHintsLeft(3);
    setMoves(0);
    resetTimer();
    startTimer();
  }, [image?.id, grid, shuffleSeed]);

  useEffect(() => {
    if (correct === total) {
      stopTimer();
      setTimeout(() => setWinOpen(true), 150);
    }
  }, [correct, total]);

  function swap(i, j) {
    if (i === j) return;
    setOrder((prev) => {
      const a = prev.slice();
      [a[i], a[j]] = [a[j], a[i]];
      return a;
    });
    setMoves((m) => m + 1);
  }

  function onTileClick(i) {
    if (selected === null) setSelected(i);
    else {
      swap(selected, i);
      setSelected(null);
    }
  }

  function dragStart(e, i) {
    e.dataTransfer.setData("text/plain", String(i));
  }
  function dragOver(e) {
    e.preventDefault();
  }
  function dropped(e, i) {
    e.preventDefault();
    const from = Number(e.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(from)) swap(from, i);
  }

  function showHint() {
    if (hintsLeft <= 0) return;
    setHintOpen(true);
    setHintsLeft((n) => n - 1);
    setTimeout(() => setHintOpen(false), 4000);
  }

  function onSave() {
    const run = {
      id: crypto.randomUUID(),
      name,
      grid,
      timeSeconds: seconds,
      moves,
      hintsUsed: 3 - hintsLeft,
      dateISO: new Date().toISOString(),
      image: {
        id: image.id,
        authorName: image.authorName,
        authorUrl: image.authorUrl,
        thumbUrl: image.thumbUrl,
        fullUrl: image.fullUrl,
      },
      score: Math.max(
        0,
        grid * grid * 100 - seconds * 2 - moves * 1 - (3 - hintsLeft) * 50
      ),
      dailySeed: dailySeed || null,
    };
    setScoreboard([run, ...scoreboard]);
  }

  function onCloseWin() {
    setWinOpen(false);
  }

  function onStartNew() {
    setWinOpen(false);
    onNewGame();
  }

  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${grid}, 1fr)`,
      gridTemplateRows: `repeat(${grid}, 1fr)`,
    }),
    [grid]
  );

  return (
    <div className="container-narrow board-wrap">
      <TopBar
        seconds={seconds}
        correct={correct}
        total={total}
        hintsLeft={hintsLeft}
        onHint={showHint}
      />

      <div className="board" style={gridStyle}>
        {order.map((correctIndex, i) => (
          <Tile
            key={`${correctIndex}-${i}`}
            index={i}
            correctIndex={correctIndex}
            grid={grid}
            bgUrl={image.fullUrl}
            onClick={() => onTileClick(i)}
            onDragStart={(e) => dragStart(e, i)}
            onDragOver={dragOver}
            onDrop={(e) => dropped(e, i)}
            selected={selected === i}
          />
        ))}
      </div>

      <div className="mt-2 text-soft" style={{ fontSize: "12px" }}>
        Photo by{" "}
        <a href={image.authorUrl} target="_blank" rel="noreferrer">
          {image.authorName}
        </a>{" "}
        on{" "}
        <a href="https://unsplash.com" target="_blank" rel="noreferrer">
          Unsplash
        </a>
        {dailySeed ? (
          <>
            {" "}
            • Daily Challenge: <strong>{dailySeed}</strong>
          </>
        ) : null}
      </div>

      <HintModal
        open={hintOpen}
        image={image}
        grid={grid}
        onCancel={() => setHintOpen(false)}
      />

      <WinModal
        open={winOpen}
        name={name || "Friend"}
        seconds={seconds}
        grid={grid}
        moves={moves}
        hintsUsed={3 - hintsLeft}
        onSave={onSave}
        onClose={onCloseWin}
        onNew={onStartNew}
      />
    </div>
  );
}
