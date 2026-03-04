import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Play.css";

function Play() {
  const [showIntro, setShowIntro] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 50);
  }, []);

  const handleClassicClick = () => {
    setFadeOut(true);

    setTimeout(() => {
      navigate("/classic");
    }, 400);
  };

  // ✅ Tambahan untuk Ranked
  const handleRankedClick = () => {
    setFadeOut(true);

    setTimeout(() => {
      navigate("/ranked");
    }, 400);
  };

  return (
    <div className="Play-Container">

      {/* INTRO MODAL */}
      {showIntro && (
        <>
          <div
            className="intro-overlay"
            onClick={() => setShowIntro(false)}
          ></div>

          <div
            className={`intro-card ${animate ? "pop-in" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h1>Welcome to WorPler 🎮</h1>

            <p>
              <strong>WorPler</strong> adalah game tebak kata melawan AI 🤖.
              Uji kemampuan berpikir dan strategi kamu untuk menebak kata
              dengan tepat sebelum kesempatan habis.
            </p>

            <p>
              🟢 <strong>Classic Mode</strong><br />
              Mode santai untuk bermain tanpa tekanan.
              Cocok untuk latihan, eksperimen strategi,
              atau sekadar bersenang-senang.
            </p>

            <p>
              🔴 <strong>Ranked Mode</strong><br />
              Mode progressive berbasis sistem <strong>ELO</strong>.
              Semakin tinggi ELO kamu,
              semakin pintar dan sulit AI yang akan kamu hadapi.
              Tantang dirimu dan naikkan peringkatmu! 🏆
            </p>

            <button
              className="start-btn"
              onClick={() => setShowIntro(false)}
            >
              Start Playing
            </button>
          </div>
        </>
      )}

      {/* MAIN CONTENT */}
      <div className={`GameMode ${fadeOut ? "fade-out" : ""}`}>
        
        <div
          className="GameMode-Classic"
          onClick={handleClassicClick}
          style={{ cursor: "pointer" }}
        >
          <h1>Classic Mode</h1>
        </div>

        <div
          className="GameMode-Ranked"
          onClick={handleRankedClick}
          style={{ cursor: "pointer" }}
        >
          <h1>Ranked Mode</h1>
        </div>

      </div>
    </div>
  );
}

export default Play;