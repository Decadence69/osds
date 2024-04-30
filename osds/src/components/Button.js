//Programmer Name: Ivan Chen Xiao Yu TP064261
//Program Name: osds
//First Written on: 15th March 2024
import React from "react";
import "./Button.css";
import { Link } from "react-router-dom";

const STYLES = ["btn--primary", "btn--outline"];
const SIZES = ["btn--medium", "btn--large"];

export const Button = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize,
  linkTo, // New prop for dynamic navigation
  isSpecial 
}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];
  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];
  const specialClass = isSpecial ? "special-button" : "";
  return (
    <Link to={linkTo} className="btn-mobile">
      <button
        className={`btn ${checkButtonStyle} ${checkButtonSize} ${specialClass}`}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    </Link>
  );
};
