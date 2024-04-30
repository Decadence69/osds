//Programmer Name: Ivan Chen Xiao Yu TP064261
//Program Name: osds
//First Written on: 15th March 2024
import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Debates from "./components/pages/Debates";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
// import Achievements from "./components/pages/Achievements";
import DebateRoom from "./components/pages/DebateRoom";

function App() {
  const [token, setToken] = useState(null); // State to store the token

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/home" exact element={<Home />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/debates" element={<Debates token={token} />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/achievements" element={<Achievements />} /> */}
          <Route path="/debates/:id" element={<DebateRoom />} />
        </Routes>
      </Router>
    </>
  );
}

export const api = "https://osds-api.onrender.com";
// export const api = "http://localhost:5000";

export default App;
