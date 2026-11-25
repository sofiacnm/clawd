import { useEffect, useRef, useState } from "react";
import quartersBg from "./assets/scene-quarters.webp";
import quartersOpenBg from "./assets/scene-quarters-open.webp";
import cityBg from "./assets/scene-city.webp";
import classroomBg from "./assets/scene-classroom.webp";
import ticketImage from "./assets/vip-ticket.png";
import clawdBlankImage from "./assets/clawd-blank.png";
import pedestalImage from "./assets/pedestal.png";
import accConductor from "./assets/accessories/conductor.png";
import accCowboy from "./assets/accessories/cowboy.png";
import accDetective from "./assets/accessories/detective.png";
import accWatch from "./assets/accessories/watch.png";
import accPipe from "./assets/accessories/pipe.png";
import accRocket from "./assets/accessories/rocket.png";
import accRope from "./assets/accessories/rope.png";
import accGlasses from "./assets/accessories/glasses.png";
import accShades from "./assets/accessories/shades.png";
import { useTypewriter, DialogueBox, InputBox, ChoiceBox, RainOverlay } from "./ui";
import { logResponse } from "./sheets";

const ACCESSORY_IMAGES = {
  conductor: accConductor,
  cowboy: accCowboy,
  fedora: accDetective,
  watch: accWatch,
  pipe: accPipe,
  rocket: accRocket,
  lasso: accRope,
  glasses: accGlasses,
  shades: accShades,
};

const CORRECT_CODE = "1234";

const HOTSPOTS = [
  { id: "watch", x: 6, y: 50, w: 7, h: 10 },
  { id: "glasses", x: 15, y: 53, w: 7, h: 8 },
  { id: "conductor", x: 31, y: 24, w: 9, h: 14 },
  { id: "fedora", x: 40, y: 30, w: 9, h: 14 },
  { id: "rocket", x: 69, y: 30, w: 8, h: 14 },
  { id: "pipe", x: 48, y: 52, w: 10, h: 9 },
  { id: "lasso", x: 61, y: 64, w: 9, h: 9 },
];

const ACCESSORIES = [
  { id: "conductor", label: "Conductor Cap" },
  { id: "cowboy", label: "Cowboy Hat" },
  { id: "fedora", label: "Fedora" },
  { id: "watch", label: "Watch" },
  { id: "pipe", label: "Pipe" },
  { id: "rocket", label: "Rocket" },
  { id: "lasso", label: "Lasso" },
  { id: "glasses", label: "Glasses" },
  { id: "shades", label: "Pixel Shades" },
];

const CLASSROOM_BEATS = [
  { type: "dialogue", text: "Let's play with tokens!" },
  { type: "dialogue", text: "If I had to split it, I'd say “su” “nshine” — tokens are just chunks of text, not whole words." },
  { type: "dialogue", text: "Good job!" },
  {
    type: "dialogue",
    text: "Here's how AI would've solved it: it breaks the word into familiar chunks it already knows, then predicts what comes next, piece by piece.",
  },
  { type: "input", placeholder: "What did you learn from that?" },
  {
    type: "quiz",
    prompt: "What did you learn from that?",
    options: ["What tokens are", "How LLMs think", "All the above", "Other"],
  },
];

function AccessoryIcon({ id }) {
  const src = ACCESSORY_IMAGES[id];
  if (!src) return null;
  return <img className="acc-img" src={src} alt="" draggable={false} />;
}

function BlankClawd({ accessory, size = 180 }) {
  return (
    <div className="blank-clawd" style={{ width: size }}>
      <img className="bc-body-img" src={clawdBlankImage} alt="" draggable={false} />
      {accessory && (
        <div className={`char-accessory acc-${accessory}`}>
          <AccessoryIcon id={accessory} />
        </div>
      )}
    </div>
  );
}

function QuartersScene({ onPick }) {
  const [introVisible, setIntroVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIntroVisible(false), 3800);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="screen quarters-scene">
      <div className="quarters-stage">
        <img className="quarters-bg" src={quartersBg} alt="" draggable={false} />
        {HOTSPOTS.map((h) => (
          <button
            key={h.id}
            className="hotspot"
            style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
            onClick={() => onPick(h.id)}
            aria-label={h.id}
          >
            <span className="hotspot-glow" />
          </button>
        ))}
      </div>
      <div className={`box dialogue-box intro-note${introVisible ? "" : " faded"}`}>
        <p>Here you can make your own Clawd avatar. Tap something in color to try it on.</p>
      </div>
    </section>
  );
}

function CharacterChoiceScene({ accessory, onPickAccessory, onContinue }) {
  return (
    <section className="screen choice-scene">
      <div className="choice-stage">
        <BlankClawd accessory={accessory} size={200} />
      </div>
      <div className="accessory-grid">
        {ACCESSORIES.map((a) => (
          <button
            key={a.id}
            className={`accessory-tile${accessory === a.id ? " selected" : ""}`}
            onClick={() => onPickAccessory(accessory === a.id ? null : a.id)}
            aria-label={a.label}
          >
            <AccessoryIcon id={a.id} />
          </button>
        ))}
      </div>
      <button className="pixel-btn continue-btn" onClick={onContinue}>
        [CONTINUE]
      </button>
    </section>
  );
}

