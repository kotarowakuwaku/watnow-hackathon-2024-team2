"use client";

import Image from "next/image";
import React from "react";
import { set, useForm } from "react-hook-form";
import Btn from "../components/Button"; // コンポーネントのパスを修正
import { Padding } from "@mui/icons-material";
import pen from "../images/reg1.png";
import mail from "../images/reg2.png";
import key from "../images/reg3.png";

const styles = {
  container: {
    fontFamily: "JPFont",
    width: "328px",
    display: "flex",
    flexDirection: "column",
    padding: "0px",
    maxWidth: "400px",
    margin: "32px",
    border: "1px solid #000",
    borderRadius: "20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  user: {
    display: "flex",
  },
  h1: {
    fontFamily: "JPFont",
    marginLeft: "32px",
    marginTop: "165px",
    fontSize: "32px",
    fontWeight: "bold",
  },
  h2: {
    marginLeft: "32px",
    fontFamily: "JPFont",
    marginBottom: "10px",
    fontSize: "24px",
  },
  label: {
    backgroundColor: "#E6E6E6",
    width: "100%",
    borderTopRightRadius: "20px",
    display: "flex",
    padding: "10px",
    fontsize: "14px",
    fontFamily: "JPFont",
    margin: "0 auto",
    fontWeight: "Bold",
  },
  label2: {
    backgroundColor: "#E6E6E6",
    width: "100%",
    display: "flex",
    padding: "10px",
    fontsize: "14px",
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
  } = useForm();
  const [submitted, setSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

    const onSubmit = async (data) => {
        console.log(data); // ここでデータを確認
        setFormData(data); // データを更新
        
        // registerUserを呼び出してユーザーを登録
        await registerUser(data);
        setSubmitted(true); // フォーム送信時に状態を更新
    };

    const registerUser = async (data) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                username: data.name, // userNameを適切にマッピング
            }),
        });
    
        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
            // localStorageにemailを保存
            localStorage.setItem('userEmail', responseData.user.email);
        } else {
            console.error('Registration failed');
            // エラーメッセージを表示するための状態管理を追加することも考慮
            window.alert('登録に失敗しました');
        }
    };

    return (
        <div>
            {submitted ? (
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <h1 style={styles.h1}>新規登録</h1>
                    <h2 style={styles.h2}>登録が完了しました</h2>
                    <div style={styles.container}>
                        <p>{formData.name}さん</p>
                        <p>ID: {formData.email}</p>
                        <p>パスワード: {formData.password}</p>
                    </div>
                    <Btn type="button" text="はじめる" onClick={() => window.location.href = "./selectGenle"} />
                </div>
            ) : (
                <>
                    <h1 style={styles.h1}>新規登録</h1>
                    <h2 style={styles.h2}>アカウントを作成する</h2>
                    <form style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }} onSubmit={handleSubmit(onSubmit)}>
                        <div style={styles.container}>
                            <label style={styles.label}>ユーザー名</label>
                            <input
                                type="text"
                                {...register("name", { required: "ユーザー名は必須です" })}
                                style={styles.input}
                                placeholder="ユーザー名を入力してください"
                            />
                            <label style={styles.label}>ID</label>
                            <input
                                type="text"
                                {...register("email", { required: "メールアドレスは必須です", pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "有効なメールアドレスを入力してください" } })}
                                style={styles.input}
                                placeholder="メールアドレスを入力してください"
                            />
                            {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}

                            <label style={styles.label}>パスワード</label>
                            <input
                                type="password"
                                {...register("password", { required: "パスワードは必須です", minLength: { value: 6, message: "パスワードは6文字以上でなければなりません" } })}
                                style={styles.input}
                                placeholder="パスワードを入力してください"
                            />
                            {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                        </div>
                        <Btn type="submit" text="送信する" />
                    </form>
                    <div style={{
                        marginTop:"40px",
                        width: '100%',
                    }}>
                        <p>ログイン済みの方はこちら</p>
                        <Btn type="button" text="ログインへ" onClick={() => window.location.href = "./login"} />
                    </div>
                </>
            )}
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
                <p style={{ color: "red", padding: '10px' }}>{errors.email.message}</p>
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
                <p style={{ color: "red" , padding: '10px'}}>{errors.password.message}</p>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
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