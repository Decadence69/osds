import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./CreateDebate.css";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import {api} from "../App.js";

function CreateDebate({ isOpen, onClose, token }) {
  const [topic, setTopic] = useState("");
  const [roundTime, setRoundTime] = useState("");
  const [numRounds, setNumRounds] = useState("1");
  const [position, setPosition] = useState("Pro");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${api}/create-debate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic,
          roundTime,
          numRounds,
          category,
          position,
        }),
      });  

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        onClose();
      } else {
        console.error("Failed to create debate room");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
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
