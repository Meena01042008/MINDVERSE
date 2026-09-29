import { useEffect, useState } from "react";
import "./MemoryEcho.css";

const levels = {
  Easy: {
    objects: 6,
    changes: 1,
    rounds: 5,
    time: 60,
    preview: 3500,
  },
  Medium: {
    objects: 8,
    changes: 2,
    rounds: 6,
    time: 55,
    preview: 4000,
  },
  Hard: {
    objects: 10,
    changes: 3,
    rounds: 7,
    time: 50,
    preview: 4500,
  },
};

const objectPool = [
  { id: "chair", symbol: "🪑", name: "Chair" },
  { id: "lamp", symbol: "💡", name: "Lamp" },
  { id: "plant", symbol: "🌿", name: "Plant" },
  { id: "book", symbol: "📕", name: "Book" },
  { id: "clock", symbol: "🕐", name: "Clock" },
  { id: "cup", symbol: "☕", name: "Cup" },
  { id: "picture", symbol: "🖼️", name: "Picture" },
  { id: "flower", symbol: "🌸", name: "Flower" },
  { id: "ball", symbol: "⚽", name: "Ball" },
  { id: "box", symbol: "📦", name: "Box" },
  { id: "star", symbol: "⭐", name: "Star" },
  { id: "key", symbol: "🔑", name: "Key" },
];

const shuffle = (array) =>
  [...array].sort(() => Math.random() - 0.5);

function createScene(level) {
  const selected = shuffle(objectPool).slice(0, level.objects);

  const changedIndexes = shuffle(
    Array.from(
      { length: level.objects },
      (_, index) => index
    )
  ).slice(0, level.changes);

  const changedObjects = selected.map((item, index) => {
    if (!changedIndexes.includes(index)) {
      return {
        ...item,
        changed: false,
      };
    }

    const alternatives = objectPool.filter(
      (candidate) =>
        candidate.id !== item.id &&
        !selected.some(
          (selectedItem) =>
            selectedItem.id === candidate.id
        )
    );

    const replacement =
      alternatives.length > 0
        ? alternatives[
            Math.floor(
              Math.random() * alternatives.length
            )
          ]
        : shuffle(objectPool).find(
            (candidate) => candidate.id !== item.id
          );

    return {
      ...replacement,
      changed: true,
      originalId: item.id,
    };
  });

  return {
    before: selected,
    after: changedObjects,
    changedIndexes,
  };
}

