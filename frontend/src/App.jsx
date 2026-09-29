import { useState } from "react";

import Login from "./Login";

import MemoryMystery from "./games/MemoryMystery";
import MemoryShadow from "./games/MemoryShadow";
import MemoryArchitect from "./games/MemoryArchitect";
import MemoryGravity from "./games/MemoryGravity";
import MemorySignal from "./games/MemorySignal";
import MemoryDream from "./games/MemoryDream";
import MemoryFusion from "./games/MemoryFusion";
import MemoryEcho from "./games/MemoryEcho";

import "./App.css";
import "./games/WorldCommon.css";

const worlds = [
  {
    id: "01",
    name: "MEMORY MYSTERY",
    type: "INVESTIGATION",
    text: "Investigate clues. Remember details. Solve the mystery.",
    symbol: "◈",
    game: "memory-mystery",
  },
  {
    id: "02",
    name: "MEMORY SHADOW",
    type: "TIME & MOVEMENT",
    text: "Your past actions return as a shadow. Use them to solve the world.",
    symbol: "◇",
    game: "memory-shadow",
  },
  {
    id: "03",
    name: "MEMORY ARCHITECT",
    type: "SPATIAL RECONSTRUCTION",
    text: "Remember a structure. Rebuild it from memory.",
    symbol: "◆",
    game: "memory-architect",
  },
  {
    id: "04",
    name: "MEMORY GRAVITY",
    type: "RULE MEMORY",
    text: "Remember the world's hidden physical rule.",
    symbol: "↓",
    game: "memory-gravity",
  },
  {
    id: "05",
    name: "MEMORY SIGNAL",
    type: "PATTERN",
    text: "Listen to the signal. Reconstruct the sequence.",
    symbol: "●",
    game: "memory-signal",
  },
  {
    id: "06",
    name: "MEMORY DREAM",
    type: "SURREAL OBSERVATION",
    text: "The dream changes. Remember what was different.",
    symbol: "☾",
    game: "memory-dream",
  },
  {
    id: "07",
    name: "MEMORY FUSION",
    type: "REASONING",
    text: "Connect fragmented memories and rebuild the hidden identity.",
    symbol: "∞",
    game: "memory-fusion",
  },
  {
    id: "08",
    name: "MEMORY ECHO",
    type: "SIGNATURE WORLD",
    text: "The game remembers you. Your memories become part of the final world.",
    symbol: "✦",
    game: "memory-echo",
  },
];

