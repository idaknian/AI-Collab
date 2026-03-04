import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navigation from "./Navigation.jsx";
import LoginPage from "./LoginPage.jsx";
import Play from "./Play.jsx";
import Classic from "./Classic.jsx";
import Ranked from "./Ranked.jsx";

function App() {
  const [isGuest, setIsGuest] = useState(false);

  return (
    <Router>
      <Navigation 
        isGuest={isGuest} 
        setIsGuest={setIsGuest} 
      />

      <Routes>
        <Route 
          path="/" 
          element={
            <LoginPage 
              isGuest={isGuest} 
              setIsGuest={setIsGuest} 
            />
          } 
        />
        <Route path="/play" element={<Play />} />
        <Route path="/classic" element={<Classic />} />
        <Route path="/ranked" element={<Ranked />} />
      </Routes>
    </Router>
  );
}

export default App;