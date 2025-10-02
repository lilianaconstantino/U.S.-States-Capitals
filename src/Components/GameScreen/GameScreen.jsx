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


  const navigate = useNavigate();

  // Fetch state data once
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
  if (stateData.length > 0) {
    const shuffled = [...stateData].sort(() => 0.5 - Math.random());
    setGameStates(shuffled);
    setCurrentRound(0);
    setCurrentState(shuffled[0]); // start with first capital
  }
}, [stateData]);


  const generateRandomCapital = () => {
    if (stateData.length === 0) return;
    const randomIndex = Math.floor(Math.random() * stateData.length);
    setCurrentState(stateData[randomIndex]);
    setClickedStates({});
    setHint([]); // reset hint text
    setHintStep(0);
  };

  const handleStateClick = (clickedState) => {
    if (!currentState) return;

    if (clickedState.name === currentState.name) {
    setClickedStates((prev) => ({
      ...prev,
      [clickedState.postalAbreviation]: "correct",
    }));
    setScore((prev) => prev + 1);
  } else {
    setClickedStates((prev) => ({
      ...prev,
      [clickedState.postalAbreviation]: "wrong",
    }));
  }

  setTimeout(() => {
    if (currentRound + 1 < gameStates.length) {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      setCurrentState(gameStates[nextRound]);
      setClickedStates({});
      setHint([]);
      setHintStep(0);
    } else {
      setShowResults(true); // end game
    }
  }, 1200);
};

  const generateHint = () => {
    if (!currentState) return;

    let hintMessage = "";

    switch (hintStep) {
      case 0:
        hintMessage = `The state starts with "${currentState.name.charAt(0)}".`;
        break;
      case 1:
        hintMessage = `Its abbreviation is "${currentState.postalAbreviation}".`;
        break;
      case 2:
        hintMessage = `The largest city is ${currentState.largestCity}.`;
        break;
      default:
        hintMessage = "No more hints available!";
        break;
    }
    if (hintStep < 3) {
     setHint((prev) => [...prev, hintMessage]); // append instead of replace
     setHintStep((prev) => prev + 1);
    }  else {
     setHint((prev) => [...prev, hintMessage]); // show "no more hints"
    }
  };

  return (
    <div>
      <header className={styles.headerContainer}>
        {currentState && (
          <div className={styles.capitalAndScore}>
            <div className={styles.capitalBox}>{currentState.capital}</div>
            <div className={styles.scoreBox}>
              Score: {score} / {gameStates.length}
          </div>
    </div>
  )}

  <Button>Menu</Button>
  <Button onClick={() => setShowQuitModal(true)}>Quit</Button>
  <QuitModal
    isOpen={showQuitModal}
    onConfirm={() => navigate("/")}
    onCancel={() => setShowQuitModal(false)}
  />

  <ResultsModal
    isOpen={showResults}
    score={score}
    totalRounds={gameStates.length}
    onClose={() => navigate("/")}
    onRestart={() => {
      setScore(0);
      setShowResults(false);
      setCurrentRound(0);
      setCurrentState(gameStates[0]);
    }}
  />
</header>

      <Map onStateClick={handleStateClick} clickedStates={clickedStates} />

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

    </div>
  );
}

export default GameScreen;