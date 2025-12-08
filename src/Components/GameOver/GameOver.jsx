import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import styles from "./Footer.module.css";

function GameOver() {
  const navigate = useNavigate();

  return (
      <div className={styles.resultsOverlay}>
      <div className={styles.resultsContent}>
        <h2>Game Over!</h2>
        <p>
          You scored <strong>{score}</strong> out of{" "}
          <strong>{totalRounds}</strong>
        </p>

        <div className={styles.actions}>
          <Button onClick={onRestart}>Play Again</Button>
          <Button onClick={onViewAnswers}>View Answers on Map</Button>
          <Button onClick={onClose}>Exit</Button>
        </div>
      </div>
    </div>
  );
}

export default GameOver;
