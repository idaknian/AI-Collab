import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navigation.css";

function Navigation({ isGuest, setIsGuest }) {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isGamePage =
    location.pathname === "/classic" ||
    location.pathname === "/ranked";

  const handleLogout = () => {
    setIsGuest(true);
    navigate("/");
  };

  const confirmLeave = () => {
    setShowWarning(false);
    navigate("/play");
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <>
      <div className="Navbar">
        <div className="Navbar-kiri">
          <div className="menu-icon" onClick={() => setOpen(!open)}>
            <FiMenu size={28} />
          </div>
        </div>

        <div className="Navbar-tengah"></div>

        <div className="Navbar-kanan">
          <div className="ELO">
            <h2>ELO 🏆: -</h2>
          </div>
        </div>

        {open && (
          <div className="overlay" onClick={() => setOpen(false)}></div>
        )}

        <div
          className={`sidebar ${open ? "active" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sidebar-top">
            <div className="Title">
              <p>WorPler</p>
            </div>

            {isGamePage && (
              <div
                className="Profile"
                onClick={() => setShowWarning(true)}
              >
                🏠 Main Menu
              </div>
            )}

            <div
              className="Profile"
              onClick={() => setShowProfile(true)}
            >
              🙎🏻‍♂️ Profile
            </div>

            <div className="Settings">
              <span>⚙️ Dark Mode</span>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="sidebar-bottom">
            {isGuest ? (
              <>
                <div
                  className="big-btn login-btn"
                  onClick={() =>
                    navigate("/", { state: { openModal: "login" } })
                  }
                >
                  🔑 Log In
                </div>

                <div
                  className="big-btn register-btn"
                  onClick={() =>
                    navigate("/", { state: { openModal: "register" } })
                  }
                >
                  📝 Register
                </div>
              </>
            ) : (
              <div className="big-btn logout-btn" onClick={handleLogout}>
                🚪 Logout
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= PROFILE MODAL ================= */}
      {showProfile && (
        <div
          className="modal-overlay"
          onClick={() => setShowProfile(false)}
        >
          <div
            className="mode-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>👤 Profile</h2>

            <div className="profile-info">
              <p><strong>Status:</strong> {isGuest ? "Guest" : "Logged In"}</p>
              <p><strong>ELO:</strong> -</p>
              <p><strong>Matches Played:</strong> 0</p>
              <p><strong>Win Rate:</strong> 0%</p>
            </div>

            <button
              className="confirm-btn"
              onClick={() => setShowProfile(false)}
              style={{ marginTop: "20px" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= WARNING MODAL ================= */}
      {showWarning && (
        <div className="modal-overlay">
          <div className="mode-modal">
            <h2>Leave Game?</h2>
            <p>
              Your current progress will be lost if you return to the Main Menu.
            </p>

            <div className="warning-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowWarning(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={confirmLeave}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navigation;