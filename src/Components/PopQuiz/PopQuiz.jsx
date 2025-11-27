import React, { useState, useEffect } from "react";
import styles from "./PopQuiz.module.css";

function PopQuiz() {
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

  // Fetch states
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
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    }
    fetchStates();
  }, []);

  // Fetch capitals
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
      } catch (error) {
        console.error("Error fetching capitals:", error);
      }
    }
    fetchCapitals();
  }, []);

  // Merge capitals into states once both have loaded
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
  }, [capitalsData]); // only run when capitalsData changes

  // Shuffle states for gameplay
  useEffect(() => {
    if (stateData.length === 0) return;

    const shuffled = [...stateData].sort(() => 0.5 - Math.random());
    setGameStates(shuffled);
    setCurrentRound(0);
    setScore(0);
    setCurrentState(shuffled[0]);
  }, [stateData]);

  // Generate new question
  useEffect(() => {
    if (!currentState) return;

    // Pick 2 wrong options
    const wrongChoices = [];
    while (wrongChoices.length < 2) {
      const random = gameStates[Math.floor(Math.random() * gameStates.length)];
      if (random !== currentState && !wrongChoices.includes(random)) {
        wrongChoices.push(random);
      }
    }

    let allOptions =
      mode === "stateToCapital"
        ? [currentState.capital, wrongChoices[0].capital, wrongChoices[1].capital]
        : [currentState.name, wrongChoices[0].name, wrongChoices[1].name];

    // Shuffle options
    allOptions = allOptions.sort(() => Math.random() - 0.5);

    setOptions(allOptions);
    setAnswer(mode === "stateToCapital" ? currentState.capital : currentState.name);
  }, [currentState, mode, gameStates]);

  // Handle answer click
  function handleAnswerClick(option) {
    if (option === answer) setScore(score + 1);

    if (currentRound + 1 < gameStates.length) {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      setCurrentState(gameStates[nextRound]);
    } else {
      alert(`Game over! Your score: ${score + (option === answer ? 1 : 0)}`);
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

      {/* Mode switch */}
      <div className={styles.modeSwitch}>
        <button
          className={mode === "stateToCapital" ? styles.active : ""}
          onClick={() => setMode("stateToCapital")}
        >
          State ➜ Capital
        </button>
        <button
          className={mode === "capitalToState" ? styles.active : ""}
          onClick={() => setMode("capitalToState")}
        >
          Capital ➜ State
        </button>
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
        {options.map((opt, idx) => (
          <button key={idx} className={styles.optionButton} onClick={() => handleAnswerClick(opt)}>
            {opt}
          </button>
        ))}
      </div>

      {/* Score / Count */}
      <div className={styles.scoreBox}>
        Count: {currentRound + 1} / {gameStates.length} | Score: {score}
      </div>

      <button className={styles.resetButton} onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
}

export default PopQuiz;
