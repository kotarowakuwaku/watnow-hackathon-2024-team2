import React, { useState, useEffect } from "react";
import Sbutton from "../images/sbutton.png";
import button from "../images/button.png";

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
        paddingBottom: "30px",
        //maxWidth: "0%",
      }}
    >
      <img
        src={buttonImage}
        alt="Responsive Button"
        style={{
          marginTop: buttonImage=== Sbutton.src ? "0px" : "30px",
          width: buttonImage === Sbutton.src ? "84px" : isLargeScreen ? "450px" : "300px",
        }}
        onClick={() => (window.location.href = "./selectFavorite")}
      />
    </button>
  );
};

export default ResponsiveButton;
