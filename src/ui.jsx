import { useEffect, useMemo, useRef, useState } from "react";

export function useTypewriter(text) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    setDisplay("");
    setDone(false);
    indexRef.current = 0;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      indexRef.current += 1;
      setDisplay(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(timerRef.current);
        setDone(true);
      }
    }, 28);
    return () => clearInterval(timerRef.current);
  }, [text]);

  const skip = () => {
    clearInterval(timerRef.current);
    setDisplay(text);
    setDone(true);
  };

  return [display, done, skip];
}

export function DialogueBox({ text, onAdvance }) {
  const [display, done, skip] = useTypewriter(text);
  return (
    <div
      className="box dialogue-box"
      onClick={() => {
        if (!done) skip();
        else onAdvance();
      }}
    >
      <p>{display}</p>
      <div className="advance-indicator">&#9660;</div>
    </div>
  );
}

export function InputBox({ placeholder, onSubmit }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  const submit = () => {
    if (!value.trim()) {
      inputRef.current && inputRef.current.focus();
      return;
    }
    onSubmit(value.trim());
  };

  return (
    <div className="box input-box">
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        maxLength={120}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
      />
      <button className="pixel-btn" onClick={submit}>[SUBMIT]</button>
    </div>
  );
}

export function ChoiceBox({ prompt, options, onSubmit }) {
  const [selected, setSelected] = useState(-1);
  return (
    <div className="box choice-box">
      <p className="choice-prompt">{prompt}</p>
      <div className="choice-list">
        {options.map((opt, i) => (
          <button
            key={opt}
            className={`choice-opt${selected === i ? " selected" : ""}`}
            onClick={() => setSelected(i)}
          >
            <span className="mark">{selected === i ? "[+]" : "[ ]"}</span>
            {opt}
          </button>
        ))}
      </div>
      <button
        className="pixel-btn"
        disabled={selected < 0}
        onClick={() => onSubmit(selected)}
      >
        [SUBMIT]
      </button>
    </div>
  );
}

export function YesNoBox({ text, onYes, onNo }) {
  return (
    <div className="box yesno-box">
      <p>{text}</p>
      <div className="yesno-buttons">
        <button className="btn-no" onClick={onNo}>NO</button>
        <button className="btn-yes" onClick={onYes}>YES</button>
      </div>
    </div>
  );
}

export function RainOverlay({ count = 50 }) {
  const drops = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 5,
      })),
    [count]
  );
  return (
    <div className="rain">
      {drops.map((d, i) => (
        <i
          key={i}
          style={{
            left: `${d.left}%`,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
