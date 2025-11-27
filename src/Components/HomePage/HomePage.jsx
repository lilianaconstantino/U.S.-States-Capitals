import React, { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Map from "../Map/Map";
import Modal from "../Modal/Modal";
import GameScreen from "../GameScreen/GameScreen";
import PopQuiz from "../PopQuiz/PopQuiz";

function HomePage() {
  const [selectedState, setSelectedState] = useState(null);
  const [isGameScreen, setIsGameScreen] = useState(false);
  const [isPopQuiz, setIsPopQuiz] = useState(false);
  const handleStartGame = () => setIsGameScreen(true);
  const handleQuitGame = () => setIsGameScreen(false);

return (
  <>
    <Header />

    {/* If no game started: show map + footer */}
    {!isGameScreen && !isPopQuiz ? (
      <>
        <Map onStateClick={setSelectedState} />
        <Modal
          isOpen={!!selectedState}
          onClose={() => setSelectedState(null)}
          selectedState={selectedState}
        />
        <Footer 
          onStart={handleStartGame}         // start main map game
          onStartQuiz={() => setIsPopQuiz(true)}  // start pop quiz
        />
      </>
    ) : isGameScreen ? (
      <GameScreen onQuit={() => setIsGameScreen(false)} />
    ) : (
      <PopQuiz onQuit={() => setIsPopQuiz(false)} />
    )}
  </>
);
}

export default HomePage; 
