import React, { useState, useEffect } from "react";
import "../../App.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const LoginSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useNavigate();

  async function submit(e) {
    e.preventDefault();

    try {
      await axios
        .post("http://localhost:8000/", {
          email,
          password,
        })
        .then((res) => {
          if (res.data === "exists") {
            history("/", { state: { id: email } });
          } else if (res.data === "notexists") {
            alert("User has not signed up");
          }
        })
        .catch((e) => {
          alert("Details are incorrect");
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="loginsignup">
      <h1>Login</h1>
      <form action="POST">
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          name=""
          id=""
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          name=""
          id=""
        />
        <input type="submit" onClick={submit} />
      </form>
      <br />
      <p>OR</p>
      <br />
      <Link to="/loginsignup">Signup Page</Link>
    </div>
  );
};

export default LoginSignup;
