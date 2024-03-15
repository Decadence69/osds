import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../App.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, username, password);
    // Here you can add your axios request to send the data to the server
    fetch("http://localhost:5000/register", {
      method: "POST",
      crossDomain: true,
      headers:{
        "Content-Type":"application/json",
        Accept:"application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,username,password,
      }),
    });
  };

  return (
    <div className="loginsignup">
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          value={email}
        />
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          value={username}
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          value={password}
        />
        <input type="submit" />
      </form>
      <br />
      <p>OR</p>
      <br />
      <Link to="/profile">Login Page</Link>
    </div>
  );
}

export default Signup;
