import React from 'react';
import Header from './Components/Header/Header';
import Map from './Components/Map/Map';
import Footer from './Components/Footer/Footer';
import './App.css';


function App() {
  return (
    <div className={"dashboard"}>
      <Header/>
      <Map />
      <Footer/>
    </div>
  );
}

export default App;
