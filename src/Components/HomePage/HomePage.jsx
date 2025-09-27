import React, { useState } from 'react';
import Map from '../Map/Map';
import Modal from '../Modal/Modal'; // adjust import path to your modal
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
function HomePage() {
  const [selectedState, setSelectedState] = useState(null);

  const handleStateClick = (state) => {
    setSelectedState(state); // pass the whole state object from Map
  };

  const closeModal = () => setSelectedState(null);

  return (
    <>
    <Header/>
      <Map onStateClick={handleStateClick} />

      <Modal 
        isOpen={!!selectedState} 
        onClose={closeModal} 
        selectedState={selectedState} 
      />
      <Footer/>
    </>
  );
}

export default HomePage;
