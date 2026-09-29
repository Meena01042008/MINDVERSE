import { useEffect, useMemo, useState } from "react";
import "./MemoryParadox.css";

const levels = {
  Easy: {
    turns: 3,
    energy: 5,
    target: 3,
    actions: [
      { id: "left", label: "MOVE LEFT", symbol: "←" },
      { id: "right", label: "MOVE RIGHT", symbol: "→" },
      { id: "activate", label: "ACTIVATE", symbol: "◉" },
    ],
  },

  Medium: {
    turns: 4,
    energy: 6,
    target: 4,
    actions: [
      { id: "left", label: "MOVE LEFT", symbol: "←" },
      { id: "right", label: "MOVE RIGHT", symbol: "→" },
      { id: "activate", label: "ACTIVATE", symbol: "◉" },
      { id: "reverse", label: "REVERSE", symbol: "↻" },
    ],
  },

  Hard: {
    turns: 5,
    energy: 7,
    target: 5,
    actions: [
      { id: "left", label: "MOVE LEFT", symbol: "←" },
      { id: "right", label: "MOVE RIGHT", symbol: "→" },
      { id: "activate", label: "ACTIVATE", symbol: "◉" },
      { id: "reverse", label: "REVERSE", symbol: "↻" },
      { id: "freeze", label: "FREEZE", symbol: "◇" },
    ],
  },
};

