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
    // Here you can handle saving the debate data to the database
    console.log(formData);
    // After saving, you may want to close the popup
    handleClosePopup();
  };

  return (
    <>
      <div className="debates">
        <CreateDebate
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          onSave={handleSaveDebate}
          token={token} // Pass the token prop to CreateDebate
        />
        <Cards />
        {isLoggedIn && (
          <Button
            buttonStyle="btn--primary"
            buttonSize="btn--large"
            onClick={handleCreateDebate}
          >
            Create Debate
          </Button>
        )}
        {!isLoggedIn && (
          <p>Please log in to create a debate.</p>
        )}
      </div>
    </>
  );
}

export default Debates;
