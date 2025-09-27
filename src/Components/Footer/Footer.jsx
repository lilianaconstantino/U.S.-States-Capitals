import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import styles from "./Footer.module.css";

function Footer() {
  const navigate = useNavigate();

  return (
    <div className={styles.footerContainer}>
      <footer className={styles.buttonContainer}>
        <Button onClick={() => navigate("/gamescreen")}>Start</Button>
        <Button>Pop Quiz</Button>
        <Button>Library</Button>
      </footer>
    </div>
  );
}

export default Footer;
