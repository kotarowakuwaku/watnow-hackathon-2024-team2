"use client";

import React, { useEffect, useState } from 'react';
import xIcon from "../../images/x.png"; // Ensure this path is correct
import spotifyIcon from "../../images/spotify.png"; // Ensure this path is correct
import Image from 'next/image';
import Btn from '@/app/components/Button';
import {
    Checkbox,
    FormControlLabel,
    FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CSSProperties } from 'react';
import styless from "./page.module.css";

// スタイル付きチェックボックス
const CustomCheckbox = styled(Checkbox)(() => ({
    display: "none", // 元のチェックボックスを非表示にする
}));

// チェックボックスラベルのスタイル
const CustomFormControlLabel = styled(FormControlLabel, { shouldForwardProp: (prop) => prop !== 'checked' })(
    ({ theme, checked }) => ({
        position: 'relative',
        display: 'flex',
        margin: '0',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'calc(40% - 14px)',
        padding: '20px',
        marginRight: '20px',
        height: '40px',
        border: '1.8px solid #000',
        borderRadius: '20px',
        backgroundColor: theme.palette.common.white, // クリック後も最初も完全に白
        cursor: 'pointer',
        transition: 'background-color 0.6s ease, color 0.6s ease', // 背景色と文字色の遷移をゆっくり
        color: theme.palette.text.primary, // クリック後も黒文字
        '&:hover': {
            backgroundColor: theme.palette.grey[300], // ホバー時はグレー
        },
        '&::before': {
            content: '""',
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            bottom: '-2px',
            left: '-2px',
            borderRadius: 'inherit',
            padding: '2.7px',
            background: 'conic-gradient(#EAC46A, #D5FCD5, #6C97EC, #0731FB, #7634DB, #FF44AA,#FF6E49,#FF8E03,#EAC463)', // 虹色ボーダー風の背景
            opacity: checked ? 1 : 0, // クリック後は透明度を変更して遷移
            transition: 'opacity 0.6s ease', // opacityに対して遷移を適用
            '-webkit-mask':
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', // 背景色がボーダーになるようにする
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
        },
    })
);


//          ? 'conic-gradient(#FE6658, #FFDA85, #90FFA2, #002AFF, #7B35DA, #FF40B2, #FE6658)' // 虹色ボーダー風の背景

// チェックボックスラベルのコンテナ
const CheckboxContainer = styled("div")({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "29px",
});

