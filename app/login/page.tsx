"use client";

import React from 'react';
import { set, useForm } from 'react-hook-form';
import Btn from '../components/Button'; // コンポーネントのパスを修正

const styles = {
    container: {
        width: "100%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    h1: {
        marginBottom: '20px',
        fontSize: '32px',
        fontWeight: 'bold',
    },
    h2: {
        marginBottom: '10px',
        fontSize: '24px',
    },
    label: {
        margin: '10px 0 5px',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
};

const NewRegistration = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [submitted, setSubmitted] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    });

    const onSubmit = (data) => {
        console.log(data); // ここでデータを確認
        setFormData(data); // データを更新
        setSubmitted(true); // フォーム送信時に状態を更新
    };

    return (
        <div>
            {submitted ? (
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <h1 style={styles.h1}>ログイン</h1>
                    <h2 style={styles.h2}>以下の内容で保存されました</h2>
                    <h2 style={styles.h2}>{formData.name}さん おかえりなさい！</h2>
                    <div style={styles.container}>
                        <p>ID: {formData.email}</p>
                        <p>パスワード: {formData.password}</p>
                    </div>
                    <Btn type="button" text="はじめる" onClick={() => window.location.href = "./home"} />
                </div>
            ) : (
                <>
                    <h1 style={styles.h1}>ログイン</h1>
                    <form style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }} onSubmit={handleSubmit(onSubmit)}>
                        <div style={styles.container}>
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
                            <p>まだ登録していない方はこちら</p>
                            <Btn type="button" text="新規登録画面へ" onClick={()=> window.location.href = "./newRegistration"}/>
                    </div>
                </>
            )}
        </div>
    );
};

export default NewRegistration;