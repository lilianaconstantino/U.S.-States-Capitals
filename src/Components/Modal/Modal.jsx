import React from 'react';
import styles from './Modal.module.css';
import Button from '../Button/Button';

function Modal({ isOpen, onClose, selectedState }) {
  if (!isOpen || !selectedState) {
    return null;
  }

  return (
  <div className={styles.modalBackdrop}>
    <div className={styles.modalContent}>
      <h2 className={styles.stateTitle}>{selectedState.name}</h2>

       <div className={styles.stateContent}>
      <p><span className={styles.label}>Capital:</span> {selectedState.capital}</p>
      <p><span className={styles.label}>Abbreviation:</span> {selectedState.postalAbreviation}</p>
      <p><span className={styles.label}>Population:</span> {selectedState.population?.toLocaleString()}</p>
      <p><span className={styles.label}>Largest City:</span> {selectedState.largestCity}</p>  
      <p><span className={styles.label}>Total Area:</span> {selectedState.totalAreaSquareMiles?.toLocaleString()} sq miles</p>
      <p><span className={styles.label}>Established:</span> {selectedState.established}</p>
       </div>
      
      <Button className={styles.closeButton} onClick={onClose}>Close</Button>
    </div>
  </div>
);
}

export default Modal;