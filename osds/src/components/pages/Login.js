//Programmer Name: Ivan Chen Xiao Yu TP064261
//Program Name: osds
//First Written on: 15th March 2024
import React, { useState, useEffect } from "react";
import "../../App.css";
import "../LoginSignup.css";
import { Link } from "react-router-dom";
import {api} from "../../App.js";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${api}/login`, {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "Success") {
          alert("Login Successful");
          localStorage.setItem("token", data.data);
          setToken(data.data);
          window.location.href = "./";
        } else {
          alert("Login Failed");
        }
      });
  };

  return (
    <div className="loginsignup">
      <form className="login-form" onSubmit={handleSubmit}>
        <h3 className="login-h3">Login</h3>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          id="Email"
          autoComplete="email"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          id="password"
          autoComplete="current-password"
          required
        />
        <button className="signin-button" type="submit">
          Log In
        </button>
        <div className="signup-container">
          <p>Not registered?</p>
          <Link to="/signup">Sign up!</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
