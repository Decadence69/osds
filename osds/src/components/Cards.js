import React, { useState, useEffect } from "react";
import CardItem from "./CardItem";
import "./Cards.css";
import coolBackgroundImage from "../images/cool_background_57.jpg";
import {api} from "../App.js";

function Cards() {
  const [debates, setDebates] = useState([]);

  useEffect(() => {
    // Fetch debates from backend API
    fetchDebates();
  }, []);

  const fetchDebates = async () => {
    try {
      const response = await fetch(`${api}/debates`); // Adjust the  endpoint according to your backend route
      const data = await response.json();
      setDebates(data);
    } catch (error) {
      console.error("Error fetching debates:", error);
    }
  };

  return (
    <div className="cards">
      <div className="cards__container">
        <div className="cards__wrapper">
          {debates.map((debate, index) => (
            <CardItem
              key={index}
              src={debate.image || coolBackgroundImage} // Assuming 'image' is a field in your debate object
              text={debate.topic} // Assuming 'topic' is a field in your debate object
              label={debate.category} // Assuming 'category' is a field in your debate object
              path={`/debates/${debate._id}`} // Assuming 'id' is a unique identifier for each debate
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cards;
