import { useEffect, useState } from "react";
import "./MemorySignal.css";

const levels = {
  Easy: {
    rounds: 4,
    choices: 3,
    signalLength: 4,
    previewTime: 1800,
    time: 60,
  },
  Medium: {
    rounds: 5,
    choices: 4,
    signalLength: 6,
    previewTime: 2300,
    time: 75,
  },
  Hard: {
    rounds: 6,
    choices: 5,
    signalLength: 8,
    previewTime: 2800,
    time: 90,
  },
};

const symbols = [
  "◆",
  "●",
  "▲",
  "■",
  "✦",
  "◇",
  "✚",
  "☾",
];

const shuffle = (array) =>
  [...array].sort(() => Math.random() - 0.5);

const createSignal = (length) => {
  return Array.from(
    { length },
    () =>
      symbols[
        Math.floor(
          Math.random() * symbols.length
        )
      ]
  );
};

const sameSignal = (a, b) =>
  a.length === b.length &&
  a.every((item, index) => item === b[index]);

function createChoices(correct, count) {
  const choices = [correct];

  while (choices.length < count) {
    const fake = createSignal(correct.length);

    if (
      !choices.some((item) =>
        sameSignal(item, fake)
      )
    ) {
      choices.push(fake);
    }
  }

  return shuffle(choices);
}

