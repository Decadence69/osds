import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Debates from "./components/pages/Debates";
import LoginSignup from "./components/pages/LoginSignup";
import Signup from "./components/pages/Signup";
import Achievements from "./components/pages/Achievements";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home/>} />
          <Route path="/debates" element={<Debates />} />
          <Route path="/profile" element={<LoginSignup />} />
          <Route path="/loginsignup" element={<Signup />} />
          <Route path="/achievements" element={<Achievements />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
