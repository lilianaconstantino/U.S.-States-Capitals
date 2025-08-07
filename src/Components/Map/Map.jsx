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

  // Define region colors
  const regionColors = {
    west: { fill: '#EEE485', stroke: '#E98F36' },
    midwest: { fill: '#F1AEA9', stroke: '#C24A3B' },
    south: { fill: '#BDC06B', stroke: '#4A6F45' },
    northeast: { fill: '#8FBBD3', stroke: '#426D96' }
  };

  // Define which states belong to which region
  const regions = {
    west: ['CA', 'OR', 'WA', 'NV', 'ID', 'UT', 'AZ', 'CO', 'WY', 'MT', 'NM', 'AK', 'HI'],
    midwest: ['ND', 'SD', 'NE', 'KS', 'MN', 'IA', 'MO', 'WI', 'IL', 'MI', 'IN', 'OH'],
    south: ['TX', 'OK', 'AR', 'LA', 'MS', 'AL', 'TN', 'KY', 'WV', 'VA', 'NC', 'SC', 'GA', 'FL', 'DE', 'MD', 'DC'],
    northeast: ['PA', 'NJ', 'NY', 'CT', 'RI', 'MA', 'VT', 'NH', 'ME']
  };

  const handleStateClick = () => {
    const settings = {};

    stateData.forEach((state) => {
      // Find which region this state belongs to
      let regionStyle = { fill: '#f0f0f0', stroke: '#333' }; // default gray
      
      Object.entries(regions).forEach(([regionName, states]) => {
        if (states.includes(state.postalAbreviation)) {
          regionStyle = regionColors[regionName];
        }
      });

      settings[state.postalAbreviation] = {
        ...regionStyle,
        onClick: () => {
          console.log("State clicked:", state.name);
          setSelectedState(state.name);
        }
      };
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