"use client";

import title from "./images/retitle.png";
import Image from "next/image";
import Btn from "./components/Button";
import styles from "./page.module.css";
import point from "./images/point.png";

export default function Home() {
  const handleClick = () => {
    window.location.href = "/newRegistration";
  };

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexFlow: "column",
          height: "90%",
          cursor: `url(${point}), auto`,
        }}
      >
        {/* Apply the CSS module class */}
        <p className={styles.text}>好きな情報をまとめて管理</p>
        <Image
          className={styles.title}
          src={title}
          alt="title"
        />
        <div
          className={styles.button}
          style={{
            marginTop: "50px",
            display: "flex",
            flexFlow: "column",
            alignItems: "center"
          }}
        >
          <Btn
            text={"ログイン"}
            type={"button"}
            onClick={() => (window.location.href = "/login")}
          />
          <Btn type={"button"} text={"新規登録"} onClick={handleClick} />
        </div>
      </main>
      <footer
        style={{
          display: "flex",
          height: "10%",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderTop: "1px solid #ccc",
            width: "80%",
          }}
        >
          <p style={{ color: "#717171", fontSize: "14px" }}>
            @watnowハッカソン
          </p>
        </div>
      </footer>
    </div>
  );
}
