import React, { useState } from 'react';
import Header from './Components/Header/Header';
import Map from './Components/Map/Map';
import Footer from './Components/Footer/Footer';
import './App.css';
import SideNav from './Components/SideNav /SideNav';


function App() {
  const[isSideNavOpen, setIsSideNavOpen] = useState(false)
  const showSideNavGridClass = isSideNavOpen ? { gridTemplateColumns: '3fr 1fr' }
  : {};


  return (
    <div style= {showSideNavGridClass} className={"dashboard"}>
      <div className={"mapDashboard"}><Header/> 
      <Map isSideNavOpen = {isSideNavOpen} setIsSideNavOpen = {setIsSideNavOpen}/>
      <Footer/> </div> 
      {isSideNavOpen && <SideNav/> }
    </div>
  );
}

export default App;
