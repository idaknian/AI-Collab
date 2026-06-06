import { useEffect, useState } from "react";
import "./Classic.css";


function Classic() {
  const [fadeIn, setFadeIn] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [gameId, setGameId] = useState(null);
  const [currentWord, setCurrentWord] = useState("");
  const [humanGuesses, setHumanGuesses] = useState([]);
  const [aiGuesses, setAiGuesses] = useState([]);
  const [winnerModal, setWinnerModal] = useState(false);
  const [winner, setWinner] = useState("");
  const [answerWord, setAnswerWord] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pressedKey, setPressedKey] = useState("");
  const [humanFeedbacks, setHumanFeedbacks] = useState([]);
  const [aiFeedbacks, setAiFeedbacks] = useState([]);
  const [currentTurn, setCurrentTurn] = useState("human");

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

  const startGame = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/game/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: localStorage.getItem("username"),
            mode: "classic"
          }),
        }
      );

      const data = await response.json();

      setGameId(data.game_id);
      setShowModal(false);

    } catch (err) {
      console.error(err);
    }
  };

  const submitGuess = async () => {

    if (isSubmitting) return;
    if (!gameId) return;
    if (currentWord.length !== 5) return;

    setIsSubmitting(true);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/game/play-turn",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            game_id: gameId,
            guess: currentWord.toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      // console.log("DATA:", data);
      // console.log("FEEDBACK:", data.human.feedback);

      // console.log("FULL DATA");
      // console.log(data);

      // console.log("HUMAN FEEDBACK");
      // console.log(data.human.feedback);

      // console.log("AI FEEDBACK");
      // console.log(data.ai.feedback);

      console.log("FULL RESPONSE:", data);
      console.log("WINNER:", data.winner);
      console.log("HUMAN:", data.human);
      console.log("AI:", data.ai);

      if (data.winner) {

        console.log("WORD:", data.word);
        setWinner(data.winner.toUpperCase());
        setAnswerWord(
          data.human?.word?.toUpperCase() ||
          data.ai?.word?.toUpperCase() ||
          ""
        );
        setWinnerModal(true);
      }

      setHumanGuesses((prev) => [
        ...prev,
        currentWord.toUpperCase(),
      ]);

      setHumanFeedbacks((prev) => [
        ...prev,
        data.human.feedback,
      ]);
      
      setCurrentTurn("ai");

    if (data.ai) {
      setTimeout(() => {

        setAiGuesses((prev) => [
          ...prev,
          data.ai.guess.toUpperCase(),
        ]);

        setAiFeedbacks((prev) => [
          ...prev,
          data.ai.feedback,
        ]);

        setCurrentTurn("human");

      }, 1500);
    }

      setCurrentWord("");

    } catch (err) {

      console.error(err);

    } finally {

      setIsSubmitting(false);

    }
  };

  const handleKey = (key) => {

    if (currentTurn !== "human") {
      return;
    }

    if (key === "⌫") {
      setCurrentWord((prev) => prev.slice(0, -1));
      return;
    }

    if (key === "ENTER") {
      submitGuess();
      return;
    }

    if (currentWord.length < 5) {
      setCurrentWord((prev) => prev + key);
    }
  };

  useEffect(() => {

    const handlePhysicalKeyboard = (event) => {

      const key = event.key.toUpperCase();

      setPressedKey(key);

      setTimeout(() => {
        setPressedKey("");
      }, 100);

      if (key === "BACKSPACE") {
        handleKey("⌫");
        return;
      }

      if (key === "ENTER") {
        handleKey("ENTER");
        return;
      }

      if (/^[A-Z]$/.test(key)) {
        handleKey(key);
      }
    };

    window.addEventListener("keydown", handlePhysicalKeyboard);

    return () => {
      window.removeEventListener("keydown", handlePhysicalKeyboard);
    };

  }, [currentWord, currentTurn]);

  return (
    <div
      className={`Classic-HalamanFull ${
        fadeIn ? "Classic-fade-in-page" : ""
      }`}
    >

      {winnerModal && (
        <div className="Classic-modal-overlay">
          <div className="Classic-winner-modal">

            <h1 className="Classic-winner-title">
              {winner === "DRAW"
                ? "🤝 DRAW"
                : `🏆 ${winner} WINS`}
            </h1>

            <p className="Classic-winner-word">
              Word: <strong>{answerWord}</strong>
            </p>

            <button
              className="Classic-start-btn"
              onClick={() => window.location.reload()}
            >
              Play Again
            </button>

          </div>
        </div>
      )}

      {showModal && (
        <div className="Classic-modal-overlay">
          <div className="Classic-mode-modal">

            <h2 className="Classic-mode-title">
              <span className="Classic-mode-dot"></span>
              Classic Match
            </h2>

            <p className="Classic-mode-desc">
              Mode santai untuk bermain tanpa tekanan.
              Cocok untuk latihan dan mencoba strategi baru.
            </p>

            <button
              className="Classic-start-btn"
              onClick={startGame}
            >
              Start Playing
            </button>

          </div>
        </div>
      )}

      <div className="Classic-Turn-Indicator">

        {currentTurn === "human"
          ? "🎯 YOUR TURN"
          : "🤖 AI THINKING..."}

      </div>

      <div className="Classic-Play-Area">

        {/* USER SIDE */}
        <div className="Classic-Side">

          <div className="Classic-Side-Label">
            You
          </div>

          <div className="Classic-Grid">
            {Array.from({ length: rows }).map((_, rowIndex) => {

              let word = "";

              if (rowIndex < humanGuesses.length) {
                word = humanGuesses[rowIndex];
              }
              else if (rowIndex === humanGuesses.length) {
                word = currentWord;
              }

              return (
                <div
                  className="Classic-Row"
                  key={rowIndex}
                >

                  {Array.from({ length: cols }).map((_, colIndex) => {

                    let tileClass = "Classic-Tile";

                    if (rowIndex < humanFeedbacks.length) {

                      const feedback =
                        humanFeedbacks[rowIndex][colIndex];

                      if (feedback === 1) {
                        tileClass += " Classic-Green";
                      }
                      else if (feedback === 2) {
                        tileClass += " Classic-Yellow";
                      }
                      else {
                        tileClass += " Classic-White";
                      }
                    }

                    return (
                      <div
                        className={tileClass}
                        key={colIndex}
                      >
                        {word[colIndex] || ""}
                      </div>
                    );

                  })}

                </div>
              );

            })}

          </div>

        </div>

        {/* AI SIDE */}
        <div className="Classic-Side">

          <div className="Classic-Side-Label">
            AI
          </div>

          <div className="Classic-Grid">

            {Array.from({ length: rows }).map((_, rowIndex) => {

              const word =
                rowIndex < aiGuesses.length
                  ? aiGuesses[rowIndex]
                  : "";

              return (
                <div
                  className="Classic-Row"
                  key={rowIndex}
                >

                  {Array.from({ length: cols }).map((_, colIndex) => {

                    let tileClass =
                      "Classic-Tile Classic-AI-Tile";

                    if (rowIndex < aiFeedbacks.length) {

                      const feedback =
                        aiFeedbacks[rowIndex][colIndex];

                      if (feedback === 1) {
                        tileClass += " Classic-Green";
                      }
                      else if (feedback === 2) {
                        tileClass += " Classic-Yellow";
                      }
                      else {
                        tileClass += " Classic-White";
                      }
                    }

                    return (
                      <div
                        className={tileClass}
                        key={colIndex}
                      >
                        {word[colIndex] || ""}
                      </div>
                    );

                  })}

                </div>
              );

            })}

          </div>

        </div>

      </div>

      <div className="Classic-Keyboard-Area">

        <div className="Classic-Keyboard">

          {keyboardRows.map((row, rowIndex) => (

            <div
              className="Classic-Keyboard-Row"
              key={rowIndex}
            >

              {row.map((key) => (
                <button
                  className={`Classic-Key ${pressedKey === key ||
                          (pressedKey === "BACKSPACE" && key === "⌫") || (pressedKey === "ENTER" && key === "ENTER")
                            ? "Classic-Key-Pressed"
                            : ""
                          }`}
                  key={key}
                  disabled={currentTurn !== "human"}
                  onClick={() => handleKey(key)}
                >
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

export default Classic;