function MemoryParadox({ onBack }) {
  const [difficulty, setDifficulty] = useState("Easy");
  const [phase, setPhase] = useState("briefing");

  const [turn, setTurn] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [score, setScore] = useState(0);

  const [timeline, setTimeline] = useState([]);
  const [pastAction, setPastAction] = useState(null);

  const [worldPower, setWorldPower] = useState(0);
  const [doorProgress, setDoorProgress] = useState(0);

  const [message, setMessage] = useState("");

  const game = useMemo(() => levels[difficulty], [difficulty]);

  /* --------------------------------------------------
     START
  -------------------------------------------------- */

  const startGame = () => {
    setTurn(0);
    setEnergy(game.energy);
    setScore(0);

    setTimeline([]);
    setPastAction(null);

    setWorldPower(0);
    setDoorProgress(0);

    setMessage("");

    setPhase("timeline");
  };

  /* --------------------------------------------------
     PLAYER CREATES THE PAST
  -------------------------------------------------- */

  const recordAction = (action) => {
    if (energy <= 0) return;

    const newTimeline = [...timeline, action];

    setTimeline(newTimeline);
    setEnergy((value) => value - 1);

    setMessage(
      "Recorded. This action now belongs to your past."
    );

    if (newTimeline.length >= game.turns) {
      setTimeout(() => {
        setTurn(0);
        setPhase("rewind");
      }, 450);
    }
  };

  /* --------------------------------------------------
     REWIND
  -------------------------------------------------- */

  const startRewind = () => {
    setTurn(0);
    setPastAction(null);
    setWorldPower(0);
    setDoorProgress(0);
    setMessage("Your past is returning...");
    setPhase("echo");
  };

  useEffect(() => {
    if (phase !== "echo") return;

    if (turn >= timeline.length) {
      if (doorProgress >= game.target) {
        setScore((value) => value + 500);
        setMessage(
          "The timeline solved itself. Your past became the key."
        );
        setPhase("success");
      } else {
        setMessage(
          "The timeline collapsed before the door opened."
        );
        setPhase("failed");
      }

      return;
    }

    const timer = setTimeout(() => {
      setPastAction(timeline[turn]);
      setTurn((value) => value + 1);
    }, 850);

    return () => clearTimeout(timer);
  }, [
    phase,
    turn,
    timeline,
    doorProgress,
    game.target,
  ]);

  /* --------------------------------------------------
     PLAYER MANIPULATES THE PRESENT
  -------------------------------------------------- */

  const manipulateWorld = (control) => {
    if (energy <= 0) return;

    setEnergy((value) => value - 1);

    let progress = doorProgress;

    if (control === "boost") {
      progress += 1;
      setWorldPower((value) => value + 1);

      setScore((value) => value + 50);

      setMessage(
        "You amplified the echo."
      );
    }

    if (control === "invert") {
      if (pastAction === "left") {
        progress += 1;
      }

      if (pastAction === "right") {
        progress += 1;
      }

      setWorldPower((value) => Math.max(0, value - 1));

      setScore((value) => value + 75);

      setMessage(
        "The present changed the meaning of the past."
      );
    }

    if (control === "stabilize") {
      if (pastAction === "activate") {
        progress += 1;
      }

      setWorldPower((value) => value + 2);

      setScore((value) => value + 100);

      setMessage(
        "The past action became useful."
      );
    }

    if (control === "erase") {
      progress = Math.max(0, progress - 1);

      setWorldPower(0);

      setScore((value) => Math.max(0, value - 50));

      setMessage(
        "A piece of the timeline disappeared."
      );
    }

    setDoorProgress(Math.min(game.target, progress));
  };

  /* --------------------------------------------------
     RESTART
  -------------------------------------------------- */

  const restart = () => {
    startGame();
  };

  const changeDifficulty = (level) => {
    setDifficulty(level);

    setPhase("briefing");

    setTurn(0);
    setEnergy(0);
    setScore(0);

    setTimeline([]);
    setPastAction(null);

    setWorldPower(0);
    setDoorProgress(0);

    setMessage("");
  };

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */

  return (
    <main className="paradox-game">

      {/* HEADER */}

      <header className="paradox-header">

        <button
          className="paradox-back"
          onClick={onBack}
        >
          ← BACK TO MINDVERSE
        </button>

        <div className="paradox-brand">
          <span>WORLD 02</span>
          <h1>MEMORY PARADOX</h1>
        </div>

        <div className="paradox-score">
          <span>SCORE</span>
          <strong>{score}</strong>
        </div>

      </header>


      {/* MAIN */}

      <section className="paradox-main">

        {/* TITLE */}

        <div className="paradox-heading">

          <div className="paradox-label">
            TEMPORAL MANIPULATION
          </div>

          <h2>
            Your past
            <br />
            <span>is the weapon.</span>
          </h2>

          <p>
            Create your past.
            <br />
            Watch it return.
            <br />
            Change the present before time runs out.
          </p>

        </div>


        {/* DIFFICULTY */}

        <div className="paradox-difficulty">

          <span>DIFFICULTY</span>

          <div>

            {Object.keys(levels).map((level) => (
              <button
                key={level}
                className={
                  difficulty === level
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  changeDifficulty(level)
                }
              >
                {level}
              </button>
            ))}

          </div>

        </div>


        {/* GAME CARD */}

        <div className="paradox-card">

          {/* -----------------------------------------
              BRIEFING
          ----------------------------------------- */}

          {phase === "briefing" && (
            <div className="paradox-state">

              <div className="paradox-icon">
                ◌
              </div>

              <span>
                TEMPORAL SYSTEM READY
              </span>

              <h3>
                Your future depends on your past.
              </h3>

              <p>
                First, create a sequence of actions.
                Then time will rewind.
                Your past self will repeat those actions
                while you manipulate the present.
              </p>

              <button
                className="paradox-start"
                onClick={startGame}
              >
                CREATE THE TIMELINE →
              </button>

            </div>
          )}


          {/* -----------------------------------------
              CREATE TIMELINE
          ----------------------------------------- */}

          {phase === "timeline" && (
            <div className="paradox-state">

              <div className="paradox-status">

                <div>
                  <span>
                    BUILD YOUR PAST
                  </span>

                  <strong>
                    {timeline.length}/{game.turns}
                  </strong>
                </div>

                <div>
                  <span>
                    ENERGY
                  </span>

                  <strong>
                    {energy}
                  </strong>
                </div>

              </div>


              <h3>
                What should your past self do?
              </h3>

              <p>
                Every action becomes permanent
                history.
              </p>


              <div className="timeline">

                {Array.from({
                  length: game.turns,
                }).map((_, index) => {

                  const action =
                    timeline[index];

                  return (
                    <div
                      key={index}
                      className={
                        action
                          ? "timeline-slot filled"
                          : "timeline-slot"
                      }
                    >

                      <span>
                        0{index + 1}
                      </span>

                      <strong>
                        {action
                          ? action.toUpperCase()
                          : "EMPTY"}
                      </strong>

                    </div>
                  );
                })}

              </div>


              <div className="paradox-actions">

                {game.actions.map((action) => (

                  <button
                    key={action.id}
                    onClick={() =>
                      recordAction(action.id)
                    }
                    disabled={energy <= 0}
                  >

                    <span>
                      {action.symbol}
                    </span>

                    <strong>
                      {action.label}
                    </strong>

                  </button>

                ))}

              </div>

            </div>
          )}


          {/* -----------------------------------------
              REWIND
          ----------------------------------------- */}

          {phase === "rewind" && (
            <div className="paradox-state">

              <div className="rewind-symbol">
                ↻
              </div>

              <span>
                TEMPORAL REVERSAL
              </span>

              <h3>
                Rewinding your timeline...
              </h3>

              <p>
                Your recorded actions are about
                to become your past self.
              </p>

              <button
                className="paradox-start"
                onClick={startRewind}
              >
                ENTER THE PAST →
              </button>

            </div>
          )}


          {/* -----------------------------------------
              ECHO PHASE
          ----------------------------------------- */}

          {phase === "echo" && (
            <div className="paradox-state">

              <div className="echo-header">

                <div>
                  <span>
                    PAST SELF
                  </span>

                  <strong>
                    LOOP {turn}/{timeline.length}
                  </strong>
                </div>

                <div>
                  <span>
                    DOOR
                  </span>

                  <strong>
                    {doorProgress}/{game.target}
                  </strong>
                </div>

              </div>


              <div className="echo-zone">

                <div className="past-orb">
                  {pastAction
                    ? pastAction.toUpperCase()
                    : "WAITING"}
                </div>

                <div className="timeline-line">
                  <i />
                  <i />
                  <i />
                </div>

                <div className="future-door">

                  <span>
                    TEMPORAL GATE
                  </span>

                  <strong>
                    {doorProgress >= game.target
                      ? "UNLOCKED"
                      : "LOCKED"}
                  </strong>

                </div>

              </div>


              <p className="echo-message">
                {pastAction
                  ? `Your past self performed ${pastAction.toUpperCase()}.`
                  : "Waiting for the past to arrive..."}
              </p>


              <div className="control-title">
                CONTROL THE PRESENT
              </div>


              <div className="world-controls">

                <button
                  onClick={() =>
                    manipulateWorld("boost")
                  }
                  disabled={!pastAction || energy <= 0}
                >
                  <span>+</span>
                  AMPLIFY
                </button>

                <button
                  onClick={() =>
                    manipulateWorld("invert")
                  }
                  disabled={!pastAction || energy <= 0}
                >
                  <span>↔</span>
                  INVERT
                </button>

                <button
                  onClick={() =>
                    manipulateWorld("stabilize")
                  }
                  disabled={!pastAction || energy <= 0}
                >
                  <span>◇</span>
                  STABILIZE
                </button>

                <button
                  onClick={() =>
                    manipulateWorld("erase")
                  }
                  disabled={!pastAction || energy <= 0}
                >
                  <span>×</span>
                  ERASE
                </button>

              </div>


              <div className="energy-display">
                ENERGY REMAINING: {energy}
              </div>

            </div>
          )}


          {/* -----------------------------------------
              SUCCESS
          ----------------------------------------- */}

          {phase === "success" && (
            <div className="paradox-state result">

              <div className="result-icon">
                ✓
              </div>

              <span>
                PARADOX SOLVED
              </span>

              <h3>
                You changed the past
                without breaking the future.
              </h3>

              <p>
                {message}
              </p>

              <div className="final-score">
                SCORE
                <strong>{score}</strong>
              </div>

              <button
                className="paradox-start"
                onClick={restart}
              >
                REWRITE TIMELINE →
              </button>

            </div>
          )}


          {/* -----------------------------------------
              FAILED
          ----------------------------------------- */}

          {phase === "failed" && (
            <div className="paradox-state result">

              <div className="result-icon">
                ×
              </div>

              <span>
                TIMELINE COLLAPSED
              </span>

              <h3>
                Your past escaped control.
              </h3>

              <p>
                {message}
              </p>

              <button
                className="paradox-start"
                onClick={restart}
              >
                REBUILD TIMELINE →
              </button>

            </div>
          )}

        </div>

      </section>

    </main>
  );
}

export default MemoryParadox;