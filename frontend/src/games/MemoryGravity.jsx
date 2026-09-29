import { useEffect, useState } from "react";
import "./MemoryGravity.css";

const levels = {
  Easy: {
    rounds: 3,
    sequenceLength: 1,
    time: 60,
  },
  Medium: {
    rounds: 4,
    sequenceLength: 2,
    time: 75,
  },
  Hard: {
    rounds: 5,
    sequenceLength: 3,
    time: 90,
  },
};

const directions = [
  {
    id: "up",
    symbol: "↑",
    name: "UP",
  },
  {
    id: "right",
    symbol: "→",
    name: "RIGHT",
  },
  {
    id: "down",
    symbol: "↓",
    name: "DOWN",
  },
  {
    id: "left",
    symbol: "←",
    name: "LEFT",
  },
];

const shuffle = (array) =>
  [...array].sort(() => Math.random() - 0.5);

const createSequence = (length) => {
  return Array.from(
    { length },
    () =>
      directions[
        Math.floor(
          Math.random() * directions.length
        )
      ].id
  );
};

function getDirection(id) {
  return directions.find(
    (direction) => direction.id === id
  );
}

function MemoryGravity({ onBack }) {
  const [difficulty, setDifficulty] =
    useState("Easy");

  const [phase, setPhase] =
    useState("briefing");

  const [sequence, setSequence] =
    useState([]);

  const [round, setRound] =
    useState(1);

  const [sequenceIndex, setSequenceIndex] =
    useState(0);

  const [previewDirection, setPreviewDirection] =
    useState(null);

  const [selectedDirections, setSelectedDirections] =
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
      phase !== "playing" &&
      phase !== "preview"
    ) {
      return;
    }

    if (timeLeft <= 0) {
      setPhase("failed");
      setMessage(
        "Gravity became too strong."
      );
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(
        (current) => current - 1
      );
    }, 1000);

    return () =>
      clearTimeout(timer);
  }, [phase, timeLeft]);

  /* PREVIEW */

  useEffect(() => {
    if (phase !== "preview") {
      return;
    }

    const currentDirection =
      sequence[sequenceIndex];

    setPreviewDirection(
      currentDirection
    );

    const timer = setTimeout(() => {
      setPreviewDirection(null);
      setPhase("playing");
    }, 1800);

    return () => clearTimeout(timer);
  }, [
    phase,
    sequence,
    sequenceIndex,
  ]);

  /* START GAME */

  const startGame = () => {
    const newSequence =
      createSequence(
        level.sequenceLength
      );

    setSequence(newSequence);
    setRound(1);
    setSequenceIndex(0);
    setPreviewDirection(
      newSequence[0]
    );

    setSelectedDirections([]);
    setMistakes(0);
    setScore(0);
    setTimeLeft(level.time);
    setMessage("");

    setPhase("preview");
  };

  /* PLAYER SELECTS DIRECTION */

  const chooseDirection = (direction) => {
    if (phase !== "playing") {
      return;
    }

    const correctDirection =
      sequence[sequenceIndex];

    if (
      direction === correctDirection
    ) {
      const newSelected = [
        ...selectedDirections,
        direction,
      ];

      setSelectedDirections(
        newSelected
      );

      /* SEQUENCE COMPLETE */

      if (
        sequenceIndex ===
        sequence.length - 1
      ) {
        const roundBonus =
          150 + timeLeft * 5;

        setScore(
          (current) =>
            current + roundBonus
        );

        /* ALL ROUNDS COMPLETE */

        if (round >= level.rounds) {
          setPhase("success");
          setMessage(
            "You remembered every gravity shift."
          );
          return;
        }

        /* NEXT ROUND */

        const nextSequence =
          createSequence(
            level.sequenceLength
          );

        setSequence(nextSequence);
        setRound(
          (current) => current + 1
        );
        setSequenceIndex(0);
        setSelectedDirections([]);
        setPreviewDirection(
          nextSequence[0]
        );

        setPhase("preview");

      } else {
        setSequenceIndex(
          (current) => current + 1
        );

        setPreviewDirection(
          sequence[
            sequenceIndex + 1
          ]
        );

        setPhase("preview");
      }

    } else {
      setMistakes(
        (current) => current + 1
      );

      setMessage(
        "Wrong gravity direction. Try again."
      );
    }
  };

  /* DIFFICULTY */

  const changeDifficulty = (value) => {
    setDifficulty(value);

    setSequence([]);
    setSelectedDirections([]);
    setRound(1);
    setSequenceIndex(0);
    setPreviewDirection(null);

    setTimeLeft(0);
    setScore(0);
    setMistakes(0);
    setMessage("");

    setPhase("briefing");
  };

  return (
    <main className="gravity-game">

      {/* HEADER */}

      <header className="gravity-header">

        <button
          className="gravity-back"
          onClick={onBack}
        >
          ← MINDVERSE
        </button>

        <div className="gravity-brand">

          <span>WORLD 04</span>

          <h1>
            MEMORY GRAVITY
          </h1>

        </div>

        <div className="gravity-score">

          <span>SCORE</span>

          <strong>
            {score}
          </strong>

        </div>

      </header>

      {/* CONTENT */}

      <section className="gravity-content">

        <div className="gravity-heading">

          <span>
            HIDDEN RULE
          </span>

          <h2>
            Remember which way gravity falls.
          </h2>

          <p>
            The force will reveal itself.
            When it disappears, restore the
            correct direction from memory.
          </p>

        </div>

        {/* DIFFICULTY */}

        <div className="gravity-difficulty">

          <span>DIFFICULTY</span>

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

        <section className="gravity-card">

          {/* BRIEFING */}

          {phase === "briefing" && (
            <div className="gravity-state">

              <div className="gravity-icon">
                ↓
              </div>

              <span>
                WORLD 04 / MEMORY GRAVITY
              </span>

              <h3>
                The world has a hidden force.
              </h3>

              <p>
                Watch the gravity direction.
                Once it disappears, select
                the same direction from memory.
              </p>

              <div className="gravity-info">

                <span>
                  {level.rounds} ROUNDS
                </span>

                <span>
                  {level.sequenceLength}{" "}
                  DIRECTION
                  {level.sequenceLength > 1
                    ? "S"
                    : ""}
                </span>

                <span>
                  {level.time}s
                </span>

              </div>

              <button
                className="gravity-start"
                onClick={startGame}
              >
                ENTER GRAVITY →
              </button>

            </div>
          )}

          {/* PREVIEW */}

          {phase === "preview" && (
            <div className="gravity-state">

              <div className="gravity-live">

                <span>
                  REMEMBER THE FORCE
                </span>

                <strong>
                  ROUND {round} /{" "}
                  {level.rounds}
                </strong>

              </div>

              <div className="gravity-orbit">

                <div className="gravity-core">
                  ●
                </div>

                <div
                  className={`gravity-arrow gravity-${previewDirection}`}
                >
                  {
                    getDirection(
                      previewDirection
                    )?.symbol
                  }
                </div>

              </div>

              <p className="gravity-preview-text">
                Watch carefully...
              </p>

            </div>
          )}

          {/* PLAYING */}

          {phase === "playing" && (
            <div className="gravity-state">

              <div className="gravity-live">

                <span>
                  RESTORE THE FORCE
                </span>

                <strong>
                  {timeLeft}s
                </strong>

              </div>

              <div className="gravity-round">

                ROUND {round} /{" "}
                {level.rounds}

              </div>

              <div className="gravity-orbit">

                <div className="gravity-core">
                  ●
                </div>

                <div className="gravity-question">
                  ?
                </div>

              </div>

              <p className="gravity-prompt">
                Which direction did gravity pull?
              </p>

              <div className="gravity-directions">

                {shuffle(
                  directions
                ).map(
                  (direction) => (
                    <button
                      key={direction.id}
                      onClick={() =>
                        chooseDirection(
                          direction.id
                        )
                      }
                    >
                      <span>
                        {direction.symbol}
                      </span>

                      <small>
                        {direction.name}
                      </small>
                    </button>
                  )
                )}

              </div>

              <div className="gravity-stats">

                <span>
                  MISTAKES: {mistakes}
                </span>

                <span>
                  MEMORY SHIFT:{" "}
                  {sequenceIndex + 1} /{" "}
                  {sequence.length}
                </span>

              </div>

            </div>
          )}

          {/* SUCCESS */}

          {phase === "success" && (
            <div className="gravity-state result">

              <div className="gravity-icon success">
                ✓
              </div>

              <span>
                GRAVITY RESTORED
              </span>

              <h3>
                You remembered the hidden force.
              </h3>

              <p>
                {message}
              </p>

              <strong className="gravity-final-score">
                +{score} XP
              </strong>

              <button
                className="gravity-start"
                onClick={startGame}
              >
                SHIFT GRAVITY AGAIN →
              </button>

            </div>
          )}

          {/* FAILED */}

          {phase === "failed" && (
            <div className="gravity-state result">

              <div className="gravity-icon failed">
                ×
              </div>

              <span>
                GRAVITY LOST
              </span>

              <h3>
                The force escaped your memory.
              </h3>

              <p>
                {message}
              </p>

              <button
                className="gravity-start"
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

export default MemoryGravity;