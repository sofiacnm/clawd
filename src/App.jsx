import { useMemo, useState } from "react";
import ticketImage from "./assets/vip-ticket.png";
import platformImage from "./assets/train-platform.png";
import boardingImage from "./assets/train-boarding.png";
import quartersImage from "./assets/private-quarters.png";
import interiorImage from "./assets/train-interior.png";

const scenes = ["INVITE", "PLATFORM", "ON BOARD", "QUARTERS"];

const colorChoices = [
  { name: "Signal orange", value: "#f05a24" },
  { name: "Electric blue", value: "#2878d0" },
  { name: "Acid green", value: "#8cac37" },
  { name: "Hot pink", value: "#d74d82" },
  { name: "Royal purple", value: "#764caa" },
  { name: "Silver", value: "#a9ada8" },
];

const avatarChoices = [
  { id: "square", label: "Scout", face: "•  •" },
  { id: "bold", label: "Spark", face: "■  ■" },
  { id: "happy", label: "Ace", face: "^  ^" },
  { id: "cool", label: "Nova", face: "▬  ▬" },
];

const accessories = [
  { id: "none", label: "No hat" },
  { id: "cowboy", label: "Cowboy" },
  { id: "conductor", label: "Conductor" },
  { id: "crown", label: "Crown" },
];

function PixelClawd({
  color = "#f05a24",
  accessory = "conductor",
  avatar = "square",
  size = "medium",
}) {
  const selectedAvatar =
    avatarChoices.find((choice) => choice.id === avatar) ?? avatarChoices[0];

  return (
    <div
      className={`pixel-clawd pixel-clawd--${size}`}
      style={{ "--clawd-color": color }}
      aria-label={`${colorChoices.find((choice) => choice.value === color)?.name ?? "Custom"} Clawd wearing ${accessory}`}
      role="img"
    >
      {accessory !== "none" && (
        <div className={`clawd-hat clawd-hat--${accessory}`} />
      )}
      <div className="clawd-body">
        <span className="clawd-face">{selectedAvatar.face}</span>
        <span className="clawd-mouth" />
        <span className="clawd-arm clawd-arm--left" />
        <span className="clawd-arm clawd-arm--right" />
        <span className="clawd-leg clawd-leg--left" />
        <span className="clawd-leg clawd-leg--right" />
      </div>
    </div>
  );
}

function GameHeader({ scene, onRestart }) {
  return (
    <header className="game-header">
      <button
        className="wordmark"
        type="button"
        onClick={onRestart}
        aria-label="Restart The Black Box"
      >
        <span>THE</span> BLACK BOX
      </button>
      <div className="journey" aria-label={`Scene ${scene + 1} of 4`}>
        <span className="journey-count">0{scene + 1}/04</span>
        <div className="journey-track">
          <span style={{ width: `${((scene + 1) / 4) * 100}%` }} />
        </div>
      </div>
      <span className="scene-name">{scenes[scene]}</span>
    </header>
  );
}

