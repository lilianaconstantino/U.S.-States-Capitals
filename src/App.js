import React, { useState } from 'react';
import Header from './Components/Header/Header';
import Map from './Components/Map/Map';
import Footer from './Components/Footer/Footer';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [selectedState, setSelectedState] = useState("");

  return (
    <div className={"dashboard"}>
      <div className={"mapDashboard"}>
        <Header /> 
        <Map setSelectedState={setSelectedState} />
        <Footer /> 
      </div> 
    </div>
  );
}

export default App;