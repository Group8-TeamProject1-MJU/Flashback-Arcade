import React, { useContext } from "react";
import { Link } from "react-router-dom";

import "../../assets/styles/Navbar.css";
import { UserContext } from "../../contexts/UserContext";
import ENDPOINTS from "../../configs/api-endpoints";

function NavBar() {
  const { user, setUser } = useContext(UserContext);

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
          <Link className="start-btn" to="/account/signin">
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
