import { useEffect, useState } from "react";
import "./MemoryArchitect.css";

const levels = {
  Easy: {
    size: 4,
    blocks: 5,
    preview: 4,
    time: 60,
  },
  Medium: {
    size: 5,
    blocks: 8,
    preview: 3,
    time: 75,
  },
  Hard: {
    size: 6,
    blocks: 12,
    preview: 2,
    time: 90,
  },
};

const shuffle = (array) =>
  [...array].sort(() => Math.random() - 0.5);

function createPattern(size, blockCount) {
  const total = size * size;

  const positions = Array.from(
    { length: total },
    (_, index) => index
  );

  return shuffle(positions).slice(0, blockCount);
}

function MemoryArchitect({ onBack }) {
  const [difficulty, setDifficulty] = useState("Easy");
  const [phase, setPhase] = useState("briefing");

  const [pattern, setPattern] = useState([]);
  const [selected, setSelected] = useState([]);

  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const [previewTime, setPreviewTime] = useState(0);

  const level = levels[difficulty];

  /* TIMER */
  useEffect(() => {
    if (phase !== "playing") return;

    if (timeLeft <= 0) {
      setPhase("failed");
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  /* PREVIEW TIMER */
  useEffect(() => {
    if (phase !== "preview") return;

    if (previewTime <= 0) {
      setPhase("playing");
      setTimeLeft(level.time);
      return;
    }

    const timer = setTimeout(() => {
      setPreviewTime((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, previewTime, level.time]);

  /* START */
  const startGame = () => {
    const newPattern = createPattern(
      level.size,
      level.blocks
    );

    setPattern(newPattern);
    setSelected([]);

    setScore(0);
    setMistakes(0);

    setPreviewTime(level.preview);
    setTimeLeft(level.time);

    setPhase("preview");
  };

  /* CELL CLICK */
  const handleCellClick = (index) => {
    if (phase !== "playing") return;

    if (selected.includes(index)) return;

    if (pattern.includes(index)) {
      const newSelected = [
        ...selected,
        index,
      ];

      setSelected(newSelected);

      /* SUCCESS */
      if (
        newSelected.length ===
        pattern.length
      ) {
        const accuracyPenalty = mistakes * 20;

        const finalScore = Math.max(
          100,
          pattern.length * 120 +
            timeLeft * 8 -
            accuracyPenalty
        );

        setScore(finalScore);
        setPhase("success");
      }
    } else {
      setMistakes((current) => current + 1);
    }
  };

  /* CHANGE DIFFICULTY */
  const changeDifficulty = (value) => {
    setDifficulty(value);

    setPattern([]);
    setSelected([]);

    setTimeLeft(0);
    setPreviewTime(0);
    setScore(0);
    setMistakes(0);

    setPhase("briefing");
  };

  const isPreviewCell = (index) =>
    pattern.includes(index);

  const isSelectedCell = (index) =>
    selected.includes(index);

  return (
    <main className="architect-game">

      {/* HEADER */}

      <header className="architect-header">

        <button
          className="architect-back"
          onClick={onBack}
        >
          ← MINDVERSE
        </button>

        <div className="architect-brand">

          <span>WORLD 03</span>

          <h1>
            MEMORY ARCHITECT
          </h1>

        </div>

        <div className="architect-score">

          <span>SCORE</span>

          <strong>
            {score}
          </strong>

        </div>

      </header>

      {/* CONTENT */}

      <section className="architect-content">

        <div className="architect-heading">

          <span>
            SPATIAL RECONSTRUCTION
          </span>

          <h2>
            Rebuild what you remember.
          </h2>

          <p>
            Study the structure.
            When it disappears, rebuild
            the exact pattern from memory.
          </p>

        </div>

        {/* DIFFICULTY */}

        <div className="architect-difficulty">

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

        <section className="architect-card">

          {/* BRIEFING */}

          {phase === "briefing" && (
            <div className="architect-state">

              <div className="architect-icon">
                ◆
              </div>

              <span>
                WORLD 03 / MEMORY ARCHITECT
              </span>

              <h3>
                Build the memory.
              </h3>

              <p>
                A structure will appear
                for a few seconds.
                Remember its exact position.
              </p>

              <div className="architect-info">

                <span>
                  GRID {level.size} ×{" "}
                  {level.size}
                </span>

                <span>
                  {level.blocks} BLOCKS
                </span>

                <span>
                  {level.preview}s PREVIEW
                </span>

              </div>

              <button
                className="architect-start"
                onClick={startGame}
              >
                BUILD MEMORY →
              </button>

            </div>
          )}

          {/* PREVIEW */}

          {phase === "preview" && (
            <div className="architect-state">

              <div className="architect-live">

                <span>
                  STUDY THE STRUCTURE
                </span>

                <strong>
                  {previewTime}s
                </strong>

              </div>

              <div
                className="architect-grid preview-grid"
                style={{
                  gridTemplateColumns:
                    `repeat(${level.size}, 1fr)`,
                }}
              >

                {Array.from(
                  {
                    length:
                      level.size *
                      level.size,
                  },
                  (_, index) => (
                    <div
                      key={index}
                      className={
                        isPreviewCell(index)
                          ? "architect-cell target"
                          : "architect-cell"
                      }
                    >
                      {isPreviewCell(
                        index
                      ) && (
                        <span />
                      )}
                    </div>
                  )
                )}

              </div>

              <div className="architect-hint">
                Remember the highlighted blocks.
              </div>

            </div>
          )}

          {/* PLAYING */}

          {phase === "playing" && (
            <div className="architect-state">

              <div className="architect-live">

                <span>
                  REBUILD THE STRUCTURE
                </span>

                <strong>
                  {timeLeft}s
                </strong>

              </div>

              <div className="architect-progress">

                <span>
                  BLOCKS FOUND
                </span>

                <strong>
                  {selected.length} /{" "}
                  {pattern.length}
                </strong>

              </div>

              <div
                className="architect-grid"
                style={{
                  gridTemplateColumns:
                    `repeat(${level.size}, 1fr)`,
                }}
              >

                {Array.from(
                  {
                    length:
                      level.size *
                      level.size,
                  },
                  (_, index) => {

                    const selectedCell =
                      isSelectedCell(index);

                    return (
                      <button
                        key={index}
                        className={
                          selectedCell
                            ? "architect-cell selected-cell"
                            : "architect-cell"
                        }
                        onClick={() =>
                          handleCellClick(
                            index
                          )
                        }
                      >
                        {selectedCell && (
                          <span />
                        )}
                      </button>
                    );
                  }
                )}

              </div>

              <div className="architect-stats">

                <span>
                  MISTAKES: {mistakes}
                </span>

                <span>
                  FIND ALL THE BLOCKS
                </span>

              </div>

            </div>
          )}

          {/* SUCCESS */}

          {phase === "success" && (
            <div className="architect-state result">

              <div className="architect-icon success">
                ✓
              </div>

              <span>
                STRUCTURE RESTORED
              </span>

              <h3>
                Your memory rebuilt it.
              </h3>

              <p>
                Every important position
                was reconstructed correctly.
              </p>

              <strong className="architect-final-score">
                +{score} XP
              </strong>

              <button
                className="architect-start"
                onClick={startGame}
              >
                BUILD ANOTHER →
              </button>

            </div>
          )}

          {/* FAILED */}

          {phase === "failed" && (
            <div className="architect-state result">

              <div className="architect-icon failed">
                ×
              </div>

              <span>
                STRUCTURE LOST
              </span>

              <h3>
                The blueprint faded.
              </h3>

              <p>
                Try again and reconstruct
                the pattern before time runs out.
              </p>

              <button
                className="architect-start"
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

export default MemoryArchitect;