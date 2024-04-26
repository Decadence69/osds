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
    console.log(email, password);
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
        console.log(data, "userLogin");
        if (data.status === "Success") {
          alert("Login Successful");
          // Save the token in local storage
          localStorage.setItem("token", data.data);
          // Set the token state
          setToken(data.data);
          window.location.href = "./";
        }
      });
  };

  return (
    <div className="loginsignup">
      <form className="login-form" onSubmit={handleSubmit}>
        <h3 className="login-h3">Login Here</h3>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          id="Email"
          autoComplete="email"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          id="password"
          autoComplete="current-password"
        />
        <button className="signin-button" type="submit">
          Log In
        </button>
        <div className="signup-container">
          <p>Not registered?</p>
          <Link to="/signup">Signup!</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