function MemorySignal({ onBack }) {
  const [difficulty, setDifficulty] =
    useState("Easy");

  const [phase, setPhase] =
    useState("briefing");

  const [round, setRound] =
    useState(1);

  const [signal, setSignal] =
    useState([]);

  const [choices, setChoices] =
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
        "The signal disappeared before it was decoded."
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

    const timer = setTimeout(() => {
      setChoices(
        createChoices(
          signal,
          level.choices
        )
      );

      setPhase("playing");
    }, level.previewTime);

    return () =>
      clearTimeout(timer);
  }, [
    phase,
    signal,
    level.choices,
    level.previewTime,
  ]);

  /* START */

  const startGame = () => {
    const newSignal =
      createSignal(
        level.signalLength
      );

    setSignal(newSignal);

    setChoices([]);

    setRound(1);

    setScore(0);

    setMistakes(0);

    setTimeLeft(level.time);

    setMessage("");

    setPhase("preview");
  };

  /* SELECT SIGNAL */

  const selectSignal = (selected) => {
    if (phase !== "playing") {
      return;
    }

    if (sameSignal(selected, signal)) {
      const roundScore =
        100 + timeLeft * 4;

      setScore(
        (current) =>
          current + roundScore
      );

      if (round >= level.rounds) {
        setPhase("success");

        setMessage(
          "Every signal was decoded from memory."
        );

        return;
      }

      const nextSignal =
        createSignal(
          level.signalLength
        );

      setSignal(nextSignal);

      setChoices([]);

      setRound(
        (current) => current + 1
      );

      setPhase("preview");

    } else {
      setMistakes(
        (current) => current + 1
      );

      setMessage(
        "That signal does not match your memory."
      );
    }
  };

  /* DIFFICULTY */

  const changeDifficulty = (value) => {
    setDifficulty(value);

    setPhase("briefing");

    setRound(1);

    setSignal([]);

    setChoices([]);

    setTimeLeft(0);

    setScore(0);

    setMistakes(0);

    setMessage("");
  };

  return (
    <main className="signal-game">

      {/* HEADER */}

      <header className="signal-header">

        <button
          className="signal-back"
          onClick={onBack}
        >
          ← MINDVERSE
        </button>

        <div className="signal-brand">

          <span>WORLD 05</span>

          <h1>
            MEMORY SIGNAL
          </h1>

        </div>

        <div className="signal-score">

          <span>SCORE</span>

          <strong>
            {score}
          </strong>

        </div>

      </header>

      <section className="signal-content">

        {/* INTRO */}

        <div className="signal-heading">

          <span>
            SIGNAL DECODER
          </span>

          <h2>
            Can you recognize the signal?
          </h2>

          <p>
            Watch the signal carefully.
            When it disappears, identify
            the exact pattern from the choices.
          </p>

        </div>

        {/* DIFFICULTY */}

        <div className="signal-difficulty">

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

        <section className="signal-card">

          {/* BRIEFING */}

          {phase === "briefing" && (
            <div className="signal-state">

              <div className="signal-icon">
                ◉
              </div>

              <span>
                WORLD 05 / SIGNAL DECODER
              </span>

              <h3>
                Every signal leaves a trace.
              </h3>

              <p>
                A hidden signal will appear
                for a moment. Remember its
                exact order and find it later.
              </p>

              <div className="signal-info">

                <span>
                  {level.rounds} ROUNDS
                </span>

                <span>
                  {level.signalLength} SYMBOLS
                </span>

                <span>
                  {level.choices} CHOICES
                </span>

              </div>

              <button
                className="signal-start"
                onClick={startGame}
              >
                START SIGNAL →
              </button>

            </div>
          )}

          {/* SIGNAL PREVIEW */}

          {phase === "preview" && (
            <div className="signal-state">

              <div className="signal-live">

                <span>
                  REMEMBER THIS SIGNAL
                </span>

                <strong>
                  ROUND {round} /{" "}
                  {level.rounds}
                </strong>

              </div>

              <div className="signal-display">

                {signal.map(
                  (symbol, index) => (
                    <span
                      key={index}
                      className="signal-symbol"
                    >
                      {symbol}
                    </span>
                  )
                )}

              </div>

              <p className="signal-preview-text">
                Memorize the exact order...
              </p>

            </div>
          )}

          {/* CHOICES */}

          {phase === "playing" && (
            <div className="signal-state">

              <div className="signal-live">

                <span>
                  DECODE THE SIGNAL
                </span>

                <strong>
                  {timeLeft}s
                </strong>

              </div>

              <div className="signal-round">
                ROUND {round} / {level.rounds}
              </div>

              <p className="signal-prompt">
                Which signal did you see?
              </p>

              <div className="signal-choices">

                {choices.map(
                  (choice, index) => (
                    <button
                      key={index}
                      className="signal-choice"
                      onClick={() =>
                        selectSignal(choice)
                      }
                    >

                      <small>
                        SIGNAL {String(
                          index + 1
                        ).padStart(2, "0")}
                      </small>

                      <div>
                        {choice.map(
                          (symbol, symbolIndex) => (
                            <span
                              key={symbolIndex}
                            >
                              {symbol}
                            </span>
                          )
                        )}
                      </div>

                    </button>
                  )
                )}

              </div>

              <div className="signal-stats">

                <span>
                  MISTAKES: {mistakes}
                </span>

                <span>
                  SIGNAL LENGTH:{" "}
                  {signal.length}
                </span>

              </div>

              {message && (
                <div className="signal-message">
                  {message}
                </div>
              )}

            </div>
          )}

          {/* SUCCESS */}

          {phase === "success" && (
            <div className="signal-state result">

              <div className="signal-icon success">
                ✓
              </div>

              <span>
                SIGNAL DECODED
              </span>

              <h3>
                Your memory caught every signal.
              </h3>

              <p>
                {message}
              </p>

              <strong className="signal-final-score">
                +{score} XP
              </strong>

              <button
                className="signal-start"
                onClick={startGame}
              >
                DECODE ANOTHER SIGNAL →
              </button>

            </div>
          )}

          {/* FAILED */}

          {phase === "failed" && (
            <div className="signal-state result">

              <div className="signal-icon failed">
                ×
              </div>

              <span>
                SIGNAL LOST
              </span>

              <h3>
                The signal escaped your memory.
              </h3>

              <p>
                {message}
              </p>

              <button
                className="signal-start"
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

export default MemorySignal;