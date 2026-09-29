import { useEffect, useState } from "react";
import "./MemoryFusion.css";

const levels = {
  Easy: {
    items: 4,
    rounds: 5,
    preview: 3500,
    time: 60,
  },
  Medium: {
    items: 5,
    rounds: 6,
    preview: 3000,
    time: 55,
  },
  Hard: {
    items: 6,
    rounds: 7,
    preview: 2500,
    time: 50,
  },
};

const marketItems = [
  { name: "Apple", icon: "🍎" },
  { name: "Bread", icon: "🍞" },
  { name: "Milk", icon: "🥛" },
  { name: "Cake", icon: "🍰" },
  { name: "Coffee", icon: "☕" },
  { name: "Flower", icon: "🌸" },
  { name: "Book", icon: "📘" },
  { name: "Camera", icon: "📷" },
  { name: "Watch", icon: "⌚" },
  { name: "Bag", icon: "🎒" },
];

const prices = [20, 30, 40, 50, 60, 70];

const shuffle = (array) =>
  [...array].sort(() => Math.random() - 0.5);

function createMarket(level) {
  const selected = shuffle(marketItems).slice(
    0,
    level.items
  );

  const shuffledPrices = shuffle(prices).slice(
    0,
    level.items
  );

  return selected.map((item, index) => ({
    ...item,
    price: shuffledPrices[index],
  }));
}

