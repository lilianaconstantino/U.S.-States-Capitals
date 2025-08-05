import React from 'react';
import { USAMap } from '@mirawision/usa-map-react';
import styles from './Map.module.css';
import { useEffect, useState } from 'react';

function Map({ setSelectedState }) {
  const [stateData, setStateData] = useState([]);
  console.log("stateData in variable", stateData);

  useEffect(() => {
    async function stateCount() {
      try {
        const response = await fetch(
          'https://parseapi.back4app.com/classes/States?limit=50&order=name&excludeKeys=landAreaSquareKilometers,landAreaSquareMiles,numberRepresentatives,waterAreaSquareKilometers,waterAreaSquareMiles',
          {
            headers: {
              'X-Parse-Application-Id': '6a2NWTwXRlwc1BynCf46kYZG1VeWp170GYjZIeXK',
              'X-Parse-Master-Key': 'WEYdiGWSz0gt91skfDe03wX9yqikQTpiVc9Vn2An',
            }
          }
        );
        const data = await response.json();
        setStateData(data.results);

        console.log("Fetched state data:", data.results);
        console.log(JSON.stringify(data, null, 2));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    stateCount();
  }, []);

  const handleStateClick = () => {
    const settings = {};
    console.log(stateData);

    stateData.forEach((state) => {
      settings[state.postalAbreviation] = {
        onClick: () => {
          console.log(state);
          setSelectedState(state);
          alert(`You selected ${state.name}`);
        }
      }
    });

    return settings;
  };

  return (
    <div className={styles.mapContainer}>
      <USAMap className={styles.map} customStates={handleStateClick()} />
    </div>
  );
}

export default Map;