function App() {
  const [activeGame, setActiveGame] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState({
    username: "",
    mobile: "",
    email: "",
  });

  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  const handleLogin = (userData) => {
    setUser(userData);
    setScore(0);
    setLevel(1);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser({
      username: "",
      mobile: "",
      email: "",
    });

    setScore(0);
    setLevel(1);
    setActiveGame(null);
    setShowProfile(false);
    setIsLoggedIn(false);
  };

  const openGame = (game) => {
    setShowProfile(false);
    setActiveGame(game);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goHome = () => {
    setActiveGame(null);
    setShowProfile(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openProfile = () => {
    setActiveGame(null);
    setShowProfile(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goToSection = (sectionId) => {
    setActiveGame(null);
    setShowProfile(false);

    setTimeout(() => {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  /*
    Game level completion.

    When a game calls:

    onLevelComplete(50)

    score increases by 50
    and level increases by 1.
  */

  const handleLevelComplete = (points = 50) => {
    setScore((previousScore) => previousScore + points);

    setLevel((previousLevel) => previousLevel + 1);
  };

  /* =========================
     LOGIN
  ========================= */

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  /* =========================
     PROFILE
  ========================= */

  if (showProfile) {
    return (
      <main className="app">

        <div className="page-overlay"></div>

        <nav className="top-navbar">

          <div className="navbar-logo">
            MINDVERSE
          </div>

          <div className="navbar-links">

            <button onClick={goHome}>
              Home
            </button>

            <button
              onClick={() => goToSection("worlds-section")}
            >
              Worlds
            </button>

            <button
              onClick={() => goToSection("how-to-play")}
            >
              How to Play
            </button>

            <button
              onClick={() => goToSection("about-section")}
            >
              About
            </button>

          </div>

          <div className="navbar-right">

            <div className="navbar-stat">
              ⭐ Score: {score}
            </div>

            <div className="navbar-stat">
              📊 Level: {level}
            </div>

            <button
              className="navbar-user"
              onClick={goHome}
            >

              <span className="user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </span>

              <span>
                {user.username}
              </span>

              <span>
                ⌄
              </span>

            </button>

          </div>

        </nav>

        <section className="profile-section">

          <div className="profile-card">

            <button
              className="profile-back"
              onClick={goHome}
            >
              ← Back to Worlds
            </button>

            <div className="profile-header">

              <div className="large-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>

              <div>

                <span className="profile-label">
                  MINDVERSE PLAYER
                </span>

                <h1>
                  {user.username}
                </h1>

              </div>

            </div>

            <div className="profile-details">

              <div className="profile-detail">

                <span>
                  Username
                </span>

                <strong>
                  {user.username}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  Mobile Number
                </span>

                <strong>
                  {user.mobile}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  Email ID
                </span>

                <strong>
                  {user.email}
                </strong>

              </div>

            </div>

            <div className="profile-stats">

              <div>
                <span>⭐</span>
                <small>Total Score</small>
                <strong>{score}</strong>
              </div>

              <div>
                <span>📊</span>
                <small>Current Level</small>
                <strong>{level}</strong>
              </div>

              <div>
                <span>🎮</span>
                <small>Worlds Completed</small>
                <strong>0 / 8</strong>
              </div>

            </div>

            <button
              className="logout-main-button"
              onClick={handleLogout}
            >
              ↪ LOGOUT
            </button>

          </div>

        </section>

      </main>
    );
  }

  /* =========================
     GAME PAGES
  ========================= */

  if (activeGame === "memory-mystery") {
    return (
      <MemoryMystery
        onBack={goHome}
        onLevelComplete={handleLevelComplete}
      />
    );
  }

  if (activeGame === "memory-shadow") {
    return (
      <MemoryShadow
        onBack={goHome}
        onLevelComplete={handleLevelComplete}
      />
    );
  }

  if (activeGame === "memory-architect") {
    return (
      <MemoryArchitect
        onBack={goHome}
        onLevelComplete={handleLevelComplete}
      />
    );
  }

  if (activeGame === "memory-gravity") {
    return (
      <MemoryGravity
        onBack={goHome}
        onLevelComplete={handleLevelComplete}
      />
    );
  }

  if (activeGame === "memory-signal") {
    return (
      <MemorySignal
        onBack={goHome}
        onLevelComplete={handleLevelComplete}
      />
    );
  }

  if (activeGame === "memory-dream") {
    return (
      <MemoryDream
        onBack={goHome}
        onLevelComplete={handleLevelComplete}
      />
    );
  }

  if (activeGame === "memory-fusion") {
    return (
      <MemoryFusion
        onBack={goHome}
        onLevelComplete={handleLevelComplete}
      />
    );
  }

  if (activeGame === "memory-echo") {
    return (
      <MemoryEcho
        onBack={goHome}
        onLevelComplete={handleLevelComplete}
      />
    );
  }

  /* =========================
     HOME PAGE
  ========================= */

  return (
    <main className="app">

      <div className="page-overlay"></div>

      {/* =====================
          NAVBAR
      ===================== */}

      <nav className="top-navbar">

        <div className="navbar-logo">
          MINDVERSE
        </div>

        <div className="navbar-links">

          <button onClick={goHome}>
            Home
          </button>

          <button
            onClick={() => goToSection("worlds-section")}
          >
            Worlds
          </button>

          <button
            onClick={() => goToSection("how-to-play")}
          >
            How to Play
          </button>

          <button
            onClick={() => goToSection("about-section")}
          >
            About
          </button>

        </div>

        <div className="navbar-right">

          <div className="navbar-stat">
            ⭐ Score: {score}
          </div>

          <div className="navbar-stat">
            📊 Level: {level}
          </div>

          <button
            className="navbar-user"
            onClick={openProfile}
          >

            <span className="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </span>

            <span>
              {user.username}
            </span>

            <span>
              ⌄
            </span>

          </button>

        </div>

      </nav>

      {/* =====================
          HERO / HOME
      ===================== */}

      <section
        className="hero"
        id="home-section"
      >

        <div className="hero-content">

          <div className="eyebrow">
            MINDVERSE / MEMORY GAMING PLATFORM
          </div>

          <h1>
            MINDVERSE
          </h1>

          <p className="tagline">
            PLAY • THINK • EXPLORE • EVOLVE
          </p>

          <p className="hero-description">
            A world where your memory becomes part of the game.
            Explore eight unique memory worlds and discover how
            every decision changes what comes next.
          </p>

          <div className="hero-line"></div>

        </div>

      </section>

      {/* =====================
          WORLDS
      ===================== */}

      <section
        className="world-section"
        id="worlds-section"
      >

        <div className="section-heading">

          <div>

            <span>
              THE MEMORY WORLDS
            </span>

            <h2>
              Choose your world.
            </h2>

          </div>

          <p>
            Eight different experiences.
            One evolving memory journey.
          </p>

        </div>

        <div className="world-grid">

          {worlds.map((world) => (

            <button
              key={world.id}
              className="world-card"
              onClick={() => openGame(world.game)}
            >

              <div className="world-top">

                <span className="world-number">
                  WORLD {world.id}
                </span>

                <span className="world-symbol">
                  {world.symbol}
                </span>

              </div>

              <div className="world-body">

                <span className="world-type">
                  {world.type}
                </span>

                <h3>
                  {world.name}
                </h3>

                <p>
                  {world.text}
                </p>

              </div>

              <div className="world-footer">

                <span>
                  ENTER WORLD
                </span>

                <span>
                  →
                </span>

              </div>

            </button>

          ))}

        </div>

      </section>

      {/* =====================
          HOW TO PLAY
      ===================== */}

      <section
        className="experience-section"
        id="how-to-play"
      >

        <div className="experience-card">

          <span>
            HOW TO PLAY
          </span>

          <h2>
            PLAY → REMEMBER → COMPLETE → LEVEL UP
          </h2>

          <p>
            Choose any memory world and complete its challenges.
            Each game tests a different part of your memory,
            observation, pattern recognition or reasoning.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "15px",
              marginTop: "30px",
            }}
          >

            <div className="profile-detail">
              <span>STEP 01</span>
              <strong>Choose a World</strong>
            </div>

            <div className="profile-detail">
              <span>STEP 02</span>
              <strong>Play the Level</strong>
            </div>

            <div className="profile-detail">
              <span>STEP 03</span>
              <strong>Complete the Challenge</strong>
            </div>

            <div className="profile-detail">
              <span>STEP 04</span>
              <strong>Earn Score & Level Up</strong>
            </div>

          </div>

        </div>

      </section>

      {/* =====================
          ABOUT
      ===================== */}

      <section
        className="experience-section"
        id="about-section"
      >

        <div className="experience-card">

          <span>
            ABOUT MINDVERSE
          </span>

          <h2>
            A Game That Remembers You
          </h2>

          <p>
            MINDVERSE is a cognitive gaming platform designed
            around memory, observation, reasoning and pattern
            recognition. The platform contains eight different
            memory worlds, each offering a different gameplay
            experience.
          </p>

          <p style={{ marginTop: "18px" }}>
            Your journey follows:
          </p>

          <h2>
            Experience → Action → Consequence → Memory → Echo
          </h2>

        </div>

      </section>

      {/* =====================
          FOOTER
      ===================== */}

      <footer className="app-footer">

        <span>
          MINDVERSE
        </span>

        <span>
          PLAY • THINK • EXPLORE • EVOLVE
        </span>

      </footer>

    </main>
  );
}

export default App;