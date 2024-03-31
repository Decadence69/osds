import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Debates from "./components/pages/Debates";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Achievements from "./components/pages/Achievements";

function App() {
  const [token, setToken] = useState(null); // State to store the token

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          {/* Pass token and setToken as props to Login */}
          <Route path="/profile" element={<Login setToken={setToken} />} />
          {/* Pass token as prop to Debates */}
          <Route path="/debates" element={<Debates token={token} />} />
          <Route path="/loginsignup" element={<Signup />} />
          <Route path="/achievements" element={<Achievements />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;