const Preview = ({ params }: { params: { favoriteName: string } }) => {
    const [getData, setGetData] = useState({
        oshi_name: "",
        profession: "",
        summary: "",
        image_url: "",
        official_site_url: "",
        sns_links: {}, // オブジェクト形式
    });
    const [submitting, setSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // ローディングステート
    const [genles, setGenles] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [checkedItems, setCheckedItems] = React.useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const decodedFavoriteName = decodeURIComponent(params.favoriteName);
        const fetchFavorite = async () => {
            await getFavorite({ oshi_name: decodedFavoriteName });
        };
        fetchFavorite();
    }, []);

    const getFavorite = async (data:
        {
            oshi_name: string;
        }
    ) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/oshi/fetch-oshi-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oshi_name: data.oshi_name,
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                setGetData(responseData);
            } else {
                console.error('Failed to fetch genres');
            }
        } catch (error) {
            console.error('Error fetching genres:', error);
        } finally {
            setIsLoading(false); // データ取得後にローディングを終了
        }
    };

    const setFavorite = async (data:
        {
            email: string;
            oshi_name: string;
            genre: string;
        }
    ) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/oshi/save-oshi-info-and-genres`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                oshi_name: data.oshi_name,
                genre: data.genre,
            }),
        });

        if (response.ok) {
            window.location.href = `/makeFavoritePage/${data.oshi_name}`;
        } else {
            setSubmitting(false);
            console.error('Registration failed');
        }
    };

    const getGenles = async (data:
        {
            email: string;
        }
    ) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/genre/get-user-genres`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                setGenles(responseData.genres);
                setSubmitted(true);
            } else {
                console.error('Failed to fetch genres');
                setGenles([]);
            }
        } catch (error) {
            console.error('Error fetching genres:', error);
            setGenles([]);
        }
    };

    const handleDisplayChange = async () => {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            await getGenles({ email: userEmail });
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setCheckedItems(() => ({
            [name]: checked,
        }));
    };

    const handleSubmit = async () => {
        const userEmail = localStorage.getItem("userEmail");
        const selectedItems = Object.keys(checkedItems).filter((key) => checkedItems[key]);
        if (userEmail) {
            const submitData = { email: userEmail, oshi_name: getData.oshi_name, genre: selectedItems[0] };
            setSubmitting(true);
            await setFavorite(submitData);
        } else {
            console.log("email is not found");
        }
    };

    const styles: { [key: string]: CSSProperties } = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            //maxWidth: '600px',
            height: '100vh',
            color: '#4F4F4F',
        },
        loading: {
            fontSize: '2rem',
            textAlign: 'center',
            margin: '20px 0',
        },
        title: {
            width: "80%",
            fontSize: '3rem',
            fontWeight: 'bold',
            textAlign: "left"
        },
        titleContainer: {
            width: "100%",
            display: 'flex',
            justifyContent: 'center',
        },
        genre: {
            width: "80%",
            fontSize: '1.25rem',
            textAlign: "left"
        },
        descriptionContainer: {
            display: 'flex',
            justifyContent: 'center',
        },
        description: {
            width: "80%",
            fontSize: '0.875rem',
            margin: '15px 0',
            textAlign: "left",
        },
        image: {
            maxWidth: '100%',
            borderRadius: '8px',
            maxHeight: '200px',
        },
        officialLinkLabel: {
            width: "80%",
            fontSize: '0.875rem',
            marginTop: '15px',
            textAlign: "left",
        },
        officialLink: {
            width: "80%",
            fontSize: '0.875rem',
            textDecoration: 'underline',
            textAlign: "left",
        },
        snsContainerLabel: {
            width: "80%",
            fontSize: '0.875rem',
            marginTop: '15px',
            textAlign: "left",
        },
        snsContainer: {
            width: "80%",
            display: 'flex',
            fontSize: '0.875rem',
            textAlign: "left",
        },
        snsButton: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            marginRight: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
        },
    };

    return (
        <div style={styles.container}>
            {isLoading ? (
        <div
          style={{
            backgroundColor: "#F5F5F5",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <div className={styless.loadingDonut}></div>{" "}
          {/* モジュールからクラスを使用 */}
          <p style={{ marginTop: "20px", fontFamily: "JPFont" }}>
            Loading... Please wait...
          </p>
        </div>
            ) : (
                !submitted ? (
                    <>
                        <div style={styles.titleContainer}>
                            <h1 style={styles.title}>{getData.oshi_name}</h1>
                        </div>
                        {getData.profession !== "Profession not found" && (
                            <div style={styles.titleContainer}>
                                <h2 style={styles.genre}>{getData.profession}</h2>
                            </div>
                        )}
                        <img src={getData.image_url} alt={getData.oshi_name} style={styles.image} />
                        {getData.summary !== "Summary not found" && (
                            <div style={styles.descriptionContainer}>
                                <p style={styles.description}>{getData.summary}</p>
                            </div>
                        )}
                        <div style={styles.titleContainer}>
                            <p style={styles.officialLinkLabel}>officialサイト</p>
                        </div>
                        <div style={styles.titleContainer}>
                            <a href={getData.official_site_url} style={styles.officialLink}>{getData.official_site_url}</a>
                        </div>
                        <div style={styles.titleContainer}>
                            <p style={styles.officialLinkLabel}>SNSリンク</p>
                        </div>
                        <div style={styles.titleContainer}>
                            <div style={styles.snsContainer}>
                                {Object.entries(getData.sns_links).map(([name, url]) => (
                                    <a key={name} href={url as string} target="_blank" rel="noopener noreferrer" style={styles.snsButton}>
                                        {name === "youtube" ? (
                                            <Image src={"https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"} alt={name} width={25} height={25} unoptimized />
                                        ) : name === "spotify" ? (
                                            <Image src={spotifyIcon} alt={name} width={25} height={25} unoptimized />
                                        ) : name === "x" ? (
                                            <Image src={xIcon} alt={name} width={25} height={25} unoptimized />
                                        ) : name === "instagram" ? (
                                            <Image src={"https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"} alt={name} width={25} height={25} unoptimized />
                                        ) : null}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div style={{ margin: '30px 0 10px 0' }}>
                            <Btn type={"button"} text={"タグ選択画面へ"} onClick={handleDisplayChange} />
                        </div>
                        <Btn type={"button"} text={"検索画面に戻る"} onClick={() => window.location.href = "/selectFavorite"} />
                    </>
                ) : (
                    <>
                        <h2 style={{
                            fontSize: "1.5rem",
                        }}>登録したタグから一つ選択しよう！</h2>
                        <FormControl
                            component="fieldset"
                            sx={{
                                marginTop: "20px",
                            }}
                        >

                            <CheckboxContainer>
                                {genles.map((tag) => (
                                    <CustomFormControlLabel
                                        key={tag}
                                        control={
                                            <CustomCheckbox
                                                checked={!!checkedItems[tag]}
                                                onChange={handleChange}
                                                name={tag.toString()}
                                            />
                                        }
                                        label={tag}
                                        checked={!!checkedItems[tag]}
                                    />
                                ))}
                            </CheckboxContainer>
                            <div style={{
                                margin: "0 auto",
                                marginTop: "40px",
                            }}>

                                <Btn type={"button"} text={"推しノート作成へ"} onClick={handleSubmit} />
                            </div>
                        </FormControl>
                    </>
                )
            )}
        </div>
    );
};

export default Preview;