function CharacterConfirmScene({ accessory, onYes, onNo }) {
  return (
    <section className="screen confirm-scene">
      <div className="choice-stage">
        <BlankClawd accessory={accessory} size={200} />
      </div>
      <div className="box yesno-box">
        <p>I'm ready, are you?</p>
        <div className="yesno-buttons">
          <button className="btn-no" onClick={onNo}>NO</button>
          <button className="btn-yes" onClick={onYes}>YES</button>
        </div>
      </div>
    </section>
  );
}

function ShowTicketScene({ onCorrect }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  const submit = () => {
    if (value.trim() === CORRECT_CODE) {
      onCorrect();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1800);
    }
  };

  return (
    <section className="screen ticket-scene">
      <img className="ticket-art ticket-art-static" src={ticketImage} alt="VIP ticket" />
      <p className="ticket-prompt">Show your ticket at the door and enter the code you were given.</p>
      <div className={`box input-box code-box${error ? " shake" : ""}`}>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={value}
          placeholder="Enter code..."
          maxLength={8}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
        <button className="pixel-btn" onClick={submit}>[SUBMIT]</button>
      </div>
      {error && <p className="code-error">That's not it &mdash; try again.</p>}
    </section>
  );
}

function PortalScene({ onDone }) {
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setFlash(true), 1600);
    const t2 = setTimeout(onDone, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="screen portal-scene">
      <img className="portal-door-img" src={quartersOpenBg} alt="" draggable={false} />
      <div className={`portal-flash${flash ? " show" : ""}`} />
    </section>
  );
}

function CityScene({ accessory, onDone }) {
  const lines = ["Welcome to the black box.", "I'd recommend starting in Token World."];
  const [beat, setBeat] = useState(0);
  return (
    <section className="screen city-scene">
      <img className="city-bg" src={cityBg} alt="" draggable={false} />
      <div className="city-char-stage">
        <BlankClawd accessory={accessory} size={150} />
        <img className="pedestal-img" src={pedestalImage} alt="" draggable={false} />
      </div>
      <div className="ui-layer">
        <DialogueBox
          key={beat}
          text={lines[beat]}
          onAdvance={() => (beat < lines.length - 1 ? setBeat(beat + 1) : onDone())}
        />
      </div>
    </section>
  );
}

function SwirlTransition({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1100);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <section className="screen swirl-scene">
      <RainOverlay count={90} />
    </section>
  );
}

function ClassroomScene({ onDone }) {
  const [beat, setBeat] = useState(0);
  const current = CLASSROOM_BEATS[beat];
  const advance = () => setBeat((b) => b + 1);

  let overlay = null;
  if (current.type === "dialogue") {
    overlay = <DialogueBox key={beat} text={current.text} onAdvance={advance} />;
  } else if (current.type === "input") {
    overlay = (
      <InputBox
        key={beat}
        placeholder={current.placeholder}
        onSubmit={(value) => {
          logResponse("classroom_learned", value);
          advance();
        }}
      />
    );
  } else if (current.type === "quiz") {
    overlay = (
      <ChoiceBox
        key={beat}
        prompt={current.prompt}
        options={current.options}
        onSubmit={(i) => {
          logResponse("classroom_quiz", current.options[i]);
          onDone();
        }}
      />
    );
  }

  return (
    <section className="screen classroom-scene">
      <img className="classroom-bg" src={classroomBg} alt="" draggable={false} />
      <div className="ui-layer">{overlay}</div>
    </section>
  );
}

function ThankYouScene({ onRestart }) {
  const lines = ["Thanks!", "See you next time."];
  const [idx, setIdx] = useState(0);
  const [display, done, skip] = useTypewriter(lines[idx]);

  useEffect(() => {
    if (done && idx < lines.length - 1) {
      const t = setTimeout(() => setIdx(idx + 1), 1400);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, idx]);

  return (
    <section className="screen end-scene" onClick={() => !done && skip()}>
      <RainOverlay count={30} />
      <p className="end-text">{display}</p>
      {done && idx === lines.length - 1 && (
        <button className="btn-start play-again-btn" onClick={onRestart}>
          Play Again
        </button>
      )}
    </section>
  );
}

export default function Journey({ skipCustomization, onRestart }) {
  const [stage, setStage] = useState(skipCustomization ? "ticket" : "quarters");
  const [accessory, setAccessory] = useState(null);

  return (
    <>
      {stage === "quarters" && (
        <QuartersScene
          onPick={(id) => {
            setAccessory(id);
            setStage("choice");
          }}
        />
      )}
      {stage === "choice" && (
        <CharacterChoiceScene
          accessory={accessory}
          onPickAccessory={setAccessory}
          onContinue={() => setStage("confirm")}
        />
      )}
      {stage === "confirm" && (
        <CharacterConfirmScene
          accessory={accessory}
          onYes={() => setStage("ticket")}
          onNo={() => setStage("choice")}
        />
      )}
      {stage === "ticket" && <ShowTicketScene onCorrect={() => setStage("portal")} />}
      {stage === "portal" && <PortalScene onDone={() => setStage("city")} />}
      {stage === "city" && (
        <CityScene accessory={accessory} onDone={() => setStage("swirl")} />
      )}
      {stage === "swirl" && <SwirlTransition onDone={() => setStage("classroom")} />}
      {stage === "classroom" && <ClassroomScene onDone={() => setStage("end")} />}
      {stage === "end" && <ThankYouScene onRestart={onRestart} />}
    </>
  );
}