function PixelButton({ children, secondary = false, ...props }) {
  return (
    <button
      className={`pixel-button${secondary ? " pixel-button--secondary" : ""}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

function TicketScene({ onAccept }) {
  return (
    <section className="scene ticket-scene" aria-labelledby="ticket-title">
      <div className="ticket-copy">
        <p className="kicker">A ONE-NIGHT EXPERIENCE</p>
        <h1 id="ticket-title">YOUR VIP PASS HAS ARRIVED.</h1>
        <p>
          One train. One unknown destination. A private invitation to step
          inside the questions shaping our future.
        </p>
      </div>

      <button className="vip-ticket" type="button" onClick={onAccept}>
        <img src={ticketImage} alt="" />
        <span className="ticket-stamp">ADMIT ONE</span>
        <span className="ticket-cta">ACCEPT INVITE <b>→</b></span>
      </button>

      <p className="system-note">DEPARTURE: 20:48 · PLATFORM: UNKNOWN</p>
    </section>
  );
}

function PlatformScene({ onBoard }) {
  return (
    <section
      className="scene image-scene platform-scene"
      aria-labelledby="platform-title"
      style={{
        "--scene-image": `url(${platformImage})`,
        "--portrait-image": `url(${boardingImage})`,
      }}
    >
      <div className="scene-scanlines" />
      <div className="platform-guide">
        <PixelClawd size="large" />
      </div>
      <div className="dialogue-panel">
        <div className="speaker-tag">ORANGE CONDUCTOR</div>
        <h1 id="platform-title">YOU MADE IT.</h1>
        <p>
          I am here to take you to <strong>THE BLACK BOX.</strong> Keep your
          ticket close. The questions begin once we board.
        </p>
        <PixelButton onClick={onBoard}>BOARD THE TRAIN →</PixelButton>
      </div>
    </section>
  );
}

function QuestionCard({
  step,
  eyebrow,
  title,
  options,
  selected,
  onSelect,
  onContinue,
  continueLabel,
}) {
  return (
    <div className="question-card">
      <div className="question-number">QUESTION 0{step}</div>
      <p className="kicker">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="answer-grid" role="group" aria-label={title}>
        {options.map((option) => (
          <button
            className={selected === option ? "answer is-selected" : "answer"}
            type="button"
            key={option}
            onClick={() => onSelect(option)}
            aria-pressed={selected === option}
          >
            <span>{selected === option ? "■" : "□"}</span>
            {option}
          </button>
        ))}
      </div>
      <PixelButton onClick={onContinue} disabled={!selected}>
        {continueLabel} →
      </PixelButton>
    </div>
  );
}

function OnboardScene({
  questionStep,
  setQuestionStep,
  knowledge,
  setKnowledge,
  curiosity,
  setCuriosity,
  onContinue,
}) {
  const knowledgeOptions = [
    "I use AI every day",
    "I know the basics",
    "I am curious but new",
    "It still feels mysterious",
  ];
  const curiosityOptions = [
    "How AI really thinks",
    "What it means for creativity",
    "How to build with it",
    "What the future could become",
  ];

  return (
    <section
      className="scene image-scene onboard-scene"
      style={{ "--scene-image": `url(${interiorImage})` }}
      aria-label="Inside the train"
    >
      <div className="scene-scanlines" />
      <aside className="conductor-card">
        <PixelClawd size="medium" />
        <span>THE CONDUCTOR IS LISTENING...</span>
      </aside>
      {questionStep === 1 ? (
        <QuestionCard
          step={1}
          eyebrow="BEFORE WE GO FURTHER"
          title="WHAT DO YOU KNOW ABOUT THE BLACK BOX?"
          options={knowledgeOptions}
          selected={knowledge}
          onSelect={setKnowledge}
          onContinue={() => setQuestionStep(2)}
          continueLabel="NEXT QUESTION"
        />
      ) : (
        <QuestionCard
          step={2}
          eyebrow="ONE MORE FOR THE ROAD"
          title="WHAT WOULD YOU LIKE TO KNOW ABOUT AI?"
          options={curiosityOptions}
          selected={curiosity}
          onSelect={setCuriosity}
          onContinue={onContinue}
          continueLabel="ENTER PRIVATE QUARTERS"
        />
      )}
    </section>
  );
}

function QuartersScene({
  avatar,
  setAvatar,
  color,
  setColor,
  accessory,
  setAccessory,
  knowledge,
  curiosity,
  onFinish,
}) {
  return (
    <section
      className="scene image-scene quarters-scene"
      style={{ "--scene-image": `url(${quartersImage})` }}
      aria-labelledby="quarters-title"
    >
      <div className="scene-scanlines" />
      <div className="customizer">
        <div className="customizer-heading">
          <p className="kicker">PRIVATE QUARTERS · CAR 08</p>
          <h1 id="quarters-title">MAKE YOUR GUIDE YOURS.</h1>
          <p>
            Every journey needs a look. Choose a face, switch the color, and
            add something with character.
          </p>
        </div>

        <div className="avatar-stage">
          <div className="stage-label">LIVE PREVIEW</div>
          <PixelClawd
            color={color}
            accessory={accessory}
            avatar={avatar}
            size="hero"
          />
          <div className="avatar-shadow" />
        </div>

        <div className="customizer-controls">
          <fieldset>
            <legend>01 · CHOOSE AVATAR</legend>
            <div className="avatar-options">
              {avatarChoices.map((choice) => (
                <button
                  type="button"
                  className={avatar === choice.id ? "mini-face is-selected" : "mini-face"}
                  onClick={() => setAvatar(choice.id)}
                  key={choice.id}
                  aria-pressed={avatar === choice.id}
                >
                  <span>{choice.face}</span>
                  {choice.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>02 · PICK A COLOR</legend>
            <div className="swatches">
              {colorChoices.map((choice) => (
                <button
                  type="button"
                  className={color === choice.value ? "swatch is-selected" : "swatch"}
                  onClick={() => setColor(choice.value)}
                  key={choice.value}
                  style={{ "--swatch": choice.value }}
                  aria-label={choice.name}
                  aria-pressed={color === choice.value}
                />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>03 · ADD APPAREL</legend>
            <div className="accessory-options">
              {accessories.map((item) => (
                <button
                  type="button"
                  className={accessory === item.id ? "choice-chip is-selected" : "choice-chip"}
                  onClick={() => setAccessory(item.id)}
                  key={item.id}
                  aria-pressed={accessory === item.id}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>

          <PixelButton onClick={onFinish}>LOCK IN MY LOOK →</PixelButton>
        </div>
      </div>

      <div className="journey-receipt">
        <span>YOUR ROUTE</span>
        <p>{knowledge || "THE UNKNOWN"}</p>
        <i>↓</i>
        <p>{curiosity || "THE BLACK BOX"}</p>
      </div>
    </section>
  );
}

function CompletionModal({ color, accessory, avatar, onReplay }) {
  return (
    <div className="completion-backdrop" role="dialog" aria-modal="true">
      <div className="completion-modal">
        <p className="kicker">IDENTITY CONFIRMED</p>
        <PixelClawd
          color={color}
          accessory={accessory}
          avatar={avatar}
          size="large"
        />
        <h2>THE BLACK BOX IS READY FOR YOU.</h2>
        <p>
          Your guide has the look. Your questions are on board. The next stop
          is where the real conversation begins.
        </p>
        <PixelButton onClick={onReplay}>PLAY AGAIN</PixelButton>
      </div>
    </div>
  );
}

function App() {
  const [scene, setScene] = useState(0);
  const [questionStep, setQuestionStep] = useState(1);
  const [knowledge, setKnowledge] = useState("");
  const [curiosity, setCuriosity] = useState("");
  const [avatar, setAvatar] = useState("square");
  const [color, setColor] = useState("#f05a24");
  const [accessory, setAccessory] = useState("conductor");
  const [complete, setComplete] = useState(false);

  const sceneContent = useMemo(() => {
    if (scene === 0) {
      return <TicketScene onAccept={() => setScene(1)} />;
    }

    if (scene === 1) {
      return <PlatformScene onBoard={() => setScene(2)} />;
    }

    if (scene === 2) {
      return (
        <OnboardScene
          questionStep={questionStep}
          setQuestionStep={setQuestionStep}
          knowledge={knowledge}
          setKnowledge={setKnowledge}
          curiosity={curiosity}
          setCuriosity={setCuriosity}
          onContinue={() => setScene(3)}
        />
      );
    }

    return (
      <QuartersScene
        avatar={avatar}
        setAvatar={setAvatar}
        color={color}
        setColor={setColor}
        accessory={accessory}
        setAccessory={setAccessory}
        knowledge={knowledge}
        curiosity={curiosity}
        onFinish={() => setComplete(true)}
      />
    );
  }, [
    scene,
    questionStep,
    knowledge,
    curiosity,
    avatar,
    color,
    accessory,
  ]);

  const restart = () => {
    setScene(0);
    setQuestionStep(1);
    setKnowledge("");
    setCuriosity("");
    setAvatar("square");
    setColor("#f05a24");
    setAccessory("conductor");
    setComplete(false);
  };

  return (
    <main className="game-shell">
      <GameHeader scene={scene} onRestart={restart} />
      <div className="game-viewport" aria-live="polite">
        {sceneContent}
      </div>
      <footer className="game-footer">
        <span>CLAWD RAIL · NIGHT SERVICE</span>
        <span>USE TOUCH OR MOUSE TO PLAY</span>
      </footer>
      {complete && (
        <CompletionModal
          color={color}
          accessory={accessory}
          avatar={avatar}
          onReplay={restart}
        />
      )}
    </main>
  );
}

export default App;
