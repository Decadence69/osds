//Programmer Name: Ivan Chen Xiao Yu TP064261
//Program Name: osds
//First Written on: 15th March 2024
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./Button";
import "./Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

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
    const token = localStorage.getItem("token"); 
    
    setIsLoggedIn(!!token); 
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
            MasterDebater
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
          {click && isLoggedIn && (
            <li className="nav-item">
              <Link
                to="/"
                className="nav-links"
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
              >
                Logout
              </Link>
            </li>
          )}
          {click && (
            <li className="nav-item">
            <Link
              to="/login"
              className="nav-links"
              onClick={() => {closeMobileMenu();}}
            >
              Login
            </Link>
          </li>
          )}
        </ul>
          
          {button && (
            <Button
              linkTo={isLoggedIn ? "/" : "/login"} // Change the link based on login status
              buttonStyle="btn--outline"
              // Change the onClick function based on login status
              onClick={isLoggedIn ? handleLogout : null} 
            >
              {isLoggedIn ? "LOGOUT" : "LOGIN"}{" "}
            </Button>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
