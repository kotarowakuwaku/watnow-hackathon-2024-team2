"use client";

import React from "react";
import { styled } from "@mui/material/styles";
import {
    Checkbox,
    FormControlLabel,
    FormControl,
    FormLabel,
} from "@mui/material";
import Btn from "../components/Button";

// スタイル付きチェックボックス
const CustomCheckbox = styled(Checkbox)(() => ({
    display: "none", // 元のチェックボックスを非表示にする
}));

// チェックボックスラベルのスタイル
const CustomFormControlLabel = styled(FormControlLabel, {
  shouldForwardProp: (prop) => prop !== "checked",
})(({ theme, checked }) => ({
  position: "relative",
  display: "flex",
  margin: "0px",
  alignItems: "center",
  justifyContent: "center",
  width: "calc(40% - 14px)",
  padding: "20px",
  height: "40px",
  border: "1px solid #000",
  borderRadius: "20px",
  backgroundColor: theme.palette.common.white, // クリック後も最初も完全に白
  cursor: "pointer",
  transition: "background-color 0.6s ease, color 0.6s ease", // 背景色と文字色の遷移をゆっくり
  color: theme.palette.text.primary, // クリック後も黒文字
  "&:hover": {
    backgroundColor: theme.palette.grey[300], // ホバー時はグレー
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-2px",
    right: "-2px",
    bottom: "-2px",
    left: "-2px",
    borderRadius: "inherit",
    padding: "2px",
    background:
      "conic-gradient(#EAC46A, #D5FCD5, #6C97EC, #0731FB, #7634DB, #FF44AA,#FF6E49,#FF8E03,#EAC463)", // 虹色ボーダー風の背景
    opacity: checked ? 1 : 0, // クリック後は透明度を変更して遷移
    transition: "opacity 0.6s ease", // opacityに対して遷移を適用
    "-webkit-mask":
      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", // 背景色がボーダーになるようにする
    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    maskComposite: "exclude",
  },
  "& .MuiFormControlLabel-label": {
    fontSize: "12px",
    fontFamily: 'JPFont', // ここでlabelの文字サイズを変更
  },
}));

//          ? 'conic-gradient(#FE6658, #FFDA85, #90FFA2, #002AFF, #7B35DA, #FF40B2, #FE6658)' // 虹色ボーダー風の背景

// チェックボックスラベルのコンテナ
const CheckboxContainer = styled("div")({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "29px",
});

const sample = [
    { id: 1, label: "音楽/Music", value: "音楽" },
    { id: 2, label: "小説/Nobels", value: "小説" },
    { id: 3, label: "漫画/manga", value: "漫画" },
    { id: 4, label: "ラジオ/Radio Shows", value: "ラジオ" },
    { id: 5, label: "アイドル/Idols", value: "アイドル" },
    { id: 6, label: "お笑い/Comedy", value: "お笑い" },
    { id: 7, label: "映画/Movies", value: "映画" },
    { id: 8, label: "舞台/Theater", value: "舞台" },
    { id: 9, label: "テレビドラマ/TV Dramas", value: "テレビドラマ" },
    { id: 10, label: "ミュージカル/Musicals", value: "ミュージカル" },
    { id: 11, label: "アニメ/Anime", value: "アニメ" },
    { id: 12, label: "ダンス/Dance", value: "ダンス" },
    { id: 13, label: "ゲーム/Video Games", value: "ゲーム" },
    { id: 14, label: "ファッション/Fashion", value: "ファッション" },
    { id: 15, label: "スポーツ/Sports", value: "スポーツ" },
    { id: 16, label: "その他", value: "その他" },
];

export default function SelectGenle() {
    const [checkedItems, setCheckedItems] = React.useState<{ [key: string]: boolean }>({});

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setCheckedItems((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const registerGenles = async (data: { email: string; tags: string[] }) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/genre/select-genres`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                genres: data.tags,
            }),
        });

        if (response.ok) {
            window.location.href = '/selectFavorite';
        } else {
            console.error('Registration failed');
        }
    };

    const handleSubmit = async () => {
        const emailData = localStorage.getItem('userEmail');
        if (emailData) {
            const selectedItems = Object.keys(checkedItems).filter((key) => checkedItems[key]);
    
            // submitDataが更新された後にregisterGenlesを呼び出す
            const currentSubmitData = { tags: selectedItems, email: emailData };
            await registerGenles(currentSubmitData);
        } else {
            console.log('email is not found');
        }
    };

  return (
    <>
      <h1
        style={{
          fontSize: "36px",
          fontFamily: "JPFont",
          fontWeight: "bold",
          color: "#333",
          margin: "80px 0px 0px 40px",
        }}
      >
        はじめまして！
      </h1>
      <h2
        style={{
          fontSize: "20px",
          fontFamily: "JPFont",
          color: "#333",
          margin: "0px 80px 0px 40px",
        }}
      >
        まずはあなたの好きなものを教えてください
      </h2>
      <FormControl
        component="fieldset"
        sx={{
          marginTop: "20px",
        }}
      >
        <FormLabel
          style={{ fontFamily: "JPFont", margin: "0px 0px 10px 40px" }}
          component="legend"
        >
          推しジャンルを選択してください
        </FormLabel>
        <CheckboxContainer>
          {sample.map((item) => (
            <CustomFormControlLabel
              key={item.id}
              control={
                <CustomCheckbox
                  checked={!!checkedItems[item.value]}
                  onChange={handleChange}
                  name={item.value.toString()}
                />
              }
              label={item.label}
              checked={!!checkedItems[item.value]}
            />
          ))}
        </CheckboxContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Btn type={"button"} text={"次に進む"} onClick={handleSubmit} />
        </div>
      </FormControl>
    </>
  );
}
