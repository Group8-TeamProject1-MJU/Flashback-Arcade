import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";

import "../../assets/styles/Navbar.css";
import buttonSound1 from "../../assets/sounds/button-sound-A.mp3";
import buttonSound2 from "../../assets/sounds/button-sound-B.mp3"
import { UserContext } from "../../contexts/UserContext";
import { API_BASE_URL } from "../../configs/api-endpoints";

function NavBar() {
  const { user, setUser } = useContext(UserContext);

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
  console.log(user.isAuthenticated);
  return (
    <React.Fragment>
      <div className="body_navbar center">

        <div className="video-game-button" onClick={handleAButtonClick}>
          A
        </div>

        {user.isAuthenticated ? (

            <Link className="start-btn" onClick={(e) => {
              e.preventDefault();
              fetch(API_BASE_URL + "/api/account/signout", {
                method: 'POST',
                credentials: 'include'
              })
                .then(response => response.json())
                .then(json => {
                  console.log(json);
                  if (json.Succeeded = true) {
                    setUser({
                      isAuthenticated: false
                    });
                    Navigate("/account/signin");
                  }
                })
                .catch(error => console.log(error));
            }}>Logout</Link>


        ) : (
          <Link className="start-btn" to="/account/signin">
            Login
          </Link>
        )}

        <Link to="/" className="start-btn">
          HOME
        </Link>

        <div className="video-game-button" onClick={handleBButtonClick}>
          B
        </div>
      </div>

      <br />
    </React.Fragment>
  );
}

export default NavBar;
