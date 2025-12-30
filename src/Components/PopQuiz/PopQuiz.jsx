import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PopQuiz.module.css";
import Button from "../Button/Button";
import QuitModal from "../QuitModal/QuitModal";

function PopQuiz() {
  const navigate = useNavigate();
  const [showQuitModal, setShowQuitModal] = useState(false);

  // Modes: "stateToCapital" or "capitalToState"
  const [mode, setMode] = useState("stateToCapital");

  // Data
  const [stateData, setStateData] = useState([]);
  const [capitalsData, setCapitalsData] = useState([]);
  const [gameStates, setGameStates] = useState([]);

  // Quiz state
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [currentState, setCurrentState] = useState(null);
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState(null);

  // 1. Fetch STATES
  useEffect(() => {
    async function fetchStates() {
      try {
        const response = await fetch(
          "https://parseapi.back4app.com/classes/States?limit=50&order=name",
          {
            headers: {
              "X-Parse-Application-Id":
                "6a2NWTwXRlwc1BynCf46kYZG1VeWp170GYjZIeXK",
              "X-Parse-Master-Key":
                "WEYdiGWSz0gt91skfDe03wX9yqikQTpiVc9Vn2An",
            },
          }
        );
        const data = await response.json();
        setStateData(data.results);
      } catch (e) {
        console.error("Error fetching states:", e);
      }
    }
    fetchStates();
  }, []);

  // 2. Fetch CAPITALS
  useEffect(() => {
    async function fetchCapitals() {
      try {
        const response = await fetch(
          "https://parseapi.back4app.com/classes/Capitals?limit=60",
          {
            headers: {
              "X-Parse-Application-Id":
                "6a2NWTwXRlwc1BynCf46kYZG1VeWp170GYjZIeXK",
              "X-Parse-Master-Key":
                "WEYdiGWSz0gt91skfDe03wX9yqikQTpiVc9Vn2An",
            },
          }
        );
        const data = await response.json();
        setCapitalsData(data.results);
      } catch (e) {
        console.error("Error fetching capitals:", e);
      }
    }
    fetchCapitals();
  }, []);

  // 3. Merge capitals into states
  useEffect(() => {
    if (stateData.length === 0 || capitalsData.length === 0) return;

    const capitalLookup = capitalsData.reduce((acc, item) => {
      acc[item.stateAbbreviation] = item.capital;
      return acc;
    }, {});

    const merged = stateData.map((state) => ({
      ...state,
      capital: capitalLookup[state.postalAbreviation] || "Unknown",
    }));

    setStateData(merged);
  }, [capitalsData]);

  // 4. Shuffle game states when stateData changes
  useEffect(() => {
    if (stateData.length === 0) return;

    const shuffled = [...stateData].sort(() => Math.random() - 0.5);
    setGameStates(shuffled);
    setCurrentRound(0);
    setScore(0);
    setCurrentState(shuffled[0]);
  }, [stateData]);

  // 5. Reset when mode changes
  useEffect(() => {
    if (gameStates.length === 0) return;

    const randomState =
      gameStates[Math.floor(Math.random() * gameStates.length)];

    setCurrentState(randomState);
    setCurrentRound(0);
    setScore(0);
  }, [mode]);

  // 6. Generate options for current question
  useEffect(() => {
    if (!currentState || gameStates.length === 0) return;

    const wrongChoices = [];
    while (wrongChoices.length < 2) {
      const r = gameStates[Math.floor(Math.random() * gameStates.length)];
      if (r !== currentState && !wrongChoices.includes(r)) wrongChoices.push(r);
    }

    let opts =
      mode === "stateToCapital"
        ? [currentState.capital, wrongChoices[0].capital, wrongChoices[1].capital]
        : [currentState.name, wrongChoices[0].name, wrongChoices[1].name];

    opts = opts.sort(() => Math.random() - 0.5);

    setOptions(opts);
    setAnswer(mode === "stateToCapital" ? currentState.capital : currentState.name);
  }, [currentState, mode, gameStates]);

  // Handle selecting an answer
  function handleAnswerClick(opt) {
    if (opt === answer) setScore((s) => s + 1);

    if (currentRound + 1 < gameStates.length) {
      const next = currentRound + 1;
      setCurrentRound(next);
      setCurrentState(gameStates[next]);
    } else {
      alert(`Game over! Score: ${score + (opt === answer ? 1 : 0)}`);
      resetGame();
    }
  }

  function resetGame() {
    setScore(0);
    setCurrentRound(0);
    if (gameStates.length > 0) setCurrentState(gameStates[0]);
  }

  return (
    <div className={styles.quizContainer}>
      <h1>U.S. States Pop Quiz 🇺🇸</h1>

      {/* Mode Switch */}
      <div className={styles.modeSwitch}>
        <Button
          className={mode === "stateToCapital" ? styles.active : ""}
          onClick={() => setMode("stateToCapital")}
        >
          State ➜ Capital
        </Button>

        <Button
          className={mode === "capitalToState" ? styles.active : ""}
          onClick={() => setMode("capitalToState")}
        >
          Capital ➜ State
        </Button>
      </div>

      {/* Question */}
      {currentState && (
        <div className={styles.questionBox}>
          {mode === "stateToCapital" ? (
            <p>
              <strong>What is the capital of:</strong> {currentState.name}?
            </p>
          ) : (
            <p>
              <strong>{currentState.capital}</strong> is the capital of which state?
            </p>
          )}
        </div>
      )}

      {/* Options */}
      <div className={styles.optionsGrid}>
        {options.map((opt, i) => (
          <Button
            key={i}
            className={styles.optionButton}
            onClick={() => handleAnswerClick(opt)}
          >
            {opt}
          </Button>
        ))}
      </div>

      {/* Score */}
      <div className={styles.scoreBox}>
        Count: {currentRound + 1} / {gameStates.length} | Score: {score}
      </div>

      {/* Action buttons */}
      <div className={styles.actionButtons}>
        <Button className={styles.resetButton} onClick={resetGame}>
          Reset Game
        </Button>
        <Button onClick={() => setShowQuitModal(true)}>Quit</Button>
      </div>

      {/* Quit modal */}
      <QuitModal
        isOpen={showQuitModal}
        onConfirm={() => navigate("/")}
        onCancel={() => setShowQuitModal(false)}
      />
    </div>
  );
}

export default PopQuiz;
