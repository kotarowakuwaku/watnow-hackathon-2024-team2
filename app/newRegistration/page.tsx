"use client";

import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import Btn from "../components/Button"; // コンポーネントのパスを修正
import pen from "../images/reg1.png";
import mail from "../images/reg2.png";
import key from "../images/reg3.png";
import { CSSProperties } from "react";

const styles: { [key: string]: CSSProperties } = {
  container: {
    fontFamily: "JPFont",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "0px",
    maxWidth: "500px",
    margin: "32px",
    border: "1px solid #000",
    borderRadius: "20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  user: {
    display: "flex",
  },
  p: {
    marginBottom: "10px",
    fontWeight: "bold",
  },

  h1: {
    fontFamily: "JPFont",
    marginRight: "40%",
    marginTop: "165px",
    fontSize: "32px",
    fontWeight: "bold",
  },
  h2: {
    marginRight: "0%",
    fontFamily: "JPFont",
    marginTop: "10px",
    fontSize: "24px",
  },
  label: {
    backgroundColor: "#E6E6E6",
    width: "100%",
    borderTopRightRadius: "20px",
    display: "flex",
    padding: "10px",
    fontSize: "14px",
    fontFamily: "JPFont",
    margin: "0 auto",
    fontWeight: "Bold",
  },
  label2: {
    backgroundColor: "#E6E6E6",
    width: "100%",
    display: "flex",
    padding: "13px",
    fontSize: "14px",
    fontFamily: "JPFont",
    margin: "0 auto",
    fontWeight: "Bold",
  },
  input: {
    fontFamily: "JPFont",
    width: "100%",
    padding: "10px",
    margin: "0px 60px 0px 0px",
    border: "1px solid #FFF",
  },
  input2: {
    fontFamily: "JPFont",
    width: "100%",
    padding: "10px",
    margin: "0px 60px 0px 0px",
    border: "1px solid #FFF",
    borderBottomLeftRadius: "20px",
    borderBottomRightRadius: "20px",
  },
};

const NewRegistration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string; email: string; password: string }>();
  const [submitted, setSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const onSubmit = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    setFormData(data); // データを更新

    // registerUserを呼び出してユーザーを登録
    await registerUser(data);
  };

  const registerUser = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          username: data.name, // userNameを適切にマッピング
        }),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      // localStorageにemailを保存
      localStorage.setItem("userEmail", responseData.user.email);
      setSubmitted(true); // フォーム送信時に状態を更新
    } else {
      console.error("Registration failed");
      // エラーメッセージを表示するための状態管理を追加することも考慮
      window.alert("登録に失敗しました");
    }
  };
  return (
    <div>
      {submitted ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <h1 style={styles.h1}>新規登録</h1>
          <h2 style={styles.h2}>登録が完了しました</h2>
          <div style={{display: "flex", alignItems: "center" ,width: "100%", justifyContent: "center"}}>
            <div style={styles.container}>
              <div style={{ padding: "19px", margin: "10px", }}>
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    marginBottom: "10px",
                  }}
                >
                  {formData.name}さん
                </p>
                <p>ID: {formData.email}</p>
                <p>パスワード: {formData.password}</p>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Btn
              type="button"
              text="はじめる"
              onClick={() => (window.location.href = "./selectGenle")}
            />
          </div>
        </div>
      ) : (
        <>
          <h1 style={styles.h1}>新規登録</h1>
          <h2 style={styles.h2}>アカウントを作成する</h2>
          <form
            style={{
              fontFamily: "JPFont",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div style={styles.container}>
              <div style={styles.user}>
                <Image
                  style={{
                    backgroundColor: "#E6E6E6",
                    borderTopLeftRadius: "20px",
                    padding: "13px",
                  }}
                  src={pen}
                  alt="pen"
                  width={50}
                />
                <label style={styles.label}>ユーザー名</label>
              </div>
              <input
                type="text"
                {...register("name", { required: "ユーザー名は必須です" })}
                style={styles.input}
                placeholder="ユーザー名を入力してください"
              />
              <div style={styles.user}>
                <Image
                  style={{ backgroundColor: "#E6E6E6", padding: "13px" }}
                  src={mail}
                  alt="mail"
                  width={50}
                />
                <label style={styles.label2}>ID</label>
              </div>
              <input
                type="text"
                {...register("email", {
                  required: "メールアドレスは必須です",
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: "有効なメールアドレスを入力してください",
                  },
                })}
                style={styles.input}
                placeholder="メールアドレスを入力してください"
              />
              {errors.email && (
                <p style={{ color: "red", padding: "10px" }}>
                  {errors.email.message}
                </p>
              )}
              <div style={styles.user}>
                <Image
                  style={{ backgroundColor: "#E6E6E6", padding: "13px" }}
                  src={key}
                  alt="key"
                  width={50}
                />
                <label style={styles.label2}>パスワード</label>
              </div>
              <input
                type="password"
                {...register("password", {
                  required: "パスワードは必須です",
                  minLength: {
                    value: 6,
                    message: "パスワードは6文字以上でなければなりません",
                  },
                })}
                style={styles.input2}
                placeholder="パスワードを入力してください"
              />
              {errors.password && (
                <p style={{ color: "red", padding: "10px" }}>
                  {errors.password.message}
                </p>
              )}
            </div>
            <div
              style={{
                marginTop: "-10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Btn type="submit" text="送信する" />
            </div>
          </form>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "40px",
              width: "100%",
            }}
          >
            <p style={{ fontFamily: "JPFont" }}>ログイン済みの方はこちら</p>
            <Btn
              type="button"
              text="ログインへ"
              onClick={() => (window.location.href = "./login")}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default NewRegistration;
