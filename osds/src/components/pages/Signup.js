import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../App.css";
import "../LoginSignup.css";
import { api } from "../../App.js";

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${api}/signup`, {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
        username,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "Created") {
          alert("Sign up successful");
          window.location.href = "./login";
        } else if (data.status === "Something went wrong, please try again") {
          alert("Sign up failed. Email or Username might be taken");
        }
      });
  };

  return (
    <div className="loginsignup">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h3 className="login-h3">Sign Up</h3>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          value={email}
          autoComplete="email"
          required
        />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          value={username}
          autoComplete="username"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          value={password}
          autoComplete="new-password"
          required
        />
        <button className="signin-button" type="submit">
          Sign Up
        </button>
        <div className="signup-container">
          <p>Already have an account?</p>
          <Link to="/login">Login!</Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;
