import { useEffect, useState } from "react";
import "./Ranked.css";

function Ranked() {
  const [fadeIn, setFadeIn] = useState(false);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 50);
  }, []);

  const rows = 6;
  const cols = 5;

  const keyboardRows = [
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["ENTER","Z","X","C","V","B","N","M","⌫"]
  ];

  return (
    <div className={`HalamanFull ${fadeIn ? "fade-in-page" : ""}`}>

      {showModal && (
        <div className="modal-overlay">
          <div className="mode-modal">

            <h2 className="mode-title">
              <span
                className="mode-dot"
                style={{ background: "#dc2626" }}
              ></span>
              Ranked Match
            </h2>

            <p className="mode-desc">
              Mode kompetitif berbasis sistem ELO.
              Semakin tinggi peringkatmu,
              semakin pintar dan sulit AI yang kamu hadapi.
              Buktikan skill-mu dan naikkan rank! 🏆
            </p>

            <button
              className="start-btn"
              onClick={() => setShowModal(false)}
            >
              Start Playing
            </button>

          </div>
        </div>
      )}

      <div className="Play-Area">

        {/* USER SIDE */}
        <div className="Side">
          <div className="Side-Label">You</div>

          <div className="Grid">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div className="Row" key={rowIndex}>
                {Array.from({ length: cols }).map((_, colIndex) => (
                  <div className="Tile" key={colIndex}></div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* AI SIDE */}
        <div className="Side">
          <div className="Side-Label">AI</div>

          <div className="Grid">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div className="Row" key={rowIndex}>
                {Array.from({ length: cols }).map((_, colIndex) => (
                  <div className="Tile AI-Tile" key={colIndex}></div>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* KEYBOARD */}
      <div className="Keyboard-Area">
        <div className="Keyboard">
          {keyboardRows.map((row, rowIndex) => (
            <div className="Keyboard-Row" key={rowIndex}>
              {row.map((key) => (
                <button className="Key" key={key}>
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Ranked;