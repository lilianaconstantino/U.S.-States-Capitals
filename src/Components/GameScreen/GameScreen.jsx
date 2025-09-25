import React, { useState, useEffect } from 'react';
import styles from './GameScreen.module.css';
import Button from '../Button/Button';
import Map from '../Map/Map';

function GameScreen() {
  const [stateData, setStateData] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentState, setCurrentState] = useState(null);
  const [clickedStates, setClickedStates] = useState({});

  // Fetch state data once
  useEffect(() => {
    async function fetchStates() {
      try {
        const response = await fetch(
          "https://parseapi.back4app.com/classes/States?limit=50&order=name",
          {
            headers: {
              "X-Parse-Application-Id": "6a2NWTwXRlwc1BynCf46kYZG1VeWp170GYjZIeXK",
              "X-Parse-Master-Key": "WEYdiGWSz0gt91skfDe03wX9yqikQTpiVc9Vn2An",
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

  const generateRandomCapital = () => {
    const randomIndex = Math.floor(Math.random() * stateData.length);
    setCurrentState(stateData[randomIndex]);
    setIsGameStarted(true);
    setClickedStates({});
  };

  const handleStateClick = (clickedState) => {
    if (!currentState) return;

    if (clickedState.name === currentState.name) {
      setClickedStates((prev) => ({ ...prev, [clickedState.postalAbreviation]: "correct" }));
      setTimeout(generateRandomCapital, 1200);
    } else {
      setClickedStates((prev) => ({ ...prev, [clickedState.postalAbreviation]: "wrong" }));
    }
  };

  return(
    <div>
     <header className={styles.headerContainer}>
      <Button>Menu</Button>
      <Button onClick={generateRandomCapital}>Start Game</Button>
      <Button onClick={() => setIsGameStarted(false)}>Quit</Button>

      {isGameStarted && currentState && (
      <div className={styles.capitalBox}>
        {currentState.capital}
      </div>
  )}
    </header>

      <Map onStateClick={handleStateClick} clickedStates={clickedStates} />
     <Button className={styles.hintButton}>Hint</Button>
    </div>
  );
}


export default GameScreen;