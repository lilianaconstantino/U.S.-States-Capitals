import React, { useState } from 'react';
import Map from '../Map/Map';
import Modal from '../Modal/Modal'; // adjust import path to your modal

function HomePage() {
  const [selectedState, setSelectedState] = useState(null);

  const handleStateClick = (state) => {
    setSelectedState(state); // pass the whole state object from Map
  };

  const closeModal = () => setSelectedState(null);

  return (
    <>
      <Map onStateClick={handleStateClick} />

      <Modal 
        isOpen={!!selectedState} 
        onClose={closeModal} 
        selectedState={selectedState} 
      />
    </>
  );
}

export default HomePage;
