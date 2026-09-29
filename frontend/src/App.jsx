import { useState } from "react";

import MemoryMystery from "./games/MemoryMystery";
import MemoryShadow from "./games/MemoryShadow";
import MemoryArchitect from "./games/MemoryArchitect";
import MemoryGravity from "./games/MemoryGravity";
import MemorySignal from "./games/MemorySignal";
import MemoryDream from "./games/MemoryDream";
import MemoryFusion from "./games/MemoryFusion";
import MemoryEcho from "./games/MemoryEcho";

import "./App.css";

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

  const openGame = (game) => {
    setActiveGame(game);
  };

  const goHome = () => {
    setActiveGame(null);
  };

  if (activeGame === "memory-mystery") {
    return <MemoryMystery onBack={goHome} />;
  }

  if (activeGame === "memory-shadow") {
    return <MemoryShadow onBack={goHome} />;
  }

  if (activeGame === "memory-architect") {
    return <MemoryArchitect onBack={goHome} />;
  }

  if (activeGame === "memory-gravity") {
    return <MemoryGravity onBack={goHome} />;
  }

  if (activeGame === "memory-signal") {
    return <MemorySignal onBack={goHome} />;
  }

  if (activeGame === "memory-dream") {
    return <MemoryDream onBack={goHome} />;
  }

  if (activeGame === "memory-fusion") {
    return <MemoryFusion onBack={goHome} />;
  }

  if (activeGame === "memory-echo") {
    return <MemoryEcho onBack={goHome} />;
  }

  return (
    <main className="app">
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">MINDVERSE / MEMORY GAMING PLATFORM</div>

          <h1>MINDVERSE</h1>

          <p className="tagline">
            PLAY • THINK • EXPLORE • EVOLVE
          </p>

          <p className="hero-description">
            A world where your memory becomes part of the game.
            Explore eight unique memory worlds and discover how
            every decision changes what comes next.
          </p>

          <div className="hero-line" />
        </div>
      </section>

      <section className="world-section">
        <div className="section-heading">
          <div>
            <span>THE MEMORY WORLDS</span>
            <h2>Choose your world.</h2>
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

                <h3>{world.name}</h3>

                <p>{world.text}</p>
              </div>

              <div className="world-footer">
                <span>ENTER WORLD</span>
                <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="experience-section">
        <div className="experience-card">
          <span>THE CORE IDEA</span>

          <h2>
            Experience → Action → Consequence → Memory → Echo
          </h2>

          <p>
            MINDVERSE is designed around one idea:
            the player does not simply play the game —
            the game remembers the player.
          </p>
        </div>
      </section>

      <footer className="app-footer">
        <span>MINDVERSE</span>
        <span>PLAY • THINK • EXPLORE • EVOLVE</span>
      </footer>
    </main>
  );
}

export default App;