import { useEffect, useRef, useState } from "react";
import ticketImage from "./assets/vip-ticket.png";
import boardingImage from "./assets/train-boarding.png";
import platformBg from "./assets/scene-platform.webp";
import trainBg from "./assets/scene-train.webp";
import quartersBg from "./assets/scene-quarters.webp";
import clawdNeutral from "./assets/clawd-neutral.webp";
import clawdPoint from "./assets/clawd-point.webp";
import clawdShrug from "./assets/clawd-shrug.webp";
import { useTypewriter, DialogueBox, InputBox, ChoiceBox, YesNoBox, RainOverlay } from "./ui";
import Journey from "./Journey";

const SCENES = {
  platform: platformBg,
  train: trainBg,
  quarters: quartersBg,
};

const CHAR_POSES = {
  neutral: clawdNeutral,
  point: clawdPoint,
  shrug: clawdShrug,
};

const CHAR_ANCHOR = {
  platform: { x: 58, y: 87 },
  train: { x: 62, y: 90 },
  quarters: null,
};

// Platform is a wide establishing shot (Clawd reads smaller, further away);
// train interior is a closer shot.
const CHAR_SCALE = {
  platform: 24,
  train: 48,
};

const OTHER_OPTION_INDEX = 3;

const steps = [
  { type: "dialogue", scene: "platform", char: "point", text: "You've arrived just in time." },
  { type: "portrait", image: boardingImage, text: "The name is Clawd, welcome." },
  { type: "dialogue", scene: "train", char: "point", text: "I am taking you inside the black box of AI.", transition: true },
  { type: "dialogue", scene: "train", char: "shrug", text: "If you could guess, what do you think is inside the black box?" },
  { type: "input", scene: "train", char: "neutral", placeholder: "Type your guess..." },
  { type: "dialogue", scene: "train", char: "point", text: "Thank you!" },
  {
    type: "choice",
    scene: "train",
    char: "neutral",
    prompt: "From this list what do you want to know?",
    options: ["What are tokens", "Mathematical matrixes", "AI safety", "Other"],
  },
  { type: "input", scene: "train", char: "neutral", placeholder: "What would you like to know?" },
  { type: "dialogue", scene: "train", char: "point", text: "Thank you!" },
  { type: "yesno", scene: "train", char: "shrug", text: "Before we arrive may I show you where you could change?" },
];

const IDX = {
  GUESS_INPUT: 4,
  THANK_YOU_1: 5,
  CHOICE: 6,
  OTHER_INPUT: 7,
  THANK_YOU_2: 8,
  YESNO: 9,
};

