import React, { useState, useEffect} from 'react';
import Header from './Components/Header/Header';
import Map from './Components/Map/Map';
import Footer from './Components/Footer/Footer';
import Modal from './Components/Modal/Modal';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import GameScreen from './Components/GameScreen/GameScreen';

function App() {
  const [allStatesData, setAllStatesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('main'); 

  useEffect(() => {
    fetchAllStatesData();
  }, []);

  const fetchAllStatesData = async () => {
    try {
      // Fetch all states with detailed information
      const where = encodeURIComponent(JSON.stringify({
        "postalAbreviation": { "$exists": true },
        "capital": { "$exists": true },
        "established": { "$exists": true },
        "totalAreaSquareMiles": { "$exists": true },
        "population": { "$exists": true },
        "largestCity": { "$exists": true }
      }));

      const response = await fetch(
        `https://parseapi.back4app.com/classes/States?where=${where}&limit=1000`, 
        {
          headers: {
            'X-Parse-Application-Id': '6a2NWTwXRlwc1BynCf46kYZG1VeWp170GYjZIeXK',
            'X-Parse-Master-Key': 'WEYdiGWSz0gt91skfDe03wX9yqikQTpiVc9Vn2An',
          }
        }
      );

      const data = await response.json();
      console.log("All states data:", data);

      // Create a lookup object by state name
      const statesLookup = {};
      data.results.forEach(state => {
        statesLookup[state.name] = state;
      });

      setAllStatesData(statesLookup);
    } catch (error) {
      console.error('Error fetching all states data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStateClick = (stateName) => {
    // Get the complete state data
    const completeStateData = allStatesData[stateName];
    setSelectedState(completeStateData);
    setModalOpen(true);
  };

  if (loading) {
    return <div>Loading states data...</div>;
  }

  return (
    <div>
    {/* MAIN PAGE */}
    {currentView === 'main' && (
      <div className="mapDashboard">
        <Header /> 
        <Map setSelectedState={handleStateClick} />
        <Footer 
          onStartGame={() => setCurrentView('game')}
        />
      </div>
    )}
    
    {/* GAME PAGE */}
    {currentView === 'game' && (
      <GameScreen
        allStatesData={allStatesData}
        onBackToMain={() => setCurrentView('main')}
      />
    )}
      <Modal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedState={selectedState}
      />
    </div>
  );
}; 

export default App;