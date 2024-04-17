// import React, { useState, useEffect } from "react";
// import "../../App.css";
// import "../LoginSignup.css";
// import { Link } from "react-router-dom";
// import {api} from "../../App.js";

// const Login = ({ setToken }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(email, password);
//     fetch(`${api}/login`, {
//       method: "POST",
//       crossDomain: true,
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         "Access-Control-Allow-Origin": "*",
//       },
//       body: JSON.stringify({
//         email,
//         password,
//       }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data, "userLogin");
//         if (data.status === "Success") {
//           alert("Login Successful");
//           // Save the token in local storage
//           localStorage.setItem("token", data.data);
//           // Set the token state
//           setToken(data.data);
//           window.location.href = "./";
//         }
//       });
//   };

//   return (
//     <div className="loginsignup">
//       <form className="login-form" onSubmit={handleSubmit}>
//         <h3 className="login-h3">Login Here</h3>
//         <label htmlFor="email">Email</label>
//         <input
//           type="text"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           id="Email"
//         />
//         <label htmlFor="password">Password</label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           id="password"
//         />
//         <button className="signin-button" type="submit">
//           Log In
//         </button>
//         <div className="signup-container">
//           <p>Not registered?</p>
//           <Link to="/loginsignup">Signup!</Link>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from "react";
import "../../App.css";
import "../LoginSignup.css";
import { Link } from "react-router-dom";
import { api } from "../../App.js";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Save the token in local storage
        localStorage.setItem("token", data.data);
        // Set the token state
        setToken(data.data);
        alert("Login Successful");
        // Redirect to home page or any other page
        window.location.href = "/";
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed");
    }
  };

  return (
    <div className="loginsignup">
      <form className="login-form" onSubmit={handleSubmit}>
        <h3 className="login-h3">Login Here</h3>
        {error && <p className="error-message">{error}</p>}
        <label htmlFor="email">Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          id="Email"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          id="password"
          required
        />
        <button className="signin-button" type="submit">
          Log In
        </button>
        <div className="signup-container">
          <p>Not registered?</p>
          <Link to="/loginsignup">Signup!</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
