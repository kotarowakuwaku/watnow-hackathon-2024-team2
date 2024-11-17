import React from "react";
import { CSSProperties } from "react";

type MediaModalProps = {
  uploadedImage: string;
  setUploadedImage: (uploadedImage: string) => void;
  imageSize: number;
  setImageSize: (imageSize: number) => void;
  closeModal: () => void;
  handleComplete: () => void;
};

const styles: { [key: string]: CSSProperties } = {
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#969696",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    padding: "20px",
    zIndex: 20,
    height: "auto",
    //maxHeight: "600px",
    width: "auto",
    opacity: "0.93",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    minWidth: "320px",
  },
  input: {
    width: "60%",
    //height: "100%",
    padding: "10px",
    margin: "0px 0",
  },
  preview: {
    marginTop: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    overflow: "hidden",
  },
  slider: {
    width: "100%",
    marginBottom: "10px",
  },
};

const MediaModal = ({
  uploadedImage,
  setUploadedImage,
  imageSize,
  setImageSize,
  closeModal,
  handleComplete,
}: MediaModalProps) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setUploadedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={styles.modal}>
      <h2
        style={{
          fontSize: "23px",
          color: "white",
          height: "10%",
          width: "100%",
          alignItems: "flex-start",
          display: "flex",
        }}
      >
        画像のアップロード
      </h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={styles.input}
      />
      {uploadedImage && (
        <div style={styles.preview}>
          <img
            src={uploadedImage}
            alt="プレビュー"
            style={{
              width: `${imageSize}%`,
              height: "auto",
              //maxHeight: "100px"
            }}
          />
          <input
            type="range"
            min="50"
            max="200"
            value={imageSize}
            onChange={(e) => setImageSize(Number(e.target.value))}
            style={styles.slider}
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <button onClick={closeModal} style={{ marginRight: "auto" }}>
          閉じる
        </button>
        <button onClick={handleComplete} style={{ marginLeft: "auto",color: "#FFF" }}>
          完了
        </button>
      </div>
    </div>
  );
};

export default MediaModal;
