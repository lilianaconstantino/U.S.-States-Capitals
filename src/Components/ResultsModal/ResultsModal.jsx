import React from "react";
import styles from "./ResultsModal.module.css";
import Button from "../Button/Button";

function ResultsModal({ isOpen, score, totalRounds, onClose, onRestart }) {
  if (!isOpen) return null;

  return (
    <div className={styles.resultsOverlay}>
      <div className={styles.resultsContent}>
        <h2>Game Over!</h2>
        <p>
          You scored <strong>{score}</strong> out of <strong>{totalRounds}</strong>
        </p>
        <div className={styles.actions}>
          <Button onClick={onRestart}>Play Again</Button>
          <Button onClick={onClose}>Exit</Button>
        </div>
      </div>
    </div>
  );
}

export default ResultsModal;