import React from 'react';
import styles from './Footer.module.css';

function Footer () {
  
    return(
      <div className= {styles.footerContainer}>
      <footer className= {styles.buttonContainer}>
        <button className = {styles.footerButtons}>
          Start
        </button>
        <button className = {styles.footerButtons}>
         Pop Quiz
        </button>
        <button className = {styles.footerButtons}>
            Library
        </button>
      </footer>
      </div>
     
    );
  };
  
  export default Footer; 