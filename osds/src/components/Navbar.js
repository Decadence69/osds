import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./Button";
import "./Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const location=useLocation();

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener("resize", showButton);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            MasterDebator
            <FontAwesomeIcon className="fa-coffee" icon={faCoffee} />
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <FontAwesomeIcon
              className={click ? "fa-times" : "fa-bars"}
              icon={click ? faTimes : faBars}
            />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/debates"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Debates
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/profile"
                className="nav-links-mobile"
                onClick={closeMobileMenu}
              >
                {/* {location.state.id} */}
                Profile
              </Link>
            </li>
          </ul>
          {button && <Button buttonStyle="btn--outline">PROFILE</Button>}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
