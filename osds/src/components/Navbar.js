import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./Button";
import "./Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state to track login status

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming you store the token in localStorage upon successful login
    setIsLoggedIn(!!token); // Update login status based on the presence of token
  }, []);

  window.addEventListener("resize", showButton);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setIsLoggedIn(false); // Update login status
    navigate("/"); // Redirect to home page or wherever appropriate
  };

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
            {isLoggedIn && (
              <li className="nav-item">
                <Link
                  to="/achievements"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Achievements
                </Link>
              </li>
            )}
            {isLoggedIn ? (
              <li className="nav-item">
                <Link to="/" className="nav-links" onClick={handleLogout}>
                  Logout
                </Link>
              </li>
            ) : null}
          </ul>
          {button && (
            <Button
              linkTo={"/profile"}
              buttonStyle="btn--outline"
              onClick={isLoggedIn ? () => navigate("/profile") : null}
            >
              {isLoggedIn ? "PROFILE" : "SIGN IN"}
            </Button>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
