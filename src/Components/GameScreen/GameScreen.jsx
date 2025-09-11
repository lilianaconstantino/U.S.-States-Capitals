import React, { useState, useEffect } from 'react';
import styles from './GameScreen.module.css';
import Button from '../Button/Button';
import Map from '../Map/Map';

function GameScreen() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentState, setCurrentState] = useState(null);
  
  const handleStartGame = () => {
    setIsGameStarted(true);
    // ... Any other game initialization logic ...
  };

  return(
     <div>
      <h1>Game Screen</h1>
      <p>This will be your game area with the map and capital guessing.</p>
    </div>

  );
};

export default GameScreen;