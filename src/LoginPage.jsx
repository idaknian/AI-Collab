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
  const handleSubmit = () => {
    setError("");

    const TEST_USERNAME = "admin";
    const TEST_PASSWORD = "12345";

    // VALIDASI
    if (username.length === 0 || username.length > 8) {
      setError("Username maksimal 8 huruf!");
      return;
    }

    if (password.length < 5 || password.length > 10) {
      setError("Password minimal 5 & maksimal 10 huruf!");
      return;
    }

    if (isLogin) {
      // LOGIN MODE
      if (
        username === TEST_USERNAME &&
        password === TEST_PASSWORD
      ) {
        setIsGuest(false);
        setShowModal(false);
        navigate("/play");
      } else {
        setError("Wrong username / password");
      }
    } else {
      // REGISTER MODE (TESTING DISABLED)
      if (password !== rePassword) {
        setError("Password tidak sama!");
        return;
      }

      setError("Register disabled in testing mode");
    }
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
              {"WorPler".split("").map((char, i) => (
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
                tes
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
            onClick={() => setShowModal(false)}
          ></div>

          <div
            className="login-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="back-arrow"
              onClick={() => setShowModal(false)}
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