function MemoryFusion({ onBack }) {
  const [difficulty, setDifficulty] =
    useState("Easy");

  const [phase, setPhase] =
    useState("briefing");

  const [market, setMarket] =
    useState([]);

  const [question, setQuestion] =
    useState(null);

  const [round, setRound] =
    useState(1);

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
        "Time ran out before the market memory was solved."
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
      const target =
        market[
          Math.floor(
            Math.random() * market.length
          )
        ];

      setQuestion({
        type: "price",
        value: target.price,
      });

      setPhase("playing");
    }, level.preview);

    return () => clearTimeout(timer);
  }, [phase, market, level.preview]);

  /* START */

  const startGame = () => {
    const newMarket =
      createMarket(level);

    setMarket(newMarket);
    setRound(1);
    setScore(0);
    setMistakes(0);
    setMessage("");
    setTimeLeft(level.time);
    setQuestion(null);
    setPhase("preview");
  };

  /* ANSWER */

  const chooseItem = (item) => {
    if (phase !== "playing") return;

    if (
      item.price === question.value
    ) {
      const roundScore =
        120 + timeLeft * 5;

      setScore(
        (current) =>
          current + roundScore
      );

      setMessage("Correct memory!");

      if (round >= level.rounds) {
        setPhase("success");
        return;
      }

      setTimeout(() => {
        const nextMarket =
          createMarket(level);

        setMarket(nextMarket);
        setRound(
          (current) => current + 1
        );
        setMessage("");
        setQuestion(null);
        setPhase("preview");
      }, 600);
    } else {
      setMistakes(
        (current) => current + 1
      );

      setScore(
        (current) =>
          Math.max(0, current - 20)
      );

      setMessage(
        "Not that item. Remember the price."
      );
    }
  };

  /* DIFFICULTY */

  const changeDifficulty = (value) => {
    setDifficulty(value);
    setPhase("briefing");
    setMarket([]);
    setQuestion(null);
    setRound(1);
    setTimeLeft(0);
    setScore(0);
    setMistakes(0);
    setMessage("");
  };

  return (
    <main className="fusion-game">

      <header className="fusion-header">

        <button
          className="fusion-back"
          onClick={onBack}
        >
          ← MINDVERSE
        </button>

        <div className="fusion-brand">
          <span>WORLD 07</span>

          <h1>
            MEMORY MARKET
          </h1>
        </div>

        <div className="fusion-score">
          <span>SCORE</span>

          <strong>
            {score}
          </strong>
        </div>

      </header>

      <section className="fusion-content">

        <div className="fusion-heading">

          <span>
            ASSOCIATIVE MEMORY
          </span>

          <h2>
            Remember what belongs to what.
          </h2>

          <p>
            Study the market items and their
            prices. When they disappear,
            remember the correct connection.
          </p>

        </div>

        <div className="fusion-difficulty">

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

        <section className="fusion-card">

          {/* BRIEFING */}

          {phase === "briefing" && (
            <div className="fusion-state">

              <div className="fusion-icon">
                🛒
              </div>

              <span>
                WORLD 07 / MEMORY MARKET
              </span>

              <h3>
                Can you remember the market?
              </h3>

              <p>
                Study each item and its price.
                After the market disappears,
                answer the memory question.
              </p>

              <div className="fusion-info">

                <span>
                  {level.rounds} ROUNDS
                </span>

                <span>
                  {level.items} ITEMS
                </span>

                <span>
                  {level.time}s
                </span>

              </div>

              <button
                className="fusion-start"
                onClick={startGame}
              >
                ENTER THE MARKET →
              </button>

            </div>
          )}

          {/* PREVIEW */}

          {phase === "preview" && (
            <div className="fusion-state">

              <div className="fusion-live">

                <span>
                  REMEMBER THE MARKET
                </span>

                <strong>
                  ROUND {round} /{" "}
                  {level.rounds}
                </strong>

              </div>

              <div className="market-board">

                {market.map(
                  (item) => (
                    <div
                      key={item.name}
                      className="market-item"
                    >
                      <span className="market-icon">
                        {item.icon}
                      </span>

                      <strong>
                        {item.name}
                      </strong>

                      <small>
                        ₹{item.price}
                      </small>
                    </div>
                  )
                )}

              </div>

              <p className="fusion-preview-text">
                Remember the items and prices...
              </p>

            </div>
          )}

          {/* PLAYING */}

          {phase === "playing" && (
            <div className="fusion-state">

              <div className="fusion-live">

                <span>
                  MEMORY QUESTION
                </span>

                <strong>
                  {timeLeft}s
                </strong>

              </div>

              <div className="market-question">

                <span>
                  WHICH ITEM COST
                </span>

                <strong>
                  ₹{question?.value}
                </strong>

              </div>

              <p className="fusion-prompt">
                Select the item you remember.
              </p>

              <div className="market-options">

                {shuffle(market).map(
                  (item) => (
                    <button
                      key={item.name}
                      className="market-option"
                      onClick={() =>
                        chooseItem(item)
                      }
                    >

                      <span>
                        {item.icon}
                      </span>

                      <strong>
                        {item.name}
                      </strong>

                    </button>
                  )
                )}

              </div>

              <div className="fusion-stats">

                <span>
                  ROUND: {round} /{" "}
                  {level.rounds}
                </span>

                <span>
                  MISTAKES: {mistakes}
                </span>

              </div>

              {message && (
                <div className="fusion-message">
                  {message}
                </div>
              )}

            </div>
          )}

          {/* SUCCESS */}

          {phase === "success" && (
            <div className="fusion-state result">

              <div className="fusion-icon success">
                ✓
              </div>

              <span>
                MARKET MASTER
              </span>

              <h3>
                You remembered every connection.
              </h3>

              <p>
                Your memory kept the market intact.
              </p>

              <strong className="fusion-final-score">
                +{score} XP
              </strong>

              <button
                className="fusion-start"
                onClick={startGame}
              >
                SHOP AGAIN →
              </button>

            </div>
          )}

          {/* FAILED */}

          {phase === "failed" && (
            <div className="fusion-state result">

              <div className="fusion-icon failed">
                ×
              </div>

              <span>
                MARKET CLOSED
              </span>

              <h3>
                The market memory faded.
              </h3>

              <p>
                {message}
              </p>

              <button
                className="fusion-start"
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

export default MemoryFusion;