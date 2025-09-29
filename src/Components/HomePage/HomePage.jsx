import React, { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Map from "../Map/Map";
import Modal from "../Modal/Modal";
import GameScreen from "../GameScreen/GameScreen";

function HomePage() {
  const [selectedState, setSelectedState] = useState(null);
  const [isGameScreen, setIsGameScreen] = useState(false);
  const handleStartGame = () => setIsGameScreen(true);
  const handleQuitGame = () => setIsGameScreen(false);

  return (
    <>
      <Header />
      {!isGameScreen ? (
        <>
          <Map onStateClick={setSelectedState} />
          <Modal
            isOpen={!!selectedState}
            onClose={() => setSelectedState(null)}
            selectedState={selectedState}
          />
          <Footer onStart={handleStartGame} />
        </>
      ) : (
        <GameScreen onQuit={handleQuitGame} />
      )}
    </>
  );
}

export default HomePage;
