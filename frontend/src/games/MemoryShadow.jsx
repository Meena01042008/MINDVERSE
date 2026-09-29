import { useEffect, useState } from "react";
import "./MemoryShadow.css";

const levels = {
  Easy: { pairs: 4, time: 60, columns: 4 },
  Medium: { pairs: 6, time: 75, columns: 4 },
  Hard: { pairs: 10, time: 100, columns: 5 },
};

/* Different picture collection */
const picturePool = [
  {
    id: "lion",
    image: "https://picsum.photos/seed/mindverse-lion/400/400",
  },
  {
    id: "forest",
    image: "https://picsum.photos/seed/mindverse-forest/400/400",
  },
  {
    id: "ocean",
    image: "https://picsum.photos/seed/mindverse-ocean/400/400",
  },
  {
    id: "mountain",
    image: "https://picsum.photos/seed/mindverse-mountain/400/400",
  },
  {
    id: "flower",
    image: "https://picsum.photos/seed/mindverse-flower/400/400",
  },
  {
    id: "space",
    image: "https://picsum.photos/seed/mindverse-space/400/400",
  },
  {
    id: "city",
    image: "https://picsum.photos/seed/mindverse-city/400/400",
  },
  {
    id: "desert",
    image: "https://picsum.photos/seed/mindverse-desert/400/400",
  },
  {
    id: "lake",
    image: "https://picsum.photos/seed/mindverse-lake/400/400",
  },
  {
    id: "island",
    image: "https://picsum.photos/seed/mindverse-island/400/400",
  },
];

const shuffle = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

function createDeck(pairCount) {
  const selectedPictures = shuffle(picturePool).slice(0, pairCount);

  const cards = selectedPictures.flatMap((picture, index) => [
    {
      id: `${index}-a`,
      pairId: index,
      image: picture.image,
    },
    {
      id: `${index}-b`,
      pairId: index,
      image: picture.image,
    },
  ]);

  return shuffle(cards);
}

