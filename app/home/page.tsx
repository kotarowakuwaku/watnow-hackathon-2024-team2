"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Link from "next/link";

const Home = () => {
  const [groupedData, setGroupedData] = useState<{ [key: string]: 
    {
      oshi_name: string;
      image_url: string;
      genre: string;
    }[]
   }>({});
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchGenres = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        await getFavorites({ email: userEmail });
      } else {
        setLoading(false); // No user email, stop loading
      }
    };
    fetchGenres();
  }, []);

  const getFavorites = async (data:
    {
      email: string;
    }
  ) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/oshi/get-user-oshi-genres`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const oshiArray = responseData.oshi;

        const grouped = oshiArray.reduce((acc: { [key: string]: 
          {
            oshi_name: string;
            image_url: string;
            genre: string;
          }[]
         }, item: { oshi_name: string; image_url: string; genre: string }) => {
          if (!acc[item.genre]) {
            acc[item.genre] = [];
          }
          acc[item.genre].push(item);
          return acc;
        }, {});

        setGroupedData(grouped);
      } else {
        console.error('Failed to fetch genres');
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {loading ? (
        <div style={{
          display: 'flex',
          fontSize: '2rem',
            textAlign: 'center',
            margin: '20px 0',
            height:"100vh",
            alignItems:"center",
            justifyContent:"center",
        }}>Loading...</div>
      ) : (
        <>
          <Header />
          <div style={{ backgroundColor: "#F5F5F5", height: "calc(100vh - 90px)", overflowY: "auto" }}>
            {Object.keys(groupedData).map((tag) => (
              <div key={tag} style={{ fontFamily: 'JPFont', margin: "30px 33px" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{tag}</h2>
                {groupedData[tag].map((data) => (
                  <Link key={data.oshi_name} href={`/favoriteNote/${data.oshi_name}`}>
                    <div
                      style={{
                        height: '100px',
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: 'center',
                          width: "100px",
                          height: "150px",
                        }}
                      >
                        <img
                          src={data.image_url}
                          alt={data.oshi_name}
                          style={{
                            maxWidth: '100%',
                            borderRadius: '50%',
                            width: '70px',
                            height: '70px',
                            objectFit: 'cover', // 画像を切り取って表示する
                          }}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
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
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
            <button
              style={{
                position: "absolute",
                bottom: "20px",
                width: "76px",
                height: "76px",
                borderRadius: "50%",
                background: "conic-gradient(#EAC46A, #D5FCD5, #6C97EC, #0731FB, #7634DB, #FF44AA, #FF6E49, #FF8E03, #EAC463)",
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
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              +
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
