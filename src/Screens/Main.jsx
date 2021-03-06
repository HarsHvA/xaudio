import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Player from "./Player/Player";

function Main() {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/audioplayer" element={<Player />} />
          </Routes>
    </Router>
  );
}

export default Main;