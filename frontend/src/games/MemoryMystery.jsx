import { useEffect, useState } from "react";
import "./MemoryMystery.css";

const shuffle = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const questionPools = {
  Easy: [
    {
      id: "easy-1",
      time: 18,
      question: "Which object was actually beside the lamp?",
      clues: [
        { id: 1, title: "THE KEY", text: "A silver key was lying beside the lamp." },
        { id: 2, title: "THE CLOCK", text: "The wall clock showed 9:15." },
        { id: 3, title: "THE BOOK", text: "A red book was open on the table." },
        { id: 4, title: "THE WINDOW", text: "The window was completely open." },
      ],
      answers: [
        { text: "A silver key was beside the lamp.", correct: true },
        { text: "A gold coin was beside the lamp.", correct: false },
        { text: "A red book was beside the lamp.", correct: false },
        { text: "The window was beside the lamp.", correct: false },
      ],
    },

    {
      id: "easy-2",
      time: 18,
      question: "Which detail should you trust?",
      clues: [
        { id: 1, title: "THE WATCH", text: "A blue watch was on the desk." },
        { id: 2, title: "THE DOOR", text: "The wooden door was locked." },
        { id: 3, title: "THE NOTE", text: "A note was under the blue watch." },
        { id: 4, title: "THE CUP", text: "The cup was completely empty." },
      ],
      answers: [
        { text: "The wooden door was locked.", correct: true },
        { text: "The wooden door was broken.", correct: false },
        { text: "The wooden door was open.", correct: false },
        { text: "The wooden door was missing.", correct: false },
      ],
    },

    {
      id: "easy-3",
      time: 18,
      question: "What was found under the chair?",
      clues: [
        { id: 1, title: "THE CHAIR", text: "A small coin was under the chair." },
        { id: 2, title: "THE TABLE", text: "The table had three books." },
        { id: 3, title: "THE LAMP", text: "The lamp was switched on." },
        { id: 4, title: "THE DOOR", text: "The door was slightly open." },
      ],
      answers: [
        { text: "A small coin.", correct: true },
        { text: "A silver key.", correct: false },
        { text: "A blue watch.", correct: false },
        { text: "A folded note.", correct: false },
      ],
    },

    {
      id: "easy-4",
      time: 18,
      question: "Which detail was part of the original scene?",
      clues: [
        { id: 1, title: "THE PHOTO", text: "A photograph was facing the window." },
        { id: 2, title: "THE BOX", text: "A black box was on the floor." },
        { id: 3, title: "THE CLOCK", text: "The clock showed 7:40." },
        { id: 4, title: "THE FLOWER", text: "A white flower was beside the book." },
      ],
      answers: [
        { text: "A photograph was facing the window.", correct: true },
        { text: "A photograph was under the table.", correct: false },
        { text: "A photograph was inside the box.", correct: false },
        { text: "A photograph was beside the door.", correct: false },
      ],
    },
  ],

  Medium: [
    {
      id: "medium-1",
      time: 15,
      question: "Which detail should be trusted?",
      clues: [
        { id: 1, title: "THE KEY", text: "A silver key was beside the lamp." },
        { id: 2, title: "THE CLOCK", text: "The clock showed 9:15." },
        { id: 3, title: "THE BOOK", text: "The red book was closed." },
        { id: 4, title: "THE CHAIR", text: "A chair was facing the window." },
        { id: 5, title: "THE COIN", text: "A gold coin was under the chair." },
        { id: 6, title: "THE WINDOW", text: "The window was slightly open." },
      ],
      answers: [
        { text: "The silver key was beside the lamp.", correct: true },
        { text: "The red book was closed.", correct: false },
        { text: "A gold coin was under the chair.", correct: false },
        { text: "The window was completely closed.", correct: false },
      ],
    },

    {
      id: "medium-2",
      time: 15,
      question: "Which object was actually hidden near the desk?",
      clues: [
        { id: 1, title: "THE NOTE", text: "A folded note was behind the desk." },
        { id: 2, title: "THE PEN", text: "A black pen was beside the notebook." },
        { id: 3, title: "THE CLOCK", text: "The clock showed 8:20." },
        { id: 4, title: "THE DRAWER", text: "The top drawer was locked." },
        { id: 5, title: "THE COIN", text: "A gold coin was inside the drawer." },
        { id: 6, title: "THE CHAIR", text: "The chair faced the desk." },
      ],
      answers: [
        { text: "A folded note was behind the desk.", correct: true },
        { text: "A gold coin was behind the desk.", correct: false },
        { text: "A black pen was behind the desk.", correct: false },
        { text: "A silver key was behind the desk.", correct: false },
      ],
    },

    {
      id: "medium-3",
      time: 15,
      question: "Which statement matches the original scene?",
      clues: [
        { id: 1, title: "THE MIRROR", text: "The mirror reflected the empty hallway." },
        { id: 2, title: "THE BAG", text: "A brown bag was beside the chair." },
        { id: 3, title: "THE BOOK", text: "A green book was open." },
        { id: 4, title: "THE LAMP", text: "The desk lamp was switched off." },
        { id: 5, title: "THE KEY", text: "A small key was inside the drawer." },
        { id: 6, title: "THE WINDOW", text: "The window was fully open." },
      ],
      answers: [
        { text: "The mirror reflected the empty hallway.", correct: true },
        { text: "The mirror reflected the garden.", correct: false },
        { text: "The mirror was broken.", correct: false },
        { text: "The mirror was hidden inside the drawer.", correct: false },
      ],
    },

    {
      id: "medium-4",
      time: 15,
      question: "Which clue points toward the real location?",
      clues: [
        { id: 1, title: "THE BOX", text: "A wooden box was under the table." },
        { id: 2, title: "THE MAP", text: "A small map was folded beside the box." },
        { id: 3, title: "THE CUP", text: "A glass cup was near the window." },
        { id: 4, title: "THE BOOK", text: "A yellow book was closed." },
        { id: 5, title: "THE CLOCK", text: "The clock stopped at 6:45." },
        { id: 6, title: "THE KEY", text: "A brass key was inside the box." },
      ],
      answers: [
        { text: "A small map was folded beside the box.", correct: true },
        { text: "The yellow book was inside the window.", correct: false },
        { text: "The clock was under the table.", correct: false },
        { text: "The glass cup was inside the box.", correct: false },
      ],
    },
  ],

  Hard: [
    {
      id: "hard-1",
      time: 12,
      question: "Which clue reveals the actual location of the hidden object?",
      clues: [
        { id: 1, title: "THE KEY", text: "The silver key was beside the lamp." },
        { id: 2, title: "THE CLOCK", text: "The clock showed 9:15." },
        { id: 3, title: "THE BOOK", text: "The red book was open." },
        { id: 4, title: "THE CHAIR", text: "The chair faced the door." },
        { id: 5, title: "THE COIN", text: "A gold coin was under the table." },
        { id: 6, title: "THE WINDOW", text: "The window was slightly open." },
        { id: 7, title: "THE PHOTO", text: "The photograph was turned toward the wall." },
        { id: 8, title: "THE NOTE", text: "A small note was hidden behind the lamp." },
      ],
      answers: [
        { text: "The note was hidden behind the lamp.", correct: true },
        { text: "The photograph was turned toward the wall.", correct: false },
        { text: "The chair faced the door.", correct: false },
        { text: "The clock showed 9:15.", correct: false },
      ],
    },

    {
      id: "hard-2",
      time: 12,
      question: "Which clue gives the strongest evidence?",
      clues: [
        { id: 1, title: "THE MAP", text: "The map showed a red circle near the cabinet." },
        { id: 2, title: "THE MIRROR", text: "The mirror faced the hallway." },
        { id: 3, title: "THE BOOK", text: "The black book was open." },
        { id: 4, title: "THE DRAWER", text: "The bottom drawer was locked." },
        { id: 5, title: "THE COIN", text: "A silver coin was beside the chair." },
        { id: 6, title: "THE LAMP", text: "The lamp was switched off." },
        { id: 7, title: "THE PHOTO", text: "The photograph showed an empty room." },
        { id: 8, title: "THE CABINET", text: "A small box was inside the cabinet." },
      ],
      answers: [
        { text: "The map showed a red circle near the cabinet.", correct: true },
        { text: "The photograph showed an empty room.", correct: false },
        { text: "The mirror faced the hallway.", correct: false },
        { text: "The silver coin was beside the chair.", correct: false },
      ],
    },

    {
      id: "hard-3",
      time: 12,
      question: "Which memory points to the hidden message?",
      clues: [
        { id: 1, title: "THE CLOCK", text: "The clock stopped at 4:25." },
        { id: 2, title: "THE LETTER", text: "A blue letter was under the book." },
        { id: 3, title: "THE WINDOW", text: "The window reflected the empty street." },
        { id: 4, title: "THE CHAIR", text: "The chair was turned toward the wall." },
        { id: 5, title: "THE LAMP", text: "The lamp illuminated the letter." },
        { id: 6, title: "THE BOOK", text: "The black book contained blank pages." },
        { id: 7, title: "THE DRAWER", text: "The middle drawer was open." },
        { id: 8, title: "THE FRAME", text: "The picture frame was slightly tilted." },
      ],
      answers: [
        { text: "The blue letter was under the book.", correct: true },
        { text: "The clock stopped at 4:25.", correct: false },
        { text: "The picture frame was tilted.", correct: false },
        { text: "The middle drawer was open.", correct: false },
      ],
    },

    {
      id: "hard-4",
      time: 12,
      question: "Which detail exposes the false memory?",
      clues: [
        { id: 1, title: "THE DOOR", text: "The door was locked from the inside." },
        { id: 2, title: "THE KEY", text: "A brass key was on the floor." },
        { id: 3, title: "THE TABLE", text: "A glass vase stood at the centre." },
        { id: 4, title: "THE NOTE", text: "The note mentioned the eastern wall." },
        { id: 5, title: "THE MIRROR", text: "The mirror showed a person near the door." },
        { id: 6, title: "THE CLOCK", text: "The clock showed 11:05." },
        { id: 7, title: "THE BAG", text: "A black bag was inside the cabinet." },
        { id: 8, title: "THE PHOTO", text: "The photograph showed the eastern wall." },
      ],
      answers: [
        { text: "The mirror showed a person near the door.", correct: true },
        { text: "The brass key was on the floor.", correct: false },
        { text: "The clock showed 11:05.", correct: false },
        { text: "The photograph showed the eastern wall.", correct: false },
      ],
    },
  ],
};

