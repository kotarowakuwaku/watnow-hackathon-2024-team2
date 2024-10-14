"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Link from "next/link";
import Toggle from "../components/Toggle";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import add from "../images/追加するぼたん.png";
import Image from "next/image";

const Home = () => {
  const [groupedData, setGroupedData] = useState<{
    [key: string]: {
      oshi_name: string;
      image_url: string;
      genre: string;
    }[];
  }>({});
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchGenres = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        await getFavorites({ email: userEmail });
      } else {
        setLoading(false); // No user email, stop loading
      }
    };
    fetchGenres();
  }, []);

  const getFavorites = async (data: { email: string }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/get-user-oshi-genres`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const oshiArray = responseData.oshi;

        const grouped = oshiArray.reduce(
          (
            acc: {
              [key: string]: {
                oshi_name: string;
                image_url: string;
                genre: string;
              }[];
            },
            item: { oshi_name: string; image_url: string; genre: string }
          ) => {
            if (!acc[item.genre]) {
              acc[item.genre] = [];
            }
            acc[item.genre].push(item);
            return acc;
          },
          {}
        );

        setGroupedData(grouped);
      } else {
        console.error("Failed to fetch genres");
      }
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {loading ? (
        <div
          style={{
            display: "flex",
            fontSize: "2rem",
            textAlign: "center",
            margin: "20px 0",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Loading...
        </div>
      ) : (
        <>
          <Header />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Toggle />
          </div>
          <Typography
            variant="h6"
            color="inherit"
            component="div"
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: "20px",
              backgroundColor: "#EBF2F1",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M3 10h11v2H3zm0-2h11V6H3zm0 8h7v-2H3zm15.01-3.13l.71-.71a.996.996 0 0 1 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71zm-.71.71l-5.3 5.3V21h2.12l5.3-5.3z"
              />
            </svg>
            {/* <span style={{ marginLeft: "2px" }}>編集</span>{" "} */}
            {/* Optional text beside the icon */}
          </Typography>
          <div
            style={{
              backgroundColor: "#EBF2F1",
              height: "calc(100vh - 100px)",
              overflowY: "auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {Object.keys(groupedData).map((tag) => (
              <div
                key={tag}
                style={{ fontFamily: "JPFont", margin: "30px 33px" }}
              >
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  {tag}
                </h2>
                {groupedData[tag].map((data) => (
                  <Link
                    key={data.oshi_name}
                    href={`/favoriteNote/${data.oshi_name}`}
                  >
                    <div
                      style={{
                        height: "100px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100px",
                          height: "150px",
                        }}
                      >
                        <img
                          src={data.image_url}
                          alt={data.oshi_name}
                          style={{
                            maxWidth: "100%",
                            borderRadius: "50%",
                            width: "70px",
                            height: "70px",
                            objectFit: "cover", // 画像を切り取って表示する
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            margin: "4px 20px",
                          }}
                        >
                          {data.oshi_name}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          {/* </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end"
            }}
          > */}
            {/* <button
              style={{
                position: "absolute",
                bottom: "20px",
                width: "76px",
                height: "76px",
                borderRadius: "50%",
                background:
                  "conic-gradient(#EAC46A, #D5FCD5, #6C97EC, #0731FB, #7634DB, #FF44AA, #FF6E49, #FF8E03, #EAC463)",
                fontSize: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "transparent",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                transition: "transform 0.2s",
              }}
              onClick={() => (window.location.href = "/selectFavorite")}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              +
            </button> */}
            <Image src={add} alt="add" style={{ width: "90%", height: "120px", alignSelf:"flex-end", marginBottom:"30px"}} />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
