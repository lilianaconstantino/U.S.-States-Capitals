import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import GameScreen from "./Components/GameScreen/GameScreen";
import Layout from "./Pages/Layout/Layout";
import HomePage from "./Components/HomePage/HomePage";

// Define routes outside App so they're not recreated every render
const routes = createBrowserRouter([
  {
    element: <Layout />, // wrapper component (header/footer/nav, etc.)
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/gamescreen", element: <GameScreen /> },
      // { path: "/library", element: <Library /> },
    ],
  },
]);

function App() {
  const [allStatesData, setAllStatesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAllStatesData();
  }, []);

  const fetchAllStatesData = async () => {
    try {
      const where = encodeURIComponent(
        JSON.stringify({
          postalAbreviation: { $exists: true },
          capital: { $exists: true },
          established: { $exists: true },
          totalAreaSquareMiles: { $exists: true },
          population: { $exists: true },
          largestCity: { $exists: true },
        })
      );

      const response = await fetch(
        `https://parseapi.back4app.com/classes/States?where=${where}&limit=1000`,
        {
          headers: {
            "X-Parse-Application-Id": "6a2NWTwXRlwc1BynCf46kYZG1VeWp170GYjZIeXK",
            "X-Parse-Master-Key": "WEYdiGWSz0gt91skfDe03wX9yqikQTpiVc9Vn2An",
          },
        }
      );

      const data = await response.json();
      console.log("All states data:", data);

      const statesLookup = {};
      data.results.forEach((state) => {
        statesLookup[state.name] = state;
      });

      setAllStatesData(statesLookup);
    } catch (error) {
      console.error("Error fetching all states data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStateClick = (stateName) => {
    const completeStateData = allStatesData[stateName];
    setSelectedState(completeStateData);
    setModalOpen(true);
  };

  if (loading) {
    return <div>Loading states data...</div>;
  }

  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