function getNewScene(difficulty) {
  const pool = questionPools[difficulty];

  let previousId = null;

  try {
    previousId = sessionStorage.getItem(
      `mindverse-mystery-${difficulty}`
    );
  } catch {
    previousId = null;
  }

  let available = pool.filter(
    (scene) => scene.id !== previousId
  );

  if (available.length === 0) {
    available = pool;
  }

  const selected =
    available[Math.floor(Math.random() * available.length)];

  try {
    sessionStorage.setItem(
      `mindverse-mystery-${difficulty}`,
      selected.id
    );
  } catch {
    // Ignore storage errors.
  }

  return {
    ...selected,
    clues: shuffle(selected.clues),
    answers: shuffle(selected.answers),
  };
}

function MemoryMystery({ onBack }) {
  const [difficulty, setDifficulty] = useState("Easy");
  const [phase, setPhase] = useState("briefing");
  const [scene, setScene] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedClues, setSelectedClues] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (phase !== "investigate" || !scene) return;

    setTimeLeft(scene.time);

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          setPhase("deduction");
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, scene]);

  const startInvestigation = () => {
    const newScene = getNewScene(difficulty);

    setScene(newScene);
    setSelectedClues([]);
    setMessage("");
    setTimeLeft(newScene.time);
    setPhase("investigate");
  };

  const selectClue = (clue) => {
    setSelectedClues((previous) => {
      if (previous.includes(clue.id)) {
        return previous.filter((id) => id !== clue.id);
      }

      return [...previous, clue.id];
    });
  };

  const submitDeduction = (answer) => {
    if (!scene) return;

    if (answer.correct) {
      const bonus = timeLeft * 10;
      const gained = 500 + bonus;

      setScore((previous) => previous + gained);

      setMessage(
        `Correct deduction. +${gained} points`
      );

      setPhase("success");
    } else {
      setScore((previous) =>
        Math.max(0, previous - 100)
      );

      setMessage(
        "That clue was misleading. The world lied to you."
      );

      setPhase("failed");
    }
  };

  const restart = () => {
    startInvestigation();
  };

  const changeDifficulty = (level) => {
    setDifficulty(level);
    setScene(null);
    setSelectedClues([]);
    setMessage("");
    setTimeLeft(0);
    setPhase("briefing");
  };

  return (
    <main className="mystery-game">
      <header className="mystery-header">
        <button
          className="mystery-back"
          onClick={onBack}
        >
          ← BACK TO MINDVERSE
        </button>

        <div className="mystery-brand">
          <span>WORLD 01</span>
          <h1>MEMORY MYSTERY</h1>
        </div>

        <div className="mystery-score">
          <span>SCORE</span>
          <strong>{score}</strong>
        </div>
      </header>

      <section className="mystery-main">
        <div className="mystery-heading">
          <span className="mystery-label">
            INVESTIGATION PROTOCOL
          </span>

          <h2>
            The world
            <br />
            <span>lies.</span>
          </h2>

          <p>
            Investigate the scene.
            <br />
            Remember what you discover.
            <br />
            Find the truth hidden inside the lies.
          </p>
        </div>

        <div className="difficulty-bar">
          <span>DIFFICULTY</span>

          <div>
            {Object.keys(questionPools).map((level) => (
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

        <div className="mystery-card">
          {phase === "briefing" && (
            <div className="game-state">
              <div className="state-icon">
                ◈
              </div>

              <span>
                INVESTIGATION READY
              </span>

              <h3>
                Every case is different.
              </h3>

              <p>
                Each investigation generates a different
                memory scene, question and answer set.
                Some information will deliberately mislead you.
              </p>

              <button
                className="game-start"
                onClick={startInvestigation}
              >
                ENTER THE SCENE
                <span>→</span>
              </button>
            </div>
          )}

          {phase === "investigate" && scene && (
            <div className="game-state">
              <div className="state-top">
                <span>
                  INVESTIGATE THE SCENE
                </span>

                <strong>
                  {timeLeft}s
                </strong>
              </div>

              <p className="scene-warning">
                Select the clues you believe are important.
              </p>

              <div className="clue-grid">
                {scene.clues.map((clue) => {
                  const selected =
                    selectedClues.includes(clue.id);

                  return (
                    <button
                      key={clue.id}
                      className={`clue-card ${
                        selected
                          ? "clue-selected"
                          : ""
                      }`}
                      onClick={() =>
                        selectClue(clue)
                      }
                    >
                      <div className="clue-number">
                        {String(clue.id).padStart(2, "0")}
                      </div>

                      <strong>
                        {clue.title}
                      </strong>

                      <p>
                        {clue.text}
                      </p>

                      <span>
                        {selected
                          ? "SELECTED"
                          : "INSPECT"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                className="game-start"
                onClick={() =>
                  setPhase("deduction")
                }
              >
                MAKE YOUR DEDUCTION →
              </button>
            </div>
          )}

          {phase === "deduction" && scene && (
            <div className="game-state">
              <span>
                FINAL DEDUCTION
              </span>

              <h3>
                {scene.question}
              </h3>

              <p className="selected-count">
                CLUES REMEMBERED:{" "}
                {selectedClues.length}
              </p>

              <div className="answer-grid">
                {scene.answers.map(
                  (answer, index) => (
                    <button
                      key={answer.text}
                      className="answer-card"
                      onClick={() =>
                        submitDeduction(answer)
                      }
                    >
                      <span>
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      {answer.text}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {phase === "success" && (
            <div className="game-state result">
              <div className="result-icon">
                ✓
              </div>

              <span>
                MEMORY RECONSTRUCTED
              </span>

              <h3>
                You found the truth.
              </h3>

              <p>
                {message}
              </p>

              <button
                className="game-start"
                onClick={restart}
              >
                INVESTIGATE ANOTHER CASE →
              </button>
            </div>
          )}

          {phase === "failed" && (
            <div className="game-state result">
              <div className="result-icon">
                ×
              </div>

              <span>
                FALSE MEMORY DETECTED
              </span>

              <h3>
                The world fooled you.
              </h3>

              <p>
                {message}
              </p>

              <button
                className="game-start"
                onClick={restart}
              >
                TRY ANOTHER CASE →
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default MemoryMystery;