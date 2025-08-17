import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/common/Header";
import NameForm from "./components/welcome/NameForm";
import DifficultyPicker from "./components/welcome/DifficultyPicker";
import ImageSearch from "./components/search/ImageSearch";
import ConfirmModal from "./components/common/ConfirmModal";
import PuzzleBoard from "./components/game/PuzzleBoard";

function Flow() {
  const { name, settings } = useApp();
  const [step, setStep] = useState(name ? "difficulty" : "name");
  const [chosenImage, setChosenImage] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleSelect(img) {
    setChosenImage(img);
    setConfirmOpen(true);
  }

  function startGame() {
    setConfirmOpen(false);
    setStep("game");
  }

  function startNewGame() {
    // after win or user request → back to difficulty or search directly
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
