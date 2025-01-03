//Programmer Name: Ivan Chen Xiao Yu TP064261
//Program Name: osds
//First Written on: 15th March 2024
import React, { useState, useEffect } from "react";
import { Button } from "../Button";
import "../../App.css";
import Cards from "../Cards";
import CreateDebate from "../CreateDebate";

function Debates() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state to track login status
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token"); // Assuming you store the token in localStorage upon successful login
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleCreateDebate = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSaveDebate = (formData) => {
    handleClosePopup();
  };

  return (
    <div className="debates">
      <div className="debates__header-wrapper">
        <h1 className="debates__header-text">Join in One of Our Debates!</h1>
        {isLoggedIn && (
          <Button
            className="btns"
            buttonStyle="btn--primary"
            buttonSize="btn--large"
            onClick={handleCreateDebate}
          >
            Create Debate
          </Button>
        )}
      </div>
      {!isLoggedIn && <p className="login-text">Please log in to create a debate.</p>}
      <div className="cards__container">
        <CreateDebate
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          onSave={handleSaveDebate}
          token={token} // Pass the token prop to CreateDebate
        />
        <Cards />
      </div>
    </div>
  );
}

export default Debates;
