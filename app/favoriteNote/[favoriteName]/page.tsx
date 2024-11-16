"use client";

import React, { useEffect, useState } from "react";
import xIcon from "../../images/x.png"; // Ensure this path is correct
import spotifyIcon from "../../images/spotify.png"; // Ensure this path is correct
import Image from "next/image";
import Btn from "@/app/components/Button";
import styles from "./page.module.css"; // CSSモジュールのインポート

const Preview = ({ params }: { params: { favoriteName: string } }) => {
  const [getData, setGetData] = useState({
    oshi_name: "",
    profession: "",
    summary: "",
    image_url: "",
    official_site: "",
    sns_links: {}, // オブジェクト形式
  });
  const [isLoading, setIsLoading] = useState(true); // ローディングステート

  useEffect(() => {
    const decodedFavoriteName = decodeURIComponent(params.favoriteName);
    const fetchFavorite = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        await getFavorite({ oshi_name: decodedFavoriteName, email: userEmail });
      } else {
        console.log("email is not found");
      }
    };
    fetchFavorite();
  }, []);

  const getFavorite = async (data: { oshi_name: string; email: string }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/oshi/get-oshi-info`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oshi_name: data.oshi_name,
            email: data.email,
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setGetData(responseData);
      } else {
        console.error("Failed to fetch genres");
      }
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      setIsLoading(false); // データ取得後にローディングを終了
    }
  };

  // const styles: { [key: string]: CSSProperties } = {
  // container: {
  //     display: 'flex',
  //     flexDirection: 'column',
  //     fontFamily: "JPfont",
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     maxWidth: '600px',
  //     height: '100vh',
  //     color: '#4F4F4F',
  // },
  // // loading: {
  // //     fontSize: '2rem',
  // //     textAlign: 'center',
  // //     margin: '20px 0',
  // // },
  // title: {
  //     width: "80%",
  //     fontSize: '3rem',
  //     fontWeight: 'bold',
  //     textAlign: "left"
  // },
  // titleContainer: {
  //     width: "100%",
  //     display: 'flex',
  //     justifyContent: 'center',
  // },
  // genre: {
  //     width: "80%",
  //     fontSize: '1.25rem',
  //     textAlign: "left"
  // },
  // descriptionContainer: {
  //     display: 'flex',
  //     justifyContent: 'center',
  // },
  // description: {
  //     width: "80%",
  //     fontSize: '0.875rem',
  //     margin: '15px 0',
  //     textAlign: "left",
  // },
  // image: {
  //     maxWidth: '100%',
  //     borderRadius: '8px',
  //     maxHeight: '200px',
  // },
  // officialLinkLabel: {
  //     width: "80%",
  //     fontSize: '0.875rem',
  //     marginTop: '15px',
  //     textAlign: "left",
  // },
  // officialLink: {
  //     width: "80%",
  //     fontSize: '0.875rem',
  //     textDecoration: 'underline',
  //     textAlign: "left",
  // },
  // snsContainerLabel: {
  //     width: "80%",
  //     fontSize: '0.875rem',
  //     marginTop: '15px',
  //     textAlign: "left",
  // },
  // snsContainer: {
  //     width: "80%",
  //     display: 'flex',
  //     fontSize: '0.875rem',
  //     textAlign: "left",
  // },
  // snsButton: {
  //     width: '40px',
  //     height: '40px',
  //     borderRadius: '50%',
  //     marginRight: '10px',
  //     display: 'flex',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //     backgroundColor: '#fff',
  //     border: '1px solid #ccc',
  // },
  // };

  return (
    <div className={styles.container}>
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
          <div className={styles.loadingDonut}></div>{" "}
          {/* モジュールからクラスを使用 */}
          <p style={{ marginTop: "20px", fontFamily: "JPfont" }}>
            Loading... Please wait...
          </p>
        </div>
      ) : (
        <>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>{getData.oshi_name}</h1>
          </div>
          {getData.profession !== "職業が見つかりません" && (
            <div className={styles.titleContainer}>
              <h2 className={styles.genre}>{getData.profession}</h2>
            </div>
          )}
          <div style={{ display: "flex", width: "100%" }}>
            <img
              src={getData.image_url}
              alt={getData.oshi_name}
              className={styles.image}
              style={{ justifyContent: "center" }}
            />
          </div>
          {getData.summary !== "概要が見つかりません" && (
            <div className={styles.descriptionContainer}>
              <p className={styles.description}>{getData.summary}</p>
            </div>
          )}
          <div className={styles.titleContainer}>
            <p className={styles.officialLinkLabel}>officialサイト</p>
          </div>
          <div className={styles.titleContainer}>
            <a href={getData.official_site} className={styles.officialLink}>
              {getData.official_site}
            </a>
          </div>
          <div className={styles.titleContainer}>
            <p className={styles.officialLinkLabel}>SNSリンク</p>
          </div>
          <div className={styles.titleContainer}>
            <div className={styles.snsContainer}>
              {Object.entries(getData.sns_links).map(([name, url]) => (
                <a
                  key={name}
                  href={url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.snsButton}
                >
                  {name === "youtube" ? (
                    <Image
                      src={
                        "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
                      }
                      alt={name}
                      width={25}
                      height={25}
                      unoptimized
                    />
                  ) : name === "spotify" ? (
                    <Image
                      src={spotifyIcon}
                      alt={name}
                      width={25}
                      height={25}
                      unoptimized
                    />
                  ) : name === "x" ? (
                    <Image
                      src={xIcon}
                      alt={name}
                      width={25}
                      height={25}
                      unoptimized
                    />
                  ) : name === "instagram" ? (
                    <Image
                      src={
                        "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                      }
                      alt={name}
                      width={25}
                      height={25}
                      unoptimized
                    />
                  ) : null}
                </a>
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: "50px",
              alignItems: "center",
            }}
          >
            <Btn
              type={"button"}
              text={"一覧に戻る"}
              onClick={() => (window.location.href = "/home")}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Preview;
