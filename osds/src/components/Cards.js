import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import CardItem from "./CardItem";
import "./Cards.css";
import coolBackgroundImage from "../images/cool_background_57.jpg";
import { api } from "../App.js";

function Cards() {
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch debates from backend API
    fetchDebates();
  }, []);

  const fetchDebates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api}/debates`); // Adjust the  endpoint according to your backend route
      const data = await response.json();
      setDebates(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching debates:", error);
    }
  };

  return (
    <>
    <ClipLoader color="#ffffff" loading={loading} css="display: block; margin: 0 auto;" size={150} />
    {!loading && (
      <div className="cards">
        <div className="cards__container">
          <div className="cards__wrapper">
            {debates.map((debate, index) => (
              <CardItem
                key={index}
                src={debate.image || coolBackgroundImage}
                text={debate.topic}
                label={debate.category}
                path={`/debates/${debate._id}`}
              />
            ))}
          </div>
        </div>
      </div>
    )}
  </>
  );
}

export default Cards;