function MemoryEcho({ onBack }) {
  const [difficulty, setDifficulty] =
    useState("Easy");

  const [phase, setPhase] =
    useState("briefing");

  const [scene, setScene] =
    useState(null);

  const [round, setRound] =
    useState(1);

  const [foundChanges, setFoundChanges] =
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
        "Time ran out before all changes were found."
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

  /* PREVIEW */

  useEffect(() => {
    if (phase !== "preview") return;

    const timer = setTimeout(() => {
      setPhase("playing");
    }, level.preview);

    return () => clearTimeout(timer);
  }, [phase, level.preview]);

  /* START */

  const startGame = () => {
    const newScene = createScene(level);

    setScene(newScene);
    setRound(1);
    setFoundChanges([]);
    setTimeLeft(level.time);
    setScore(0);
    setMistakes(0);
    setMessage("");
    setPhase("preview");
  };

  /* CLICK SCENE */

  const handleObjectClick = (index) => {
    if (phase !== "playing") return;

    if (foundChanges.includes(index)) {
      return;
    }

    const isChanged =
      scene.changedIndexes.includes(index);

    if (isChanged) {
      const updatedFound = [
        ...foundChanges,
        index,
      ];

      setFoundChanges(updatedFound);

      const roundScore =
        150 + timeLeft * 5;

      setScore(
        (current) =>
          current + roundScore
      );

      setMessage("Change found!");

      if (
        updatedFound.length ===
        scene.changedIndexes.length
      ) {
        if (round >= level.rounds) {
          setPhase("success");
          setMessage(
            "You spotted every change."
          );
          return;
        }

        setTimeout(() => {
          const nextScene =
            createScene(level);

          setScene(nextScene);
          setRound(
            (current) => current + 1
          );
          setFoundChanges([]);
          setMessage("");
          setPhase("preview");
        }, 700);
      }
    } else {
      setMistakes(
        (current) => current + 1
      );

      setScore(
        (current) =>
          Math.max(0, current - 15)
      );

      setMessage(
        "Nothing changed here. Look carefully."
      );
    }
  };

  /* DIFFICULTY */

  const changeDifficulty = (value) => {
    setDifficulty(value);
    setPhase("briefing");
    setScene(null);
    setRound(1);
    setFoundChanges([]);
    setTimeLeft(0);
    setScore(0);
    setMistakes(0);
    setMessage("");
  };

  return (
    <main className="echo-game">

      {/* HEADER */}

      <header className="echo-header">

        <button
          className="echo-back"
          onClick={onBack}
        >
          ← MINDVERSE
        </button>

        <div className="echo-brand">

          <span>
            WORLD 08
          </span>

          <h1>
            MEMORY DETECTIVE
          </h1>

        </div>

        <div className="echo-score">

          <span>
            SCORE
          </span>

          <strong>
            {score}
          </strong>

        </div>

      </header>

      <section className="echo-content">

        {/* HEADING */}

        <div className="echo-heading">

          <span>
            VISUAL OBSERVATION
          </span>

          <h2>
            Something changed. Can you find it?
          </h2>

          <p>
            Study the scene carefully. When it
            changes, find what is different.
          </p>

        </div>

        {/* DIFFICULTY */}

        <div className="echo-difficulty">

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

        <section className="echo-card">

          {/* BRIEFING */}

          {phase === "briefing" && (
            <div className="echo-state">

              <div className="echo-icon">
                👁
              </div>

              <span>
                WORLD 08 / MEMORY DETECTIVE
              </span>

              <h3>
                Observe. Remember. Detect.
              </h3>

              <p>
                A scene will appear for a few
                seconds. Then something will change.
                Find every changed object.
              </p>

              <div className="echo-info">

                <span>
                  {level.rounds} ROUNDS
                </span>

                <span>
                  {level.changes} CHANGE
                  {level.changes > 1 ? "S" : ""}
                </span>

                <span>
                  {level.time}s
                </span>

              </div>

              <button
                className="echo-start"
                onClick={startGame}
              >
                START DETECTIVE MODE →
              </button>

            </div>
          )}

          {/* BEFORE SCENE */}

          {phase === "preview" &&
            scene && (
              <div className="echo-state">

                <div className="echo-live">

                  <span>
                    STUDY THE SCENE
                  </span>

                  <strong>
                    ROUND {round} /{" "}
                    {level.rounds}
                  </strong>

                </div>

                <div
                  className={`detective-grid grid-${level.objects}`}
                >

                  {scene.before.map(
                    (item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className="detective-object"
                      >

                        <span>
                          {item.symbol}
                        </span>

                        <small>
                          {item.name}
                        </small>

                      </div>
                    )
                  )}

                </div>

                <p className="echo-preview-text">
                  Remember every detail...
                </p>

              </div>
            )}

          {/* AFTER / PLAYING */}

          {phase === "playing" &&
            scene && (
              <div className="echo-state">

                <div className="echo-live">

                  <span>
                    FIND THE CHANGES
                  </span>

                  <strong>
                    {timeLeft}s
                  </strong>

                </div>

                <div className="detective-target">

                  <span>
                    CHANGES FOUND
                  </span>

                  <strong>
                    {foundChanges.length} /{" "}
                    {scene.changedIndexes.length}
                  </strong>

                </div>

                <div
                  className={`detective-grid grid-${level.objects}`}
                >

                  {scene.after.map(
                    (item, index) => {

                      const found =
                        foundChanges.includes(
                          index
                        );

                      return (
                        <button
                          key={`${item.id}-${index}`}
                          className={
                            found
                              ? "detective-object found"
                              : "detective-object"
                          }
                          onClick={() =>
                            handleObjectClick(
                              index
                            )
                          }
                        >

                          <span>
                            {item.symbol}
                          </span>

                          <small>
                            {item.name}
                          </small>

                          {found && (
                            <b>
                              ✓
                            </b>
                          )}

                        </button>
                      );
                    }
                  )}

                </div>

                <div className="echo-stats">

                  <span>
                    ROUND: {round} /{" "}
                    {level.rounds}
                  </span>

                  <span>
                    MISTAKES: {mistakes}
                  </span>

                </div>

                {message && (
                  <div className="echo-message">
                    {message}
                  </div>
                )}

              </div>
            )}

          {/* SUCCESS */}

          {phase === "success" && (
            <div className="echo-state result">

              <div className="echo-icon success">
                ✓
              </div>

              <span>
                MEMORY DETECTIVE COMPLETE
              </span>

              <h3>
                You spotted every change.
              </h3>

              <p>
                Nothing escaped your observation.
              </p>

              <strong className="echo-final-score">
                +{score} XP
              </strong>

              <button
                className="echo-start"
                onClick={startGame}
              >
                DETECT AGAIN →
              </button>

            </div>
          )}

          {/* FAILED */}

          {phase === "failed" && (
            <div className="echo-state result">

              <div className="echo-icon failed">
                ×
              </div>

              <span>
                CASE UNSOLVED
              </span>

              <h3>
                Some changes were missed.
              </h3>

              <p>
                {message}
              </p>

              <button
                className="echo-start"
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

export default MemoryEcho;