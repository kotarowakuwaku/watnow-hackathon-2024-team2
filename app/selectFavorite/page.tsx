"use client";

import React, { useEffect, useState } from 'react';
import SearchBar from "../components/SearchBar";
import Link from "next/link";

const SelectFavorite = () => {
    const [inputText, setInputText] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [genles, setGenles] = useState<string[]>([]);
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputText(value);

        // Clear previous timeout if it exists
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        // Set a new timeout for the debounce
        const newTimeout = setTimeout(async () => {
            if (value) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/oshi/search-oshi`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ query: value }),
                    });

                    if (response.ok) {
                        const suggestionsData = await response.json();
                        setSuggestions(suggestionsData.titles);
                    } else {
                        console.error('Failed to fetch suggestions');
                        setSuggestions([]);
                    }
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                    setSuggestions([]);
                }
            } else {
                setSuggestions([]);
            }
        }, 600); // 300ms debounce delay

        setDebounceTimeout(newTimeout);
    };

    useEffect(() => {
        const fetchGenres = async () => {
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail) {
                await getGenles({ email: userEmail });
            }
        };
        fetchGenres();
    }, []);

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
                setGenles(responseData);
            } else {
                console.error('Failed to fetch genres');
                setGenles([]);
            }
        } catch (error) {
            console.error('Error fetching genres:', error);
            setGenles([]);
        }
    };
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        <h2 style={{ fontFamily: "JPFont", fontSize: "20px" }}>
          あなたの好きなアーティストや
        </h2>
        <h2 style={{ fontFamily: "JPFont", fontSize: "20px" }}>
          推しを教えてください
        </h2>
      </div>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "328px",
          margin: "32px 0 100px 0",
        }}
      >
        <SearchBar value={inputText} onChange={handleChange} />
        {suggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "0",
              right: "0",
              border: "1px solid #ccc",
              borderRadius: "5px",
              backgroundColor: "#fff",
              zIndex: 1,
            }}
          >
            <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  style={{
                    width: "328px",
                    padding: "10px",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f0f0f0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <Link href={`/preview/${suggestion}`}>{suggestion}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "10px",
          margin: "0",
        }}
      >
        {genles.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "JPFont",
              backgroundColor: "white",
              color: "black",
              position: "relative",
              display: "flex",
              margin: "5px",
              alignItems: "center",
              justifyContent: "center",
              width: "150px",
              height: "40px",
              borderRadius: "20px", // 角丸
            }}
          >
            {tag}
            <span
              style={{
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
                transition: "opacity 0.6s ease", // opacityに対して遷移を適用
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", // 背景色がボーダーになるようにする
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
              }}
            ></span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SelectFavorite;
