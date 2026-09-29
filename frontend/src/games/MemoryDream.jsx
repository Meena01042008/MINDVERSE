import { useEffect, useState } from "react";
import "./MemoryDream.css";

const levels = {
  Easy: {
    length: 4,
    rounds: 4,
    time: 60,
    decoys: 0,
  },
  Medium: {
    length: 6,
    rounds: 5,
    time: 55,
    decoys: 2,
  },
  Hard: {
    length: 8,
    rounds: 6,
    time: 50,
    decoys: 3,
  },
};

const symbols = [
  "◆",
  "●",
  "▲",
  "★",
  "☾",
  "✦",
  "■",
  "✚",
  "◇",
  "⬟",
  "☀",
  "♥",
];

const shuffle = (array) =>
  [...array].sort(() => Math.random() - 0.5);

function createVault(level) {
  const sequence = shuffle(symbols).slice(
    0,
    level.length
  );

  const decoys = shuffle(
    symbols.filter(
      (symbol) => !sequence.includes(symbol)
    )
  ).slice(0, level.decoys);

  return {
    sequence,
    decoys,
  };
}

function MemoryDream({ onBack }) {
  const [difficulty, setDifficulty] =
    useState("Easy");

  const [phase, setPhase] =
    useState("briefing");

  const [vault, setVault] =
    useState(null);

  const [round, setRound] =
    useState(1);

  const [userSequence, setUserSequence] =
    useState([]);

  const [timeLeft, setTimeLeft] =
    useState(0);

  const [score, setScore] =
    useState(0);

  const [mistakes, setMistakes] =
    useState(0);

  const [message, setMessage] =
    useState("");

  const level = levels[difficulty];

  /* TIMER */

  useEffect(() => {
    if (
      phase !== "preview" &&
      phase !== "playing"
    ) {
      return;
    }

    if (timeLeft <= 0) {
      setPhase("failed");
      setMessage(
        "The vault locked before you completed the sequence."
      );
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(
        (current) => current - 1
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  /* PREVIEW TIMER */

  useEffect(() => {
    if (phase !== "preview") return;

    const previewTime =
      difficulty === "Easy"
        ? 3500
        : difficulty === "Medium"
        ? 3000
        : 2500;

    const timer = setTimeout(() => {
      setPhase("playing");
    }, previewTime);

    return () => clearTimeout(timer);
  }, [phase, difficulty]);

  /* START */

  const startGame = () => {
    const newVault =
      createVault(level);

    setVault(newVault);
    setRound(1);
    setUserSequence([]);
    setScore(0);
    setMistakes(0);
    setTimeLeft(level.time);
    setMessage("");
    setPhase("preview");
  };

  /* PLAYER SELECT */

  const selectSymbol = (symbol) => {
    if (phase !== "playing") return;

    if (
      userSequence.length >=
      level.length
    ) {
      return;
    }

    const nextSequence = [
      ...userSequence,
      symbol,
    ];

    setUserSequence(nextSequence);

    /* Check immediately */

    const currentIndex =
      nextSequence.length - 1;

    const expected =
      vault.sequence[currentIndex];

    if (symbol !== expected) {
      setMistakes(
        (current) => current + 1
      );

      setMessage(
        "Wrong symbol. The vault rejected the sequence."
      );

      setTimeout(() => {
        setUserSequence([]);
        setMessage("");
      }, 700);

      return;
    }

    /* Completed sequence */

    if (
      nextSequence.length ===
      vault.sequence.length
    ) {
      const roundScore =
        200 + timeLeft * 5;

      setScore(
        (current) =>
          current + roundScore
      );

      if (round >= level.rounds) {
        setPhase("success");
        setMessage(
          "You unlocked every memory vault."
        );
        return;
      }

      setMessage(
        "Vault unlocked. Next memory loading..."
      );

      setTimeout(() => {
        setVault(createVault(level));
        setUserSequence([]);
        setRound(
          (current) => current + 1
        );
        setMessage("");
        setPhase("preview");
      }, 800);
    }
  };

  /* DIFFICULTY */

  const changeDifficulty = (value) => {
    setDifficulty(value);
    setPhase("briefing");
    setVault(null);
    setRound(1);
    setUserSequence([]);
    setTimeLeft(0);
    setScore(0);
    setMistakes(0);
    setMessage("");
  };

  return (
    <main className="dream-game">

      {/* HEADER */}

      <header className="dream-header">

        <button
          className="dream-back"
          onClick={onBack}
        >
          ← MINDVERSE
        </button>

        <div className="dream-brand">

          <span>WORLD 06</span>

          <h1>
            MEMORY VAULT
          </h1>

        </div>

        <div className="dream-score">

          <span>SCORE</span>

          <strong>
            {score}
          </strong>

        </div>

      </header>

      <section className="dream-content">

        {/* INTRO */}

        <div className="dream-heading">

          <span>
            MEMORY UNLOCK
          </span>

          <h2>
            The vault remembers the order.
          </h2>

          <p>
            Watch the symbols carefully.
            When the vault closes, enter the
            exact sequence to unlock it.
          </p>

        </div>

        {/* DIFFICULTY */}

        <div className="dream-difficulty">

          <span>
            DIFFICULTY
          </span>

          {Object.keys(levels).map(
            (item) => (
              <button
                key={item}
                className={
                  difficulty === item
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  changeDifficulty(item)
                }
              >
                {item}
              </button>
            )
          )}

        </div>

        <section className="dream-card">

          {/* BRIEFING */}

          {phase === "briefing" && (
            <div className="dream-state">

              <div className="dream-icon">
                ◈
              </div>

              <span>
                WORLD 06 / MEMORY VAULT
              </span>

              <h3>
                Unlock the memory vault.
              </h3>

              <p>
                A secret sequence will appear.
                Remember it. Then reproduce it
                exactly after the vault closes.
              </p>

              <div className="dream-info">

                <span>
                  {level.rounds} ROUNDS
                </span>

                <span>
                  {level.length} SYMBOLS
                </span>

                <span>
                  {level.time}s
                </span>

              </div>

              <button
                className="dream-start"
                onClick={startGame}
              >
                OPEN THE VAULT →
              </button>

            </div>
          )}

          {/* PREVIEW */}

          {phase === "preview" &&
            vault && (
              <div className="dream-state">

                <div className="dream-live">

                  <span>
                    REMEMBER THE CODE
                  </span>

                  <strong>
                    ROUND {round} /{" "}
                    {level.rounds}
                  </strong>

                </div>

                <div className="vault-preview">

                  {vault.sequence.map(
                    (symbol, index) => (
                      <div
                        key={`${symbol}-${index}`}
                        className="vault-symbol"
                      >
                        <small>
                          {index + 1}
                        </small>

                        <strong>
                          {symbol}
                        </strong>
                      </div>
                    )
                  )}

                </div>

                <p className="dream-preview-text">
                  The vault is memorizing your memory...
                </p>

              </div>
            )}

          {/* PLAYING */}

          {phase === "playing" &&
            vault && (
              <div className="dream-state">

                <div className="dream-live">

                  <span>
                    UNLOCK THE VAULT
                  </span>

                  <strong>
                    {timeLeft}s
                  </strong>

                </div>

                <div className="vault-lock">

                  <div className="vault-lock-icon">
                    ◈
                  </div>

                  <span>
                    ENTER MEMORY CODE
                  </span>

                  <strong>
                    {userSequence.length} /{" "}
                    {level.length}
                  </strong>

                </div>

                <div className="vault-input">

                  {Array.from({
                    length: level.length,
                  }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className={
                          userSequence[index]
                            ? "vault-slot filled"
                            : "vault-slot"
                        }
                      >
                        {userSequence[index] ||
                          "•"}
                      </div>
                    )
                  )}

                </div>

                <div className="vault-buttons">

                  {shuffle([
                    ...vault.sequence,
                    ...vault.decoys,
                  ]).map(
                    (symbol, index) => (
                      <button
                        key={`${symbol}-${index}`}
                        onClick={() =>
                          selectSymbol(symbol)
                        }
                        disabled={userSequence.includes(
                          symbol
                        )}
                      >
                        {symbol}
                      </button>
                    )
                  )}

                </div>

                <div className="dream-stats">

                  <span>
                    ROUND: {round} /{" "}
                    {level.rounds}
                  </span>

                  <span>
                    MISTAKES: {mistakes}
                  </span>

                </div>

                {message && (
                  <div className="dream-message">
                    {message}
                  </div>
                )}

              </div>
            )}

          {/* SUCCESS */}

          {phase === "success" && (
            <div className="dream-state result">

              <div className="dream-icon success">
                ✓
              </div>

              <span>
                VAULT UNLOCKED
              </span>

              <h3>
                Every memory was recovered.
              </h3>

              <p>
                {message}
              </p>

              <strong className="dream-final-score">
                +{score} XP
              </strong>

              <button
                className="dream-start"
                onClick={startGame}
              >
                UNLOCK AGAIN →
              </button>

            </div>
          )}

          {/* FAILED */}

          {phase === "failed" && (
            <div className="dream-state result">

              <div className="dream-icon failed">
                ×
              </div>

              <span>
                VAULT LOCKED
              </span>

              <h3>
                The memory code was lost.
              </h3>

              <p>
                {message}
              </p>

              <button
                className="dream-start"
                onClick={startGame}
              >
                TRY AGAIN →
              </button>

            </div>
          )}

        </section>

      </section>

    </main>
  );
}

export default MemoryDream;