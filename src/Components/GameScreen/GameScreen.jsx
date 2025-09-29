import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GameScreen.module.css";
import Button from "../Button/Button";
import Map from "../Map/Map";

function GameScreen() {
  const [stateData, setStateData] = useState([]);
  const [currentState, setCurrentState] = useState(null);
  const [clickedStates, setClickedStates] = useState({});
  const [hint, setHint] = useState([]);
  const [hintStep, setHintStep] = useState(0);

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

  // Start game automatically once data is loaded
  useEffect(() => {
    if (stateData.length > 0) {
      generateRandomCapital();
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
      setTimeout(generateRandomCapital, 1200);
    } else {
      setClickedStates((prev) => ({
        ...prev,
        [clickedState.postalAbreviation]: "wrong",
      }));
    }
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
          <div className={styles.capitalBox}>{currentState.capital}</div>
        )}

        <Button>Menu</Button>
        <Button onClick={() => navigate("/")}>Quit</Button>
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