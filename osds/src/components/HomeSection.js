import React from "react";
import { Button } from "./Button";
import '../App.css';
import './HomeSection.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";

function HomeSection() {
  return (
    <div className="home-container">
      <h1>SPEED DEBATES</h1>
      <p>Welcome to the world of speed debates!</p>
      <div className="debate-btns">
        <Button
          className="btn"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
        >
          Yippee!
        </Button>
        <Button
          className="btn"
          buttonStyle="btn--primary"
          buttonSize="btn--large"
        >
          Try now! <FontAwesomeIcon className="play" icon={faCirclePlay} />
        </Button>
      </div>
    </div>
  );
}

export default HomeSection;
