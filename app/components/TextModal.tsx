import React from "react";
import Image from "next/image";
import left from "../images/leftSort.png"; // 左矢印アイコン
import center from "../images/centerSort.png"; // 中央矢印アイコン
import right from "../images/rightSort.png"; // 右矢印アイコン
import { colors, Hidden } from "@mui/material";

type TextModalProps = {
  text: string;
  setText: (text: string) => void;
  fontSize: number;
  setFontSize: (fontSize: number) => void;
  alignment: "left" | "center" | "right";
  setAlignment: (alignment: "left" | "center" | "right") => void;
  closeModal: () => void;
  handleText: () => void;
};

const styles = {
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
    padding: "10px",
    backgroundColor: "#969696",
    height: "40%",
    marginBottom: "10px",
    color: "#FFF",
    fontFamily: "JPFont",
  },
  slider: {
    width: "100%",
    display: "flex",
    height: "8px",
    alignItem: "center",
    marginBottom: "10px",
    color: "#FFFFFF",
  },
  sliderThumb: {
    appearance: "none", // デフォルトのスタイルを無効化
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "#000",
    cursor: "pointer",
  },
  alignmentButton: (isActive: boolean) => ({
    border: "none",
    background: isActive ? "#969696" : "transparent",
    color: isActive ? "#fff" : "black",
    cursor: "pointer",
  }),
};

const TextModal = ({
  text,
  setText,
  fontSize,
  setFontSize,
  alignment,
  setAlignment,
  closeModal,
  handleText,
}: TextModalProps) => {
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // input[type="range"] の値を数値に変換して setFontSize に渡す
    setFontSize(Number(e.target.value));
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
          style={{ ...styles.input, color: "#FFF", fontSize: `${fontSize}px` }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="テキストを入力"
        />
        <input
          type="range"
          style={styles.slider}
          min="10"
          max="40"
          value={fontSize}
          onChange={handleFontSizeChange}
        />
        <div
          style={{
            display: "flex",
            gap: "10px",
            border: "1px solid #ccc",
            padding: "5px",
            borderRadius: "5px",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <button
            onClick={() => setAlignment("left")}
            style={styles.alignmentButton(alignment === "left")}
          >
            <Image src={left} alt={"左揃え"} width={30} height={30} />
          </button>
          <button
            onClick={() => setAlignment("center")}
            style={styles.alignmentButton(alignment === "center")}
          >
            <Image src={center} alt={"中央揃え"} width={30} height={30} />
          </button>
          <button
            onClick={() => setAlignment("right")}
            style={styles.alignmentButton(alignment === "right")}
          >
            <Image src={right} alt={"右揃え"} width={30} height={30} />
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <button onClick={closeModal} style={{ marginRight: "auto",fontSize:"20px", color:"black" }}>
            閉じる
          </button>
          <button onClick={handleText} style={{ marginLeft: "auto",fontSize: "20px",color:"white" }}>
            決定
          </button>
        </div>
      </div>
    </>
  );
};

export default TextModal;
