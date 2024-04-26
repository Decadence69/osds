import React from "react";
import { Button } from "./Button";
import "../App.css";
import "./HomeSection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";

function HomeSection() {
  return (
    <div className="home-container">
      <h1>SPEED DEBATES</h1>
      <h2>Welcome to the world of speed debates!</h2>
      <div className="debate-btns">
        <Button
          linkTo={"/signup"}
          className="btn"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
        >
          Sign up now!
        </Button>
        <Button
          linkTo={"/debates"}
          className="btn"
          buttonStyle="btn--primary"
          buttonSize="btn--large"
        >
          Check it out! <FontAwesomeIcon className="play" icon={faCirclePlay} />
        </Button>
      </div>
      <div className="description-container">
      <h2>What is Debating?</h2>
      <p>
        Debating is a structured discussion between two or more individuals or
        teams, where arguments are presented for and against a specific topic.
        It's a dynamic way to explore different perspectives and develop
        critical thinking skills.
      </p>
      <br />
      <br />
      <h2>MasterDebator: Speed Debates</h2>
      <p>
        Welcome to MasterDebator, where the art of debating meets speed and
        excitement! Engage in fast-paced debates on various topics, challenge
        your wit, and sharpen your communication skills. Whether you're a
        seasoned debater or new to the game, MasterDebator offers a platform to
        test your ideas and engage in lively exchanges. Join us and unleash the
        master debater within you!
      </p>
      </div>
    </div>
  );
}

export default HomeSection;
