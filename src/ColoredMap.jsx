import React from 'react';
import USAMap from 'usa-map-react';

const Colors = [
  '#3b4cc0', '#6c79d0', '#9da6e0', '#ced2ef', '#ffffff',
  '#ecc0c9', '#da8293', '#c7435c', '#b40426'
];

const StateAbbreviations = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

// 🔸 Generate fixed state colors ONCE
const staticMapSettings = (() => {
  const settings = {};
  StateAbbreviations.forEach((state) => {
    settings[state] = {
      fill: Colors[Math.floor(Math.random() * Colors.length)],
    };
  });
  return settings;
})();

const ColoredMap = () => {
  const handleClick = (event) => {
    const stateCode = event.target.dataset.name;
    alert(`You clicked ${stateCode}`);
  };

  return (
    <div>
      <USAMap customStates={staticMapSettings} onClick={handleClick} />
    </div>
  );
};

export default ColoredMap;
