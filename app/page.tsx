"use client";

import title from "./images/title.png";
import Image from "next/image";
import Btn from "./components/Button";

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
        }}
      >
        <p style={{ fontFamily: "JPFont", fontSize: "16 px", color: "#333" }}>
          好きな情報をまとめて管理
        </p>
        <Image src={title} alt="title" width={255} height={255} />
        <div
          style={{
            display: "flex",
            flexFlow: "column",
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
      <footer style={{display: 'flex', height: '10%', justifyContent: 'center',alignContent: 'center',}}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderTop: "1px solid #ccc",
            width: '255px',
          }}
        >
          <p style={{ color: "#717171", fontSize: '14px', }}>@watnowハッカソン</p>
        </div>
      </footer>
    </div>
  );
}
