import React from 'react';
import styles from './Header.module.css';

function Header ({}) {
  
  return(
    <div className={styles.headerContainer}>
    <header className={styles.header}>
      <h1>U.S. States & Maps</h1>
    </header>
    </div>
  );
};

export default Header; 