function MemoryShadow({ onBack }) {
  const [difficulty, setDifficulty] = useState("Easy");
  const [phase, setPhase] = useState("briefing");

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  const level = levels[difficulty];

  /* TIMER */
  useEffect(() => {
    if (phase !== "playing") return;

    if (timeLeft <= 0) {
      setPhase("failed");
      setMessage("Time ran out. The memories faded.");
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  /* CHECK TWO CARDS */
  useEffect(() => {
    if (flipped.length !== 2) return;

    const first = cards.find(
      (card) => card.id === flipped[0]
    );

    const second = cards.find(
      (card) => card.id === flipped[1]
    );

    if (!first || !second) return;

    const timer = setTimeout(() => {
      if (first.pairId === second.pairId) {
        setMatched((current) => [
          ...current,
          first.pairId,
        ]);

        setFlipped([]);
      } else {
        setFlipped([]);
      }
    }, 750);

    return () => clearTimeout(timer);
  }, [flipped, cards]);

  /* SUCCESS */
  useEffect(() => {
    if (
      phase === "playing" &&
      matched.length === level.pairs
    ) {
      const timeBonus = timeLeft * 10;

      const moveBonus = Math.max(
        0,
        level.pairs * 80 - moves * 5
      );

      const finalScore =
        level.pairs * 100 +
        timeBonus +
        moveBonus;

      setScore(finalScore);

      setMessage(
        "Every hidden picture was remembered."
      );

      setPhase("success");
    }
  }, [
    matched,
    level.pairs,
    phase,
    timeLeft,
    moves,
  ]);

  /* START NEW GAME */
  const startGame = () => {
    const newDeck = createDeck(level.pairs);

    setCards(newDeck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimeLeft(level.time);
    setScore(0);
    setMessage("");

    setPhase("playing");
  };

  /* CARD CLICK */
  const handleCardClick = (card) => {
    if (phase !== "playing") return;

    if (flipped.length >= 2) return;

    if (flipped.includes(card.id)) return;

    if (matched.includes(card.pairId)) return;

    setFlipped((current) => [
      ...current,
      card.id,
    ]);

    if (flipped.length === 1) {
      setMoves((current) => current + 1);
    }
  };

  /* CHANGE DIFFICULTY */
  const changeDifficulty = (value) => {
    setDifficulty(value);

    setCards([]);
    setFlipped([]);
    setMatched([]);

    setMoves(0);
    setTimeLeft(0);
    setScore(0);
    setMessage("");

    setPhase("briefing");
  };

  const isVisible = (card) => {
    return (
      flipped.includes(card.id) ||
      matched.includes(card.pairId)
    );
  };

  return (
    <main className="shadow-game">

      <header className="shadow-header">

        <button
          className="shadow-back"
          onClick={onBack}
        >
          ← MINDVERSE
        </button>

        <div className="shadow-brand">
          <span>WORLD 02</span>
          <h1>MEMORY MATCH</h1>
        </div>

        <div className="shadow-score">
          <span>SCORE</span>
          <strong>{score}</strong>
        </div>

      </header>

      <section className="shadow-content">

        <div className="shadow-heading">

          <span>MEMORY RECOGNITION</span>

          <h2>
            Remember the hidden pictures.
          </h2>

          <p>
            Reveal two tiles at a time.
            Find the identical pictures
            before the clock disappears.
          </p>

        </div>

        <div className="shadow-difficulty">

          <span>DIFFICULTY</span>

          {Object.keys(levels).map((item) => (
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
          ))}

        </div>

        <section className="shadow-card">

          {/* START SCREEN */}

          {phase === "briefing" && (
            <div className="shadow-state">

              <div className="result-icon">
                ◆
              </div>

              <span>
                WORLD 02 / MEMORY MATCH
              </span>

              <h3>
                Every picture has a twin.
              </h3>

              <p>
                Tap two hidden tiles.
                Remember the picture and
                find its matching twin.
              </p>

              <p>
                {level.pairs} pairs ·{" "}
                {level.time} seconds
              </p>

              <button
                className="shadow-start"
                onClick={startGame}
              >
                START MEMORY MATCH →
              </button>

            </div>
          )}

          {/* GAME */}

          {phase === "playing" && (
            <div className="shadow-state">

              <div className="shadow-status">

                <span>
                  PAIRS FOUND:{" "}
                  {matched.length} /{" "}
                  {level.pairs}
                </span>

                <strong>
                  {timeLeft}s
                </strong>

              </div>

              <div className="shadow-energy">
                MOVES: {moves}
              </div>

              <div
                className="shadow-board"
                style={{
                  gridTemplateColumns:
                    `repeat(${level.columns}, 1fr)`,
                }}
              >

                {cards.map((card) => {

                  const visible =
                    isVisible(card);

                  const isMatched =
                    matched.includes(
                      card.pairId
                    );

                  return (
                    <button
                      key={card.id}
                      className={`
                        shadow-cell
                        ${
                          visible
                            ? "shadow-cell-active"
                            : ""
                        }
                        ${
                          isMatched
                            ? "player-cell"
                            : ""
                        }
                      `}
                      onClick={() =>
                        handleCardClick(card)
                      }
                      disabled={
                        visible ||
                        flipped.length >= 2
                      }
                    >

                      {!visible && (
                        <span className="card-question">
                          ?
                        </span>
                      )}

                      {visible && (
                        <img
                          src={card.image}
                          alt="Memory card"
                          className="memory-picture"
                        />
                      )}

                    </button>
                  );
                })}

              </div>

              <div className="shadow-message">

                {flipped.length === 1
                  ? "Find its matching picture."
                  : "Choose two tiles."}

              </div>

            </div>
          )}

          {/* SUCCESS */}

          {phase === "success" && (
            <div className="shadow-state result">

              <div className="result-icon">
                ✓
              </div>

              <span>
                MEMORY MATCH COMPLETE
              </span>

              <h3>
                Every picture was remembered.
              </h3>

              <p>{message}</p>

              <strong className="final-score">
                +{score} XP
              </strong>

              <button
                className="shadow-start"
                onClick={startGame}
              >
                PLAY ANOTHER MATCH →
              </button>

            </div>
          )}

          {/* FAILED */}

          {phase === "failed" && (
            <div className="shadow-state result">

              <div className="result-icon">
                ×
              </div>

              <span>
                MEMORY LOST
              </span>

              <h3>
                The clock won this time.
              </h3>

              <p>{message}</p>

              <button
                className="shadow-start"
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

export default MemoryShadow;