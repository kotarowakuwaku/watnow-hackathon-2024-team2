import React, { useState, useEffect } from "react";
import Sbutton from "../images/sbutton.png";
import button from "../images/rbutton.png";

const ResponsiveButton = () => {
  const [buttonImage, setButtonImage] = useState("");
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 426px)");

    const updateButtonImage = () => {
      setButtonImage(mediaQuery.matches ? button.src : Sbutton.src);
      setIsLargeScreen(window.innerWidth >= 746); // 746px以上かを判定
    };

    updateButtonImage();
    mediaQuery.addEventListener("change", updateButtonImage);

    return () => mediaQuery.removeEventListener("change", updateButtonImage);
  }, []);

  return (
    <button
      style={{
        background: "none",
        border: "none",
        paddingBottom: isLargeScreen ? "40px" : "10px",
        position: "fixed",
        bottom: "0",       // 画面の下部に配置
        left: "0%",       // 画面の中央に配置（水平）
        //transform: isLargeScreen ? "translateX(10%)" : "translateX(-50%)",  // 水平中央揃え
        zIndex: 1000,      // 他の要素より前面に表示
        backdropFilter: "blur(0.5px)",  // 背景をぼやけさせる
        width: "100%",
        display: "flex",
        marginRight: "0px",
        justifyContent: "center",
       // paddingRight: isLargeScreen ? "80px" : "0px",
        alignItems: "center",
        cursor: "pointer",  // ��ウスカー��ルをボタンに合わせる
        backgroundColor: "rgba(0, 0, 0, 0.001)",  // 半透明の黒背景
      }}
    >
      <img
        src={buttonImage}
        alt="Responsive Button"
        style={{
          // width: "100%",
          marginTop: buttonImage=== Sbutton.src ? "0px" : "30px",
          width: buttonImage === Sbutton.src ? "84px" : isLargeScreen ? "360px" : "300px",

        }}
        onClick={() => (window.location.href = "./selectFavorite")}
      />
    </button>
  );
};

export default ResponsiveButton;
