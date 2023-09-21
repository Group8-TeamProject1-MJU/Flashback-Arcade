import React from "react";
import { Link } from "react-router-dom";

import "../../assets/styles/Navbar.css";
import buttonSound1 from "../../assets/sounds/button-sound-A.mp3";
import buttonSound2 from "../../assets/sounds/button-sound-B.mp3"

function NavBar() {
  const playButtonSound1 = () => {
    const audio = new Audio(buttonSound1);
    audio.play();
  };
  const playButtonSound2 = () => {
    const audio = new Audio(buttonSound2);
    audio.play();
  };

  const handleAButtonClick = () => {
    playButtonSound1();
    // Perform additional actions for "A" button click
    console.log("A button clicked");
  };

  const handleBButtonClick = () => {
    playButtonSound2();
    // Perform additional actions for "B" button click
    console.log("B button clicked");
  };

  return (
    <React.Fragment>
      <div className="body_navbar center">
     
        <div className="video-game-button" onClick={handleAButtonClick}>
          A
        </div>
        <div className="start-btn">
          <Link to="/">HOME</Link>
        </div>
        <div className="video-game-button" onClick={handleBButtonClick}>
          B
        </div>
      </div>

      <br />
    </React.Fragment>
  );
}

export default NavBar;
