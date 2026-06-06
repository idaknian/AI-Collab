import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function LoginPage({ isGuest, setIsGuest }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [fadeOut, setFadeOut] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [animClass, setAnimClass] = useState("");

  // ✅ STATE FORM
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [elo, setElo] = useState("-");

  // Modal dibuka dari Navbar
  useEffect(() => {
    if (location.state?.openModal === "login") {
      setIsLogin(true);
      setShowModal(true);
    }

    if (location.state?.openModal === "register") {
      setIsLogin(false);
      setShowModal(true);
    }
  }, [location.state]);

  // Play as Guest
  const handlePlay = () => {
    setIsGuest(true);
    setFadeOut(true);

    setTimeout(() => {
      navigate("/play");
    }, 500);
  };

  // ✅ HANDLE SUBMIT (TESTING MODE)
  const handleSubmit = async () => {
    setError("");

    // VALIDASI
    if (username.length < 3) {
      setError("Username minimal 3 karakter!");
      return;
    }

    if (username.length > 8) {
      setError("Username maksimal 8 karakter!");
      return;
    }

    if (password.length < 5) {
      setError("Password minimal 5 karakter!");
      return;
    }

    if (password.length > 8) {
      setError("Password maksimal 8 karakter!");
      return;
    }

  if (isLogin) {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }
      localStorage.setItem("username", data.username);
      localStorage.setItem("elo", data.elo);

      window.location.reload();
      setIsGuest(false);
      closeModal();
      navigate("/play");
    } catch (err) {
      setError("Tidak bisa terhubung ke server.");
    }
  } else {
    if (password !== rePassword) {
      setError("Password tidak sama!");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setUsername("");
      setPassword("");
      setRePassword("");
      setIsLogin(true);
    } catch (err) {
      setError("Tidak bisa terhubung ke server.");
    }
  }
  };

  const closeModal = () => {
    setShowModal(false);
    setUsername("");
    setPassword("");
    setRePassword("");
    setError("");
  };

  // Animasi switch Login / Register
  const switchMode = (mode) => {
    if (mode === isLogin) return;

    if (mode === false) {
      setAnimClass("form-exit-left");
      setTimeout(() => {
        setIsLogin(false);
        setAnimClass("form-enter-right");
      }, 300);
    } else {
      setAnimClass("form-exit-right");
      setTimeout(() => {
        setIsLogin(true);
        setAnimClass("form-enter-left");
      }, 300);
    }
  };

  return (
    <>
      <div className={`LoginPage ${fadeOut ? "fade-out" : ""}`}>
        
        {/* LEFT */}
        <div className="Left-Container">
          <div className="Up-Content">
            <h1 className="logo">
              {"Worder".split("").map((char, i) => (
                <span key={i}>{char}</span>
              ))}
            </h1>
          </div>

          <div className="Down-Content">
            <div className="Play" onClick={handlePlay}>
              <h2>Play</h2>
            </div>

            <div
              className="Login"
              onClick={() => {
                setIsLogin(true);
                setShowModal(true);
              }}
            >
              <h2>Login</h2>
            </div>

            <div
              className="Register"
              onClick={() => {
                setIsLogin(false);
                setShowModal(true);
              }}
            >
              <h2>Register</h2>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="Right-Container">
          <div className="LeaderBoard-Title">
            <h1>LeaderBoard 🏆</h1>
          </div>

          <div className="LeaderBoard-Content">
            <div className="LeaderBoard-border">
              <div className="LeaderBoard">
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <>
          <div
            className="modal-overlay"
            onClick={closeModal}
          ></div>

          <div
            className="login-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="back-arrow"
              onClick={closeModal}
            >
              ←
            </div>

            <div className={`form-wrapper ${animClass}`}>
              <h2 className="modal-title">
                {isLogin ? "Login" : "Register"}
              </h2>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label>Re-enter Password</label>
                  <input
                    type="password"
                    placeholder="Re-enter Password"
                    value={rePassword}
                    onChange={(e) =>
                      setRePassword(e.target.value)
                    }
                  />
                </div>
              )}

              <button
                className="submit-btn"
                onClick={handleSubmit}
              >
                {isLogin ? "Login" : "Register"}
              </button>

              {error && (
                <p
                  style={{
                    color: "red",
                    marginTop: "10px",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </p>
              )}

              <p className="switch-auth">
                {isLogin ? (
                  <>
                    Don't have an account?{" "}
                    <span onClick={() => switchMode(false)}>
                      Register
                    </span>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <span onClick={() => switchMode(true)}>
                      Login
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default LoginPage;