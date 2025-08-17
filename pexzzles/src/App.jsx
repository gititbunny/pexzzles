import React, { useEffect, useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/common/Header";
import NameForm from "./components/welcome/NameForm";
import DifficultyPicker from "./components/welcome/DifficultyPicker";
import ImageSearch from "./components/search/ImageSearch";
import ConfirmModal from "./components/common/ConfirmModal";
import PuzzleBoard from "./components/game/PuzzleBoard";
import ScoreboardDrawer from "./components/common/ScoreboardDrawer";
import { FaTrophy } from "react-icons/fa";

function Flow() {
  const { name, settings } = useApp();
  const [step, setStep] = useState(name ? "difficulty" : "name");
  const [chosenImage, setChosenImage] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [scoresOpen, setScoresOpen] = useState(false);

  useEffect(() => {
    if (!name) {
      setChosenImage(null);
      setConfirmOpen(false);
      setStep("name");
    }
  }, [name]);

  function handleSelect(img) {
    setChosenImage(img);
    setConfirmOpen(true);
  }

  function startGame() {
    setConfirmOpen(false);
    setStep("game");
  }

  function startNewGame() {
    setChosenImage(null);
    setStep("difficulty");
  }

  return (
    <>
      <Header />

      {step === "name" && <NameForm onNext={() => setStep("difficulty")} />}

      {step === "difficulty" && (
        <DifficultyPicker onPick={() => setStep("search")} />
      )}

      {step === "search" && <ImageSearch onSelect={handleSelect} />}

      {step === "game" && chosenImage && (
        <PuzzleBoard
          image={chosenImage}
          grid={settings.grid}
          onNewGame={startNewGame}
        />
      )}

      <ConfirmModal
        open={confirmOpen}
        image={chosenImage}
        grid={settings.grid}
        onStart={startGame}
        onCancel={() => setConfirmOpen(false)}
      />

      <button
        className="btn btn-dark fab-scoreboard d-flex align-items-center"
        onClick={() => setScoresOpen(true)}
        title="Open scoreboard"
        aria-label="Open scoreboard"
      >
        <FaTrophy className="me-2" /> Scores
      </button>

      <ScoreboardDrawer
        open={scoresOpen}
        onClose={() => setScoresOpen(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Flow />
    </AppProvider>
  );
}
