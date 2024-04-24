import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./CreateDebate.css";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { api } from "../App.js";

function CreateDebate({ isOpen, onClose, token }) {
  const [topic, setTopic] = useState("");
  const [roundTime, setRoundTime] = useState("");
  const [numRounds, setNumRounds] = useState("1");
  const [position, setPosition] = useState("Pro");
  const [category, setCategory] = useState("");
  const [debateType, setDebateType] = useState("custom");

  const getRandomTopic = async () => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/debate-topics.txt`);
      const text = await response.text();
      const topics = text.split("\n").filter((topic) => topic.trim() !== "");
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      setTopic(randomTopic);
    } catch (error) {
      console.error("Error fetching random topic:", error);
    }
  };

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
        <FontAwesomeIcon className="close-icon" icon={faTimes} onClick={onClose} />
        <h2>Create Debate</h2>
        <form onSubmit={handleSubmit}>
          <div className="debate-type-buttons">
            <button
              className={debateType === "custom" ? "active" : ""}
              onClick={() => setDebateType("custom")}
            >
              Custom
              <input
                type="radio"
                value="custom"
                checked={debateType === "custom"}
                onChange={() => setDebateType("custom")}
              />
            </button>
            <button
              className={debateType === "random" ? "active" : ""}
              onClick={() => {
                setDebateType("random");
                getRandomTopic();
              }}
            >
              Random
              <input
                type="radio"
                value="random"
                checked={debateType === "random"}
                onChange={() => setDebateType("random")}
              />
            </button>
          </div>
          <label>Debate Topic:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required={debateType === "custom"}
            disabled={debateType === "random"}
            className={debateType === "random" ? "random-topic-input" : ""}
          />
          <label>Round Time(s):</label>
          <input type="text" value={roundTime} onChange={(e) => setRoundTime(e.target.value)} required />
          <label>Number of Rounds:</label>
          <input type="number" value={numRounds} onChange={(e) => setNumRounds(e.target.value)} required />
          <label>Position:</label>
          <select value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="Pro">Pro</option>
            <option value="Con">Con</option>
          </select>
          <label>Category:</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
          <button type="submit">
            Create <FontAwesomeIcon icon={faPlus} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateDebate;