function PannableScene({ sceneName, charPose }) {
  const viewportRef = useRef(null);
  const layerRef = useRef(null);
  const bgRef = useRef(null);
  const panRef = useRef(0);
  const minPanRef = useRef(0);
  const dragRef = useRef(null);
  const [hintVisible, setHintVisible] = useState(true);
  const anchor = CHAR_ANCHOR[sceneName];

  const applyTransform = () => {
    if (layerRef.current) {
      layerRef.current.style.transform = `translate(${panRef.current}px,-50%)`;
    }
  };

  const clampPan = () => {
    const vp = viewportRef.current;
    const bg = bgRef.current;
    if (!vp || !bg || !bg.offsetWidth) return;
    minPanRef.current = Math.min(0, vp.clientWidth - bg.offsetWidth);
    panRef.current = Math.min(0, Math.max(minPanRef.current, panRef.current));
    applyTransform();
  };

  // Rests the camera facing whatever Clawd is standing in front of, rather
  // than always starting at the image's left edge — dragging still reveals
  // the rest of the panorama either direction.
  const centerOnAnchor = () => {
    const vp = viewportRef.current;
    const bg = bgRef.current;
    if (!vp || !bg || !bg.offsetWidth) return;
    const vw = vp.clientWidth;
    const bw = bg.offsetWidth;
    minPanRef.current = Math.min(0, vw - bw);
    const target = anchor ? vw / 2 - (anchor.x / 100) * bw : (vw - bw) / 2;
    panRef.current = Math.min(0, Math.max(minPanRef.current, target));
    applyTransform();
  };

  useEffect(() => {
    panRef.current = 0;
    centerOnAnchor();
    window.addEventListener("resize", clampPan);
    return () => window.removeEventListener("resize", clampPan);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneName]);

  const onPointerDown = (e) => {
    dragRef.current = { startX: e.clientX, startPan: panRef.current };
    viewportRef.current.setPointerCapture(e.pointerId);
    setHintVisible(false);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    panRef.current = Math.min(0, Math.max(minPanRef.current, dragRef.current.startPan + dx));
    applyTransform();
  };
  const endDrag = () => {
    dragRef.current = null;
  };

  return (
    <div
      className="scene-viewport"
      ref={viewportRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="scene-layer" ref={layerRef}>
        <img
          ref={bgRef}
          className="scene-bg"
          src={SCENES[sceneName]}
          alt=""
          draggable={false}
          onLoad={centerOnAnchor}
        />
        {charPose && anchor && (
          <img
            className="scene-char"
            src={CHAR_POSES[charPose]}
            alt=""
            draggable={false}
            style={{
              left: `${anchor.x}%`,
              top: `${anchor.y}%`,
              height: `${CHAR_SCALE[sceneName] ?? 48}%`,
            }}
          />
        )}
      </div>
      {hintVisible && <div className="drag-hint">&#8596; DRAG TO LOOK AROUND</div>}
    </div>
  );
}

function InviteScreen({ onStart }) {
  return (
    <section className="screen invite-screen">
      <RainOverlay />
      <img className="ticket-art" src={ticketImage} alt="VIP ticket" />
      <h1 className="title">
        You've been
        <br />
        invited
      </h1>
      <p className="subtitle">Step inside the black box of AI to learn more</p>
      <button className="btn-start" onClick={onStart}>Start Quest</button>
    </section>
  );
}

function WorldScreen({ onRestart, onFinishTrain }) {
  const [cur, setCur] = useState(0);
  const [fading, setFading] = useState(false);
  const step = steps[cur];

  const goTo = (i) => {
    if (steps[i].transition) {
      setFading(true);
      setTimeout(() => {
        setCur(i);
        setTimeout(() => setFading(false), 60);
      }, 350);
    } else {
      setCur(i);
    }
  };
  const advance = () => goTo(cur + 1);

  let overlay = null;
  if (step.type === "dialogue") {
    overlay = (
      <DialogueBox
        key={cur}
        text={step.text}
        onAdvance={() => {
          if (cur === IDX.THANK_YOU_1) goTo(IDX.CHOICE);
          else if (cur === IDX.THANK_YOU_2) goTo(IDX.YESNO);
          else advance();
        }}
      />
    );
  } else if (step.type === "input") {
    overlay = (
      <InputBox
        key={cur}
        placeholder={step.placeholder}
        onSubmit={() => {
          if (cur === IDX.GUESS_INPUT) goTo(IDX.THANK_YOU_1);
          else if (cur === IDX.OTHER_INPUT) goTo(IDX.THANK_YOU_2);
        }}
      />
    );
  } else if (step.type === "choice") {
    overlay = (
      <ChoiceBox
        key={cur}
        prompt={step.prompt}
        options={step.options}
        onSubmit={(i) => {
          if (i === OTHER_OPTION_INDEX) goTo(IDX.OTHER_INPUT);
          else goTo(IDX.THANK_YOU_2);
        }}
      />
    );
  } else if (step.type === "yesno") {
    overlay = (
      <YesNoBox
        key={cur}
        text={step.text}
        onYes={() => onFinishTrain(false)}
        onNo={() => onFinishTrain(true)}
      />
    );
  }

  return (
    <section className="screen world-screen">
      {step.type === "portrait" ? (
        <PortraitBeat key={cur} image={step.image} text={step.text} onAdvance={advance} />
      ) : (
        <>
          <PannableScene sceneName={step.scene} charPose={step.char} />
          <div className={`fade-curtain${fading ? " show" : ""}`} />
          <div className="ui-layer">{overlay}</div>
        </>
      )}
      <button className="restart-link" onClick={onRestart}>RESTART</button>
    </section>
  );
}

function PortraitBeat({ image, text, onAdvance }) {
  const [display, done, skip] = useTypewriter(text);
  return (
    <div
      className="portrait-beat"
      style={{ backgroundImage: `url(${image})` }}
      onClick={() => (done ? onAdvance() : skip())}
    >
      <div className="ui-layer">
        <div className="box dialogue-box">
          <p>{display}</p>
          <div className="advance-indicator">&#9660;</div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [phase, setPhase] = useState("invite");
  const [key, setKey] = useState(0);
  const [skipCustomization, setSkipCustomization] = useState(false);

  const restart = () => {
    setPhase("invite");
    setKey((k) => k + 1);
  };

  if (phase === "invite") {
    return <InviteScreen onStart={() => setPhase("train")} />;
  }
  if (phase === "train") {
    return (
      <WorldScreen
        key={key}
        onRestart={restart}
        onFinishTrain={(skip) => {
          setSkipCustomization(skip);
          setPhase("journey");
        }}
      />
    );
  }
  return <Journey key={key} skipCustomization={skipCustomization} onRestart={restart} />;
}

export default App;
