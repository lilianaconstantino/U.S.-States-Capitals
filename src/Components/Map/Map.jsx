import React, { useEffect, useState } from "react";
import { USAMap } from "@mirawision/usa-map-react";
import styles from "./Map.module.css";
import useStates from "../hooks/useStates";

function Map({
  onStateClick,
  clickedStates,
  results,
  showLabels,
  capitalsData,
  highlightedStates = [],
  pulseState = null,
}) {
  // Fetch state data
   const stateData = useStates();

  // Region colors
  const regionColors = {
    west: { fill: "#EEE485", stroke: "#615142ff" },
    midwest: { fill: "#F1AEA9", stroke: "#C24A3B" },
    south: { fill: "#BDC06B", stroke: "#4A6F45" },
    northeast: { fill: "#8FBBD3", stroke: "#426D96" },
  };

  // Regions
  const regions = {
    west: ["CA","OR","WA","NV","ID","UT","AZ","CO","WY","MT","NM","AK","HI"],
    midwest: ["ND","SD","NE","KS","MN","IA","MO","WI","IL","MI","IN","OH"],
    south: ["TX","OK","AR","LA","MS","AL","TN","KY","WV","VA","NC","SC","GA","FL","DE","MD","DC"],
    northeast: ["PA","NJ","NY","CT","RI","MA","VT","NH","ME"],
  };

  // Region label positions
  const regionPositions = {
    West: { top: "35%", left: "12%" },
    Midwest: { top: "20%", left: "65%" },
    South: { top: "77%", left: "60%" },
    Northeast: { top: "20%", left: "87%" },
  };

  // Capital positions
  const capitalPositions = {
    AL: { top: "55%", left: "62%" },
    AK: { top: "67%", left: "24%" },
    AZ: { top: "51%", left: "30%" },
    AR: { top: "52%", left: "55%" },
    CA: { top: "43%", left: "21%" },
    CO: { top: "41%", left: "38%" },
    CT: { top: "32%", left: "78%" },
    DE: { top: "38%", left: "77%" },
    FL: { top: "65%", left: "70%" },
    GA: { top: "57%", left: "67%" },
    HI: { top: "80%", left: "40%" },
    ID: { top: "25%", left: "29%" },
    IL: { top: "38%", left: "58%" },
    IN: { top: "37%", left: "62%" },
    IA: { top: "33%", left: "53%" },
    KS: { top: "43%", left: "47%" },
    KY: { top: "44%", left: "64%" },
    LA: { top: "63%", left: "55%" },
    ME: { top: "18%", left: "80%" },
    MD: { top: "41%", left: "77%" },
    MA: { top: "28%", left: "82%" },
    MI: { top: "29%", left: "63%" },
    MN: { top: "25%", left: "52%" },
    MS: { top: "58%", left: "58%" },
    MO: { top: "43%", left: "54%" },
    MT: { top: "19%", left: "35%" },
    NE: { top: "35%", left: "45%" },
    NV: { top: "35%", left: "25%" },
    NH: { top: "25%", left: "81%" },
    NJ: { top: "35%", left: "78%" },
    NM: { top: "52%", left: "37%" },
    NY: { top: "27%", left: "74%" },
    NC: { top: "48%", left: "72%" },
    ND: { top: "20%", left: "45%" },
    OH: { top: "37%", left: "66%" },
    OK: { top: "50%", left: "48%" },
    OR: { top: "23%", left: "22%" },
    PA: { top: "34%", left: "72%" },
    RI: { top: "30%", left: "80%" },
    SC: { top: "52%", left: "70%" },
    SD: { top: "27%", left: "45%" },
    TN: { top: "48%", left: "63%" },
    TX: { top: "60%", left: "45%" },
    UT: { top: "38%", left: "31%" },
    VT: { top: "19%", left: "76%" },
    VA: { top: "42%", left: "72%" },
    WA: { top: "15%", left: "24%" },
    WV: { top: "40%", left: "69%" },
    WI: { top: "27%", left: "57%" },
    WY: { top: "30%", left: "37%" },
  };

  // Build state styles
  const getStateSettings = () => {
    const settings = {};
    if (!stateData?.length) return settings;

    stateData.forEach((state) => {
      const abbr = state?.postalAbreviation;
      if (!abbr) return;

      let regionStyle = { fill: "#f0f0f0", stroke: "#333" };

      Object.entries(regions).forEach(([regionName, states]) => {
        if (states?.includes(abbr)) regionStyle = regionColors[regionName];
      });

      let fillColor = regionStyle.fill;
      let extraClass = "";

      if (!showLabels) {
        if (clickedStates?.[abbr] === "correct") fillColor = "#4CAF50";
        else if (clickedStates?.[abbr] === "wrong") fillColor = "#F44336";
      }

      if (highlightedStates?.includes(abbr)) extraClass += ` ${styles.highlighted}`;
      if (pulseState === abbr) extraClass += ` ${styles.pulsing}`;

      settings[abbr] = {
        ...regionStyle,
        fill: fillColor,
        className: extraClass.trim(),
        onClick: !showLabels ? () => onStateClick?.(state) : undefined,
        title: `${state?.name ?? ""}${showLabels ? ` – ${state?.capital ?? ""}` : ""}`,
      };
    });

    return settings;
  };

  return (
    <div className={styles.mapWrapper}>
      <div className={styles.mapContainer}>
        <USAMap className={styles.map} customStates={getStateSettings()} />
      </div>

      {/* Region labels */}
      {!showLabels &&
        Object.entries(regionPositions).map(([regionName, pos]) => {
          const regionKey = regionName.toLowerCase();
          const isRegionHighlighted = regions[regionKey]?.some((abbr) =>
            highlightedStates.includes(abbr)
          );

          return (
            <div
              key={regionName}
              style={{
                position: "absolute",
                top: pos.top,
                left: pos.left,
                transform: "translate(-50%, -50%)",
                fontSize: "25px",
                fontWeight: "bold",
                color: isRegionHighlighted ? "#FFD54F" : "#624226",
                textShadow: isRegionHighlighted
                  ? "0 0 8px #fff, 0 0 12px #FFD54F"
                  : "0 0 2px #fff",
                pointerEvents: "none",
                transition: "all 0.3s ease",
              }}
            >
              {regionName}
            </div>
          );
        })}

      {/* State abbreviations */}
      {!showLabels &&
        Object.entries(capitalPositions).map(([abbr, pos]) => (
          <div
            key={abbr}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              transform: "translate(-50%, -50%)",
              fontSize: "25px",
              fontWeight: "bold",
              color: "#333",
              pointerEvents: "none",
              textShadow: "0 0 2px #fff",
            }}
          >
            {abbr}
          </div>
        ))}

      {/* Results view */}
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
                fontSize: "14px",
                textShadow: "0 0 2px #fff",
              }}
            >
              <div>{state}</div>
              <div style={{ fontSize: "13px", fontWeight: "normal" }}>{capital}</div>
            </div>
          );
        })}
    </div>
  );
}

export default Map;