import React, { useState } from "react";
import { Button } from "../Button";
import "../../App.css";
import Cards from "../Cards";
import CreateDebate from "../CreateDebate"; // Import the CreateDebate component

function Debates() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
        />
        <Cards />
        <Button
          buttonStyle="btn--primary"
          buttonSize="btn--large"
          onClick={handleCreateDebate}
        >
          Create Debate
        </Button>
      </div>
    </>
  );
}

export default Debates;
