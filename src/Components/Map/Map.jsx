import React from 'react';
import { USAMap } from '@mirawision/usa-map-react';
import styles from './Map.module.css';

function Map() {
  return (
    <div className={styles.mapContainer}>
      <USAMap className={styles.map} />
    </div>
  );
}

export default Map;
