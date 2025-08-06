import React from 'react'
import styles from './StateInfoCard.module.css'

const Card = () => (
    <div className={styles.card}>
      <h2>Card Component</h2>

       <div className={styles.backgroundBox}>State, PA</div>
       <div className={styles.statsbox}>

        <ul className={styles.listStyle}>
            <li>
                <strong>
                    Postal Abbreviation:
                </strong>
            </li>
            <li>
                <strong>
                    Capital:
                </strong>
            </li>
            <li>
                <strong>
                    Largest City:
                </strong>
            </li>
            <li>
                <strong>
                    Population:
                </strong>
            </li>
            <li>
                <strong>
                    Total area Km: 
                </strong>
            </li>
            <li>
                <strong>
                    Total area miles:  
                </strong>
            </li>
            <li>
                <strong>
                    Year Established:   
                </strong>
            </li>
        </ul>




       </div>
       
    </div>
    
  );


export default Card;