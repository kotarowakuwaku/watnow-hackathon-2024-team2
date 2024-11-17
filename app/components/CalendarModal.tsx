import React, { useState } from "react";
import { CSSProperties } from "react";

type CalendarModalProps = {
  setEvents: (events: { title: string; start: string; end: string }) => void;
  closeModal: () => void;
};

const styles: { [key: string]: CSSProperties } = {
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#969696",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    padding: "20px",
    zIndex: 20,
    width: "100%",
    opacity: "0.93",
    height: "40%",
    minWidth: "320px",
  },
  input: {
    width: "100%",
    color: "#FFFFFF",
    backgroundColor: "#969696",
    padding: "10px",
    margin: "10px",
  },
  button: {
    marginTop: "10px",
    fontSize: "20px",
    color: "#FFFFFF",
  },
};

const CalendarModal = ({ setEvents, closeModal }: CalendarModalProps) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleAddEvent = () => {
    if (title && start) {
      const newEvent = { title, start, end: end || start };
      setEvents(newEvent); // newEvent を正しく渡す
      closeModal();
    }
  };

  return (
    <>
      <style jsx>{`
        input::placeholder {
          color: white;
          opacity: 1;
        }
      `}</style>
      <div style={styles.modal as React.CSSProperties}>
        <input
          type="text"
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="イベントタイトル"
        />
        <input
          type="date"
          style={styles.input}
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <p
          style={{
            justifySelf: "center",
            color: "white",
            writingMode: "vertical-rl",
          }}
        >
          ～
        </p>
        <input
          type="date"
          style={styles.input}
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          placeholder="終了日 (任意)"
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0px",
          }}
        >
          <button
            onClick={closeModal}
            style={{
              ...styles.button,
              //marginRight: "0",
              fontSize: "20px",
              color: "black",
            }}
          >
            閉じる
          </button>
          <button onClick={handleAddEvent} style={styles.button}>
            追加
          </button>
        </div>
      </div>
    </>
  );
};

export default CalendarModal;
