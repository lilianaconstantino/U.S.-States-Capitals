import React from 'react';
import styles from './Header.module.css';

function Header ({}) {
  
  return(
    <div className={styles.headerContainer}>
    <header className={styles.header} >
      <h1>States & Capitals</h1>
    </header>
    </div>
  );
};

export default Header; 

