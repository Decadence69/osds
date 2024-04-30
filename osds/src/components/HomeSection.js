//Programmer Name: Ivan Chen Xiao Yu TP064261
//Program Name: osds
//First Written on: 15th March 2024
import React from "react";
import { Button } from "./Button";
import "../App.css";
import "./HomeSection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight, faCircleRight } from "@fortawesome/free-solid-svg-icons";

function HomeSection() {
  return (
    <div className="home-container">
      <div className="description-container">
        <h1>Welcome!</h1>
        <h2>{<FontAwesomeIcon className="caretR" icon={faCaretRight} />}  Jump into the world of speed debates!{<FontAwesomeIcon className="caretL" icon={faCaretLeft} />}
        <br/>Debating is a structured discussion between two or more individuals or
          teams, where arguments are presented for and against a specific topic.
          It's a dynamic way to explore different perspectives and develop
          critical thinking skills.</h2>
        <div className="debate-btns">
          <Button
            linkTo={"/signup"}
            className="btn"
            buttonStyle="btn--outline"
            buttonSize="btn--large"
            isSpecial
          >
            Sign up now!
          </Button>
          <Button
            linkTo={"/debates"}
            className="btn"
            buttonStyle="btn--primary"
            buttonSize="btn--large"
          >
            Check it out!{" "}
            <FontAwesomeIcon className="play" icon={faCircleRight} />
          </Button>
        </div>

        {/* <p>
          Debating is a structured discussion between two or more individuals or
          teams, where arguments are presented for and against a specific topic.
          It's a dynamic way to explore different perspectives and develop
          critical thinking skills.
        </p>
        <br /> */}
        {/* <br />
        <p>
          Welcome to MasterDebater, where the art of debating meets speed and
          excitement! Engage in fast-paced debates on various topics, challenge
          your wit, and sharpen your communication skills. Whether you're a
          seasoned debater or new to the game, MasterDebater offers a platform
          to test your ideas and engage in lively exchanges. Join us and unleash
          the master debater within you!
        </p> */}
      </div>
    </div>
  );
}

export default HomeSection;
