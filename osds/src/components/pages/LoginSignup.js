import React, { useState, useEffect } from "react";
import "../../App.css";
import "../LoginSignup.css";
import { Link } from "react-router-dom";

const LoginSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    fetch("http://localhost:5000/login", {
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
          window.localStorage.setItem("token", data.data);
          window.location.href = "./";
        }
      });
  };

  return (
    <div className="loginsignup">
      <div className="background"></div>
      <form className="login-form" onSubmit={handleSubmit}>
        <h3 className="login-h3">Login Here</h3>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email or Phone"
          id="username"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          id="password"
        />
        <button className="signin-button" type="submit">Log In</button>
        <div className="signup-container">
          <p>Not registered?</p>
          <Link to="/loginsignup">Signup!</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginSignup;
