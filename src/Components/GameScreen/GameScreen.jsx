import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GameScreen.module.css";
import Button from "../Button/Button";
import Map from "../Map/Map";
import ResultsModal from "../ResultsModal/ResultsModal";
import QuitModal from "../QuitModal/QuitModal";

function GameScreen() {
  const [stateData, setStateData] = useState([]);
  const [currentState, setCurrentState] = useState(null);
  const [clickedStates, setClickedStates] = useState({});
  const [hint, setHint] = useState([]);
  const [hintStep, setHintStep] = useState(0);
  const [gameStates, setGameStates] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [showLabeledMap, setShowLabeledMap] = useState(false);
  const [capitalsData, setCapitalsData] = useState([]);

  const navigate = useNavigate();

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

  useEffect(() => {
  async function fetchCapitals() {
    try {
      const response = await fetch(
        "https://parseapi.back4app.com/classes/Capitals?limit=60",
        {
          headers: {
            "X-Parse-Application-Id": "6a2NWTwXRlwc1BynCf46kYZG1VeWp170GYjZIeXK",
            "X-Parse-Master-Key": "WEYdiGWSz0gt91skfDe03wX9yqikQTpiVc9Vn2An",
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

  // Shuffle states for gameplay
  useEffect(() => {
    if (stateData.length > 0) {
      const shuffled = [...stateData].sort(() => 0.5 - Math.random());
      setGameStates(shuffled);
      setCurrentRound(0);
      setCurrentState(shuffled[0]);
    }
  }, [stateData]);

  // Handle state click
  const handleStateClick = (clickedState) => {
    if (!currentState) return;

    const isCorrect = clickedState.name === currentState.name;

    setResults((prev) => [
      ...prev,
      {
        state: currentState.name,
        capital: currentState.capital,
        userAnswer: clickedState.name,
        correct: isCorrect,
      },
    ]);

    setClickedStates((prev) => ({
      ...prev,
      [clickedState.postalAbreviation]: isCorrect ? "correct" : "wrong",
    }));

    if (isCorrect) setScore((prev) => prev + 1);

    setTimeout(() => {
      if (currentRound + 1 < gameStates.length) {
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        setCurrentState(gameStates[nextRound]);
        setClickedStates({});
        setHint([]);
        setHintStep(0);
      } else {
        setShowResults(true);
      }
    }, 800);
  };

  const generateHint = () => {
    if (!currentState) return;
    const hints = [
      `The state starts with "${currentState.name.charAt(0)}".`,
      `Its abbreviation is "${currentState.postalAbreviation}".`,
      `The largest city is ${currentState.largestCity}.`,
    ];
    setHint((prev) => [
      ...prev,
      hints[hintStep] || "No more hints available!",
    ]);
    setHintStep((prev) => prev + 1);
  };

  return (
    <div className={styles.gameContainer}>
      <header className={styles.headerContainer}>
        {/* Only show capital and score during game */}
        {currentState && !showLabeledMap && (
          <div className={styles.capitalAndScore}>
            <div className={styles.capitalBox}>{currentState.capital}</div>
            <div className={styles.scoreBox}>
              Count: {currentRound + 1} / {gameStates.length} | Score: {score}
            </div>
          </div>
        )}

        <div className={styles.menuButtons}>
          <Button>Menu</Button>
          <Button onClick={() => setShowQuitModal(true)}>Quit</Button>
        </div>

        <QuitModal
          isOpen={showQuitModal}
          onConfirm={() => navigate("/")}
          onCancel={() => setShowQuitModal(false)}
        />

        <ResultsModal
          isOpen={showResults}
          score={score}
          totalRounds={gameStates.length}
          results={results}
          onClose={() => navigate("/")}
          onRestart={() => {
            setScore(0);
            setShowResults(false);
            setShowLabeledMap(false);
            setCurrentRound(0);
            setCurrentState(gameStates[0]);
            setResults([]);
          }}
          onViewAnswers={() => {
            setShowResults(false);
            setShowLabeledMap(true);
          }}
        />
      </header>

      {/* The map — color states based on game or results */}
      <Map
        onStateClick={handleStateClick}
        clickedStates={clickedStates}
        results={results}
        showLabels={showLabeledMap}
        capitalsData={capitalsData}
      />


      {/* Hint section (only during the game) */}
      {!showLabeledMap && (
        <>
          <Button className={styles.hintButton} onClick={generateHint}>
            Hint
          </Button>
          {hint.length > 0 && (
            <div className={styles.hintBox}>
              {hint.map((h, index) => (
                <div key={index}>{h}</div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default GameScreen;
