import React from "react";
import styles from './Modal.module.css';

function Modal({ isOpen, onClose, selectedState }) {
  if (!isOpen || !selectedState) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>{selectedState.name}</h2>
        
        <p>Capital: {selectedState.capital}</p>
        <p>Abbreviation: {selectedState.postalAbreviation}</p>
        <p>Population: {selectedState.population?.toLocaleString()}</p>
        <p>Largest City: {selectedState.largestCity}</p>  
        <p>Total Area: {selectedState.totalAreaSquareMiles?.toLocaleString()} sq miles</p>
        <p>Established: {selectedState.established}</p>
        
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Modal;