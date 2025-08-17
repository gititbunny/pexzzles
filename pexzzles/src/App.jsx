import React, { useEffect, useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/common/Header";
import NameForm from "./components/welcome/NameForm";
import ModePicker from "./components/welcome/ModePicker";
import DifficultyPicker from "./components/welcome/DifficultyPicker";
import ImageSearch from "./components/search/ImageSearch";
import ConfirmModal from "./components/common/ConfirmModal";
import PuzzleBoard from "./components/game/PuzzleBoard";
import ScoreboardDrawer from "./components/common/ScoreboardDrawer";
import DailyChallenge from "./components/daily/DailyChallenge";
import { FaTrophy } from "react-icons/fa";

function Flow() {
  const { name, settings } = useApp();

  const [step, setStep] = useState(name ? "mode" : "name");
  const [chosenImage, setChosenImage] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [scoresOpen, setScoresOpen] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(null);
  const [dailySeed, setDailySeed] = useState(null);

  useEffect(() => {
    if (!name) {
      setChosenImage(null);
      setConfirmOpen(false);
      setShuffleSeed(null);
      setDailySeed(null);
      setStep("name");
    }
  }, [name]);

  function handleSelect(img, maybeSeed = null) {
    setChosenImage(img);
    if (maybeSeed) {
      setShuffleSeed(maybeSeed);
      setDailySeed(maybeSeed);
    } else {
      setShuffleSeed(null);
      setDailySeed(null);
    }
    setConfirmOpen(true);
  }

  function startGame() {
    setConfirmOpen(false);
    setStep("game");
  }

  function startNewGame() {
    setChosenImage(null);
    setShuffleSeed(null);
    setDailySeed(null);
    setStep("mode");
  }

  const headerLayout =
    step === "mode" || step === "name" ? "centered" : "default";

  return (
    <>
      <Header layout={headerLayout} />

      {step === "name" && <NameForm onNext={() => setStep("mode")} />}

      {step === "mode" && (
        <div className="home-card-wrap">
          <ModePicker
            onDaily={() => setStep("daily")}
            onCustom={() => setStep("difficulty")}
          />
        </div>
      )}

      {step === "daily" && (
        <DailyChallenge
          grid={settings.grid}
          onSelect={handleSelect}
          onBack={() => setStep("mode")}
        />
      )}

      {step === "difficulty" && (
        <DifficultyPicker onPick={() => setStep("search")} />
      )}

      {step === "search" && <ImageSearch onSelect={handleSelect} />}

      {step === "game" && chosenImage && (
        <PuzzleBoard
          image={chosenImage}
          grid={settings.grid}
          shuffleSeed={shuffleSeed}
          dailySeed={dailySeed}
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
