import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./CreateDebate.css";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

function CreateDebate({ isOpen, onClose, onSave }) {
  const [topic, setTopic] = useState("");
  const [roundTime, setRoundTime] = useState("");
  const [numRounds, setNumRounds] = useState("1");
  const [position, setPosition] = useState("Pro"); // Default value for Position
  const [category, setCategory] = useState(""); // State for Category

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(topic, roundTime, numRounds, position, category);
    // Here you can add your axios request to send the data to the server
    fetch("http://localhost:5000/create-debate", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        topic,
        roundTime,
        numRounds,
        position,
        category,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "debateCreation");
      });
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup-overlay">
      <div className="popup-inner">
        <FontAwesomeIcon
          className="close-icon"
          icon={faTimes}
          onClick={onClose}
        />
        <h2>Create Debate</h2>
        <form onSubmit={handleSubmit}>
          <label>Debate Topic:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
          <label>Round Time:</label>
          <input
            type="text"
            value={roundTime}
            onChange={(e) => setRoundTime(e.target.value)}
            required
          />
          <label>Number of Rounds:</label>
          <input
            type="number"
            value={numRounds}
            onChange={(e) => setNumRounds(e.target.value)}
            required
          />
          <label>Position:</label>
          <select value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="Pro">Pro</option>
            <option value="Con">Con</option>
          </select>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <button type="submit">
            Create <FontAwesomeIcon icon={faPlus} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateDebate;
