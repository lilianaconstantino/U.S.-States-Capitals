import React, { useEffect, useState } from "react";
import { USAMap } from "@mirawision/usa-map-react";
import styles from "./Map.module.css";

function Map({ onStateClick, clickedStates = {}, results = [], showLabels = false, showAbbreviations = false }) {
  const [stateData, setStateData] = useState([]);

  useEffect(() => {
    async function fetchStates() {
      try {
        const response = await fetch(
          "https://parseapi.back4app.com/classes/States?limit=50&order=name",
          {
            headers: {
              "X-Parse-Application-Id": "6a2NWTwXRlwc1BynCf46kYZG1VeWp170GYjZIeXK",
              "X-Parse-Master-Key": "WEYdiGWSz0gt91skfDe03wX9yqikQTpiVc9Vn2An",
            },
          }
        );
        const data = await response.json();
        setStateData(data.results);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    }
    fetchStates();
  }, []);

  const regionColors = {
    west: { fill: "#EEE485", stroke: "#E98F36" },
    midwest: { fill: "#F1AEA9", stroke: "#C24A3B" },
    south: { fill: "#BDC06B", stroke: "#4A6F45" },
    northeast: { fill: "#8FBBD3", stroke: "#426D96" },
  };

  const regions = {
    west: ["CA","OR","WA","NV","ID","UT","AZ","CO","WY","MT","NM","AK","HI"],
    midwest: ["ND","SD","NE","KS","MN","IA","MO","WI","IL","MI","IN","OH"],
    south: ["TX","OK","AR","LA","MS","AL","TN","KY","WV","VA","NC","SC","GA","FL","DE","MD","DC"],
    northeast: ["PA","NJ","NY","CT","RI","MA","VT","NH","ME"],
  };

  // Use your pre-defined percentages for capital positions
  const capitalPositions = {
    AL: { top: "60%", left: "67%" },
    AK: { top: "69%", left: "13%" },
    AZ: { top: "50%", left: "21%" },
    AR: { top: "52%", left: "57%" },
    CA: { top: "40%", left: "8%" },
    CO: { top: "40%", left: "34%" },
    CT: { top: "28%", left: "92%" },
    DE: { top: "35%", left: "90%" },
    FL: { top: "73%", left: "80%" },
    GA: { top: "60%", left: "74%" },
    HI: { top: "80%", left: "29%" },
    ID: { top: "23%", left: "21%" },
    IL: { top: "35%", left: "61%" },
    IN: { top: "35%", left: "67%" },
    IA: { top: "30%", left: "54%" },
    KS: { top: "41%", left: "45%" },
    KY: { top: "43%", left: "70%" },
    LA: { top: "65%", left: "58%" },
    ME: { top: "12%", left: "93%" },
    MD: { top: "40%", left: "88%" },
    MA: { top: "23%", left: "96%" },
    MI: { top: "25%", left: "69%" },
    MN: { top: "15%", left: "53%" },
    MS: { top: "60%", left: "62%" },
    MO: { top: "40%", left: "56%" },
    MT: { top: "15%", left: "30%" },
    NE: { top: "32%", left: "43%" },
    NV: { top: "33%", left: "14%" },
    NH: { top: "20%", left: "95%" },
    NJ: { top: "30%", left: "90%" },
    NM: { top: "53%", left: "31%" },
    NY: { top: "22%", left: "84%" },
    NC: { top: "45%", left: "82%" },
    ND: { top: "14%", left: "43%" },
    OH: { top: "35%", left: "72%" },
    OK: { top: "50%", left: "48%" },
    OR: { top: "18%", left: "10%" },
    PA: { top: "30%", left: "80%" },
    RI: { top: "26%", left: "93%" },
    SC: { top: "52%", left: "78%" },
    SD: { top: "23%", left: "43%" },
    TN: { top: "48%", left: "68%" },
    TX: { top: "63%", left: "43%" },
    UT: { top: "35%", left: "23%" },
    VT: { top: "12%", left: "87%" },
    VA: { top: "40%", left: "81%" },
    WA: { top: "8%", left: "13%" },
    WV: { top: "40%", left: "76%" },
    WI: { top: "20%", left: "60%" },
    WY: { top: "25%", left: "31%" },
  };

  const getStateSettings = () => {
    const settings = {};
    if (!stateData || stateData.length === 0) return settings;

    stateData.forEach((state) => {
      let regionStyle = { fill: "#f0f0f0", stroke: "#333" };
      Object.entries(regions).forEach(([regionName, states]) => {
        if (states.includes(state.postalAbreviation)) regionStyle = regionColors[regionName];
      });

      let fillColor = regionStyle.fill;

      // Game colors only during play
      if (!showLabels) {
        if (clickedStates[state.postalAbreviation] === "correct") fillColor = "#4CAF50";
        else if (clickedStates[state.postalAbreviation] === "wrong") fillColor = "#F44336";
      }

      settings[state.postalAbreviation] = {
        ...regionStyle,
        fill: fillColor,
        onClick: !showLabels ? () => onStateClick?.(state) : undefined,
        title: `${state.name}${showLabels ? ` – ${state.capital}` : ""}`,
      };
    });

    return settings;
  };

  return (
    <div className={styles.mapWrapper}>
      <div className={styles.mapContainer}>
        <USAMap className={styles.map} customStates={getStateSettings()} />
        </div>

  {/* Always show abbreviations during gameplay */}
  {!showLabels &&
    Object.entries(capitalPositions).map(([abbr, pos]) => (
      <div
        key={abbr}
        style={{
          position: "absolute",
          top: pos.top,
          left: pos.left,
          transform: "translate(-50%, -50%)",
          fontSize: "9px",
          fontWeight: "bold",
          color: "#333",
          pointerEvents: "none",
          textShadow: "0 0 2px #fff",
        }}
      >
        {abbr}
      </div>
    ))}

  {/* Show full names and capitals on results map */}
  {showLabels &&
    results.map(({ state, capital, correct }) => {
      const abbrev = stateData.find((s) => s.name === state)?.postalAbreviation;
      const pos = capitalPositions[abbrev];
      if (!pos) return null;

      return (
        <div
          key={state}
          style={{
            position: "absolute",
            top: pos.top,
            left: pos.left,
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: correct ? "green" : "red",
            fontWeight: "bold",
            pointerEvents: "none",
            fontSize: "11px",
            textShadow: "0 0 2px #fff",
          }}
        >
          <div>{state}</div>
          <div style={{ fontSize: "9px", fontWeight: "normal" }}>{capital}</div>
        </div>
      );
    })}
</div>
  );
}

export default Map;