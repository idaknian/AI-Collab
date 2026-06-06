import { useEffect, useState } from "react";
import "./Ranked.css";

function Ranked() {
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
  const [newElo, setNewElo] = useState(0);
  const [eloChange, setEloChange] = useState(0);

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
            mode: "ranked"
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

      console.log("FULL RESPONSE:", data);
      console.log("WINNER:", data.winner);
      console.log("HUMAN:", data.human);
      console.log("AI:", data.ai);
      console.log("FULL RESPONSE:", data);

      if (data.winner) {
          let eloData = null;

          if (data.winner === "human") {
            eloData = data.human;
          }
          else if (data.winner === "ai") {
            eloData = data.ai;
          }

        setWinner(
          data.winner.toUpperCase()
        );

        setAnswerWord(
          data.human?.word?.toUpperCase() ||
          data.ai?.word?.toUpperCase() ||
          ""
        );

        setNewElo(
          eloData?.new_elo || 0
        );

        setEloChange(
          eloData?.elo_change || 0
        );

        if (eloData?.new_elo !== undefined) {
          localStorage.setItem(
            "elo",
            eloData.new_elo
          );
        }

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
      className={`Ranked-HalamanFull ${
        fadeIn ? "Ranked-fade-in-page" : ""
      }`}
    >

      {winnerModal && (
        <div className="Ranked-modal-overlay">
          <div className="Ranked-winner-modal">

            <h1 className="Ranked-winner-title">
              {winner === "DRAW"
                ? "🤝 DRAW"
                : `🏆 ${winner} WINS`}
            </h1>

            <p className="Ranked-winner-word">
              Word: <strong>{answerWord}</strong>
            </p>

            <p
              className={`Ranked-elo-change ${
                eloChange >= 0
                  ? "Ranked-elo-positive"
                  : "Ranked-elo-negative"
              }`}
            >
              {eloChange > 0
                ? `+${eloChange} ELO`
                : `${eloChange} ELO`}
            </p>

            <p className="Ranked-current-elo">
              Current ELO: {newElo}
            </p>

            <button
              className="Ranked-start-btn"
              onClick={() => window.location.reload()}
            >
              Play Again
            </button>

          </div>
        </div>
      )}

      {showModal && (
        <div className="Ranked-modal-overlay">
          <div className="Ranked-mode-modal">

            <h2 className="Ranked-mode-title">
              <span className="Ranked-mode-dot"></span>
              Ranked Match
            </h2>

            <p className="Ranked-mode-desc">
              Compete against AI and climb the leaderboard.
              Every win increases your ELO rating,
              every loss makes the journey tougher.
            </p>

            <button
              className="Ranked-start-btn"
              onClick={startGame}
            >
              Start Playing
            </button>

          </div>
        </div>
      )}

      <div className="Ranked-Turn-Indicator">

        {currentTurn === "human"
          ? "🎯 YOUR TURN"
          : "🤖 AI THINKING..."}

      </div>

      <div className="Ranked-Play-Area">

        <div className="Ranked-Side">

          <div className="Ranked-Side-Label">
            You
          </div>

          <div className="Ranked-Grid">
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
                  className="Ranked-Row"
                  key={rowIndex}
                >

                  {Array.from({ length: cols }).map((_, colIndex) => {

                    let tileClass = "Ranked-Tile";

                    if (rowIndex < humanFeedbacks.length) {

                      const feedback =
                        humanFeedbacks[rowIndex][colIndex];

                      if (feedback === 1) {
                        tileClass += " Ranked-Green";
                      }
                      else if (feedback === 2) {
                        tileClass += " Ranked-Yellow";
                      }
                      else {
                        tileClass += " Ranked-White";
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

        <div className="Ranked-Side">

          <div className="Ranked-Side-Label">
            AI
          </div>

          <div className="Ranked-Grid">

            {Array.from({ length: rows }).map((_, rowIndex) => {

              const word =
                rowIndex < aiGuesses.length
                  ? aiGuesses[rowIndex]
                  : "";

              return (
                <div
                  className="Ranked-Row"
                  key={rowIndex}
                >

                  {Array.from({ length: cols }).map((_, colIndex) => {

                    let tileClass =
                      "Ranked-Tile Ranked-AI-Tile";

                    if (rowIndex < aiFeedbacks.length) {

                      const feedback =
                        aiFeedbacks[rowIndex][colIndex];

                      if (feedback === 1) {
                        tileClass += " Ranked-Green";
                      }
                      else if (feedback === 2) {
                        tileClass += " Ranked-Yellow";
                      }
                      else {
                        tileClass += " Ranked-White";
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

      <div className="Ranked-Keyboard-Area">

        <div className="Ranked-Keyboard">

          {keyboardRows.map((row, rowIndex) => (

            <div
              className="Ranked-Keyboard-Row"
              key={rowIndex}
            >

              {row.map((key) => (
                <button
                  className={`Ranked-Key ${
                    pressedKey === key ||
                    (pressedKey === "BACKSPACE" && key === "⌫") ||
                    (pressedKey === "ENTER" && key === "ENTER")
                      ? "Ranked-Key-Pressed"
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

export default Ranked;