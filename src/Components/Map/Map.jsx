import React, { useEffect, useState } from "react";
import { USAMap } from "@mirawision/usa-map-react";
import styles from "./Map.module.css";

function Map({ onStateClick, clickedStates = {}, results = [], showLabels = false }) {
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
    AL: { top: "66%", left: "67%" },
    AK: { top: "90%", left: "5%" },
    AZ: { top: "60%", left: "22%" },
    AR: { top: "62%", left: "56%" },
    CA: { top: "47%", left: "9%" },
    CO: { top: "46%", left: "34%" },
    CT: { top: "100%", left: "79%" },
    DE: { top: "90%", left: "75%" },
    FL: { top: "86%", left: "79%" },
    GA: { top: "70%", left: "74%" },
    HI: { top: "95%", left: "12%" },
    ID: { top: "26%", left: "21%" },
    IL: { top: "42%", left: "61%" },
    IN: { top: "43%", left: "67%" },
    IA: { top: "37%", left: "54%" },
    KS: { top: "49%", left: "46%" },
    KY: { top: "100%", left: "57%" },
    LA: { top: "78%", left: "58%" },
    ME: { top: "10%", left: "88%" },
    MD: { top: "100%", left: "71%" },
    MA: { top: "5%", left: "78%" },
    MI: { top: "32%", left: "69%" },
    MN: { top: "20%", left: "53%" },
    MS: { top: "70%", left: "62%" },
    MO: { top: "50%", left: "56%" },
    MT: { top: "18%", left: "30%" },
    NE: { top: "39%", left: "43%" },
    NV: { top: "40%", left: "15%" },
    NH: { top: "10%", left: "83%" },
    NJ: { top: "80%", left: "74%" },
    NM: { top: "62%", left: "32%" },
    NY: { top: "28%", left: "84%" },
    NC: { top: "55%", left: "80%" },
    ND: { top: "18%", left: "43%" },
    OH: { top: "41%", left: "72%" },
    OK: { top: "60%", left: "48%" },
    OR: { top: "22%", left: "12%" },
    PA: { top: "37%", left: "80%" },
    RI: { top: "10%", left: "61%" },
    SC: { top: "62%", left: "78%" },
    SD: { top: "28%", left: "43%" },
    TN: { top: "57%", left: "68%" },
    TX: { top: "75%", left: "43%" },
    UT: { top: "43%", left: "24%" },
    VT: { top: "20%", left: "80%" },
    VA: { top: "48%", left: "81%" },
    WA: { top: "10%", left: "15%" },
    WV: { top: "46%", left: "76%" },
    WI: { top: "27%", left: "60%" },
    WY: { top: "32%", left: "31%" },
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
      <USAMap className={styles.map} customStates={getStateSettings()} />

      {/* Labels overlay only when showing results */}
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