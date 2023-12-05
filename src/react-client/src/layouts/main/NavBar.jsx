import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../../assets/styles/Navbar.css";
import { UserContext } from "../../contexts/UserContext";
import ENDPOINTS from "../../configs/api-endpoints";
import { SigninModalContext } from "../../contexts/SigninModalContext";
import { Col } from "react-bootstrap";

function NavBar() {
  const { user, setUser } = useContext(UserContext);
  const { setIsOpen } = useContext(SigninModalContext);

  console.log(user.isAuthenticated);
  return (
    <React.Fragment>
      <div className="body_navbar center">
        {user.isAuthenticated ? (
          <Link className="start-btn" onClick={(e) => {
            e.preventDefault();
            fetch(ENDPOINTS.POST_API_ACCOUNT_SIGNOUT, {
              method: 'POST',
              credentials: 'include'
            })
              .then(response => response.json())
              .then(json => {
                console.log(json);
                if (json.succeeded === true) {
                  window.location.reload();
                }
              })
              .catch(error => console.log(error));
          }}>Logout</Link>


        ) : (
          <Link className="start-btn" as={Col} onClick={() => setIsOpen(true)}>
            Login
          </Link>
        )}

        <Link to="/" className="start-btn">
          HOME
        </Link>
      </div>
      <br />      
    </React.Fragment>
  );
}

export default NavBar;
