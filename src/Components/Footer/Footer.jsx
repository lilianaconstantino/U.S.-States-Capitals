import React from 'react';
import styles from './Footer.module.css';
import Button from '../Button/Button';

function Footer() {
  return (
    <div className={styles.footerContainer}>
      <footer className={styles.buttonContainer}>
        <Button>Start</Button>
        <Button>Pop Quiz</Button>
        <Button>Library</Button>
      </footer>
    </div>
  );
}
  
  export default Footer; 