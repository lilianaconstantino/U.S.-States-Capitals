import React, { useState, useEffect } from 'react';
import styles from './GameScreen.module.css';
import Button from '../Button/Button';

function GameScreen({ allStatesData, onBackToMain }) {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentState, setCurrentState] = useState(null);
  
  const handleStartGame = () => {
    setIsGameStarted(true);
    // ... Any other game initialization logic ...
  };

  return(
    <div>
      {!isGameStarted && ( 
        <Button text="Start Game" onClick={handleStartGame} />
      )}

      {isGameStarted && (
        <div>
          <p>Game is now running!</p>
          {/* Now you can use allStatesData for your game logic */}
        </div>
      )}
    </div>
  );
};

export default GameScreen;