import React from 'react';
import Button from '../Button/Button';
import styles from './QuitModal.module.css';

function QuitModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Are you sure you want to quit?</h2>
        <div className={styles.modalActions}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm}>Yes, Quit</Button>
        </div>
      </div>
    </div>
  );
}

export default QuitModal;
