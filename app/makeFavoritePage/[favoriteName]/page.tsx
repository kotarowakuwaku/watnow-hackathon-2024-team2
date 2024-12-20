"use client";

import xIcon from "../../images/x.png";
import spotifyIcon from "../../images/spotify.png";
import facebookIcon from "../../images/facebook.png";
import appleMusicIcon from "../../images/Apple_Music_icon.png";
import soundCloud from "../../images/soundCloud.png";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import penIcon from "../../images/pen.png";
import icon1 from "../../images/T.png"; // テキストアイコン
import icon2 from "../../images/Today.png"; // カレンダーアイコン
import icon3 from "../../images/Media.png"; // メディアアイコン
import icon4 from "../../images/shape.png"; // 形状アイコン
import icon5 from "../../images/music.png"; // 音楽アイコン
import icon6 from "../../images/link.png"; // リンクアイコン
import ReplyIcon from "@mui/icons-material/Reply";
import icon8 from "../../images/color.png"; // 色アイコン
import TextModal from "../../components/TextModal";
import MediaModal from "../../components/MediaModal";
import CalendarModal from "../../components/CalendarModal";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import SnsLinksModal from "@/app/components/SnsLinksModal";
import { supabase } from "@/app/utils/supabase/supabase";
import Button from "@/app/components/Button";
import { CSSProperties } from "react";
import styless from "./page.module.css";

interface ContentItem {
  type: "text" | "image" | "event" | "sns";
  text?: string;
  alignment?: string;
  fontSize?: number;
  src?: string;
  size?: number;
  snsLinks?: { name: string; url: string }[];
  title?: string;
  start?: string;
  end?: string;
  count?: number;
  order_index?: number;
}

interface submitItem {
  type: "text" | "image" | "event" | "sns";
  text?: string;
  alignment?: string;
  fontSize?: number;
  src?: string;
  size?: number;
  snsLinks?: { name: string; url: string }[];
  title?: string;
  start_date?: string;
  end_date?: string;
  count?: number;
  order_index?: number;
}

const buttonStyles: { [key: string]: (isOpen: boolean) => CSSProperties } = {
  button: (isOpen: boolean) => ({
    position: "fixed",
    bottom: isOpen ? "260px" : "60px",
    right: isOpen ? "6%" : "6%",
    width: "100px",
    height: "0px",
    borderRadius: "50%",
    fontSize: "56px",
    fontFamily: "JPFont",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "4px solid transparent",
    // background: 'linear-gradient(white, white), linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
    backgroundClip: "padding-box, border-box",
    padding: "5px",
    transition: "bottom 0.3s ease",
    zIndex: 13,
  }),
  tabContainer: (isOpen: boolean) => ({
    position: "fixed",
    width: "80%",
    bottom: "30px",
    right: "-30%",
    transform: "translateX(-50%)",
    backgroundColor: "#EBE0EF",
    borderRadius: "50px",
    padding: "40px",
    zIndex: 10,
    display: "grid",
    boxShadow: "0px 2px 5px rgba(186, 188, 211, 1)",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    opacity: isOpen ? 1 : 0,
    transition: "opacity 0.3s ease",
  }),
  alignmentButton: (isActive: boolean) => ({
    border: "none",
    position: "fixed",
    background: isActive ? "#FFF" : "transparent",
    color: isActive ? "#fff" : "black",
    cursor: "pointer",
  }),
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    position: "relative",
    height: "100vh",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
  },
  label: {
    marginTop: "8px",
    fontSize: "0.625rem",
  },
  snsContainer: {
    width: "80%",
    display: "flex",
    fontSize: "0.875rem",
    textAlign: "left",
  },
  overlay: {
    position: "fixed",
    bottom: "220px", // 画面下から30pxの位置
    left: "50%", // 横方向は中央
    transform: "translateX(-50%)", // 完全に中央に配置
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.7, // ホバーしていないときは色が薄い
    transition: "opacity 0.3s ease", // 透明度の変化をスムーズに
    zIndex: 10,
  },
  buttonContainer: {
    position: "relative",
    zIndex: 11, // ボタンが最前面に表示されるように
  },
  overlayHover: {
    opacity: 1, // ホバー時に色を濃くする
  },
};

const MakeFavoritePage = ({ params }: { params: { favoriteName: string } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [alignment, setAlignment] = useState<"left" | "center" | "right">(
    "left"
  );
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [insertedItems, setInsertedItems] = useState<ContentItem[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [imageSize, setImageSize] = useState(100);
  const [events, setEvents] = useState<
    { title: string; start: string; end: string }[]
  >([]); // State for calendar events

  const [snsLinks, setSnsLinks] = useState<
    { name: string; url: string | null }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const decodedFavoriteName = decodeURIComponent(params.favoriteName);
    const fetchFavorite = async () => {
      await getFavorite({ oshi_name: decodedFavoriteName });
    };
    fetchFavorite();
  }, []);

  const getFavorite = async (data: { oshi_name: string }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/oshi/fetch-oshi-info`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oshi_name: data.oshi_name,
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setSnsLinks((prevLinks) => [
          ...prevLinks,
          ...Object.entries(responseData.sns_links)
            .filter(
              ([name, url]) =>
                url !== null && !prevLinks.some((link) => link.name === name)
            )
            .map(([name, url]) => ({ name, url: url as string | null })),
        ]);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching genres:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleIconClick = (label: string) => {
    if (label === "元に戻す") {
      if (insertedItems[insertedItems.length - 1].type === "event") {
        if (events.length === 0) {
          setInsertedItems(insertedItems.slice(0, -1));
        } else {
          setEvents((prevEvents) => prevEvents.slice(0, -1));
        }
      } else {
        setInsertedItems(insertedItems.slice(0, -1));
      }
    } else {
      setActiveModal(label);
    }
  };

  const onSubmit = async (data: ContentItem[]) => {
    setIsLoading(true);
    const newSubmitData: submitItem[] = [];
    const imageUrl: { [key: number]: string }[] = [];

    for (const item of data) {
      if (item.type === "image") {
        const base64Data = item.src ? item.src.split(",")[1] : "";
        const blob = new Blob(
          [Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))],
          {
            type: "image/jpeg",
          }
        );

        const fileName = `uploads/${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("oshiNote_images")
          .upload(fileName, blob, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Error uploading file: ", uploadError.message);
          window.alert(uploadError.message);
          setIsLoading(false);
          return;
        }

        const { data: publicImageUrlData } = await supabase.storage
          .from("oshiNote_images")
          .getPublicUrl(fileName);

        imageUrl.push({ [data.indexOf(item)]: publicImageUrlData.publicUrl });
      }
    }
    data.forEach((item: ContentItem) => {
      if (item.type === "text") {
        newSubmitData.push({
          type: item.type,
          text: item.text,
          fontSize: item.fontSize,
          alignment: item.alignment,
          order_index: data.indexOf(item),
        });
      } else if (item.type === "image") {
        newSubmitData.push({
          type: item.type,
          src:
            imageUrl.find(
              (key) => Number(Object.keys(key)[0]) === data.indexOf(item)
            )?.[data.indexOf(item)] || undefined,
          size: item.size,
          order_index: data.indexOf(item),
        });
      } else if (item.type === "event") {
        newSubmitData.push({
          type: item.type,
          title: item.title,
          start_date: item.start,
          end_date: item.end,
          order_index: data.indexOf(item),
          count: item.count,
        });
      } else if (item.type === "sns") {
        newSubmitData.push({
          type: item.type,
          snsLinks: item.snsLinks,
          order_index: data.indexOf(item),
        });
      }
    });

    const decodedFavoriteName = decodeURIComponent(params.favoriteName);
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail && decodedFavoriteName && newSubmitData) {
      await submitFavorite({
        oshi_name: decodedFavoriteName,
        email: userEmail,
        content: newSubmitData,
      });
    } else {
      console.log("email is not found");
    }
  };

  const submitFavorite = async (data: {
    oshi_name: string;
    email: string;
    content: ContentItem[];
  }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/content/create-content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oshi_name: data.oshi_name,
            email: data.email,
            content: data.content,
          }),
        }
      );

      if (response.ok) {
        window.location.href = "/home";
      } else {
        console.error("Failed to fetch");
      }
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      setIsLoading(false); // データ取得後にローディングを終了
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setUploadedImage("");
  };

  const handleText = () => {
    const tempTextData: ContentItem = {
      type: "text",
      text: text,
      fontSize: fontSize,
      alignment: alignment,
    };
    setInsertedItems([...insertedItems, tempTextData]);
    setText("");
    setFontSize(16);
    setAlignment("left");
    closeModal();
  };

  const handleAddSnsLinks = (
    newSnsLinks: { name: string; url: string | null }[]
  ) => {
    if (newSnsLinks.length !== 0) {
      const snsData: ContentItem = {
        type: "sns",
        snsLinks: newSnsLinks.filter((link) => link.url !== null) as {
          name: string;
          url: string;
        }[],
      };
      setInsertedItems([...insertedItems, snsData]);
    }
    closeModal();
  };

  const handleComplete = () => {
    if (uploadedImage) {
      const tempImageData: ContentItem = {
        type: "image",
        src: uploadedImage,
        size: imageSize,
      };
      setInsertedItems([...insertedItems, tempImageData]);
    }
    closeModal();
  };

  const handleAddEvent = (newEvent: {
    title: string;
    start: string;
    end: string;
  }) => {
    const eventData: ContentItem = {
      type: "event",
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end,
      count: events.length,
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setInsertedItems([...insertedItems, eventData]); // eventsも挿入
    closeModal();
  };

  // if (isLoading) {
  //     return <div>Loading...</div>;
  // }

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
          <div className={styless.loadingDonut}></div>
          {""}
          <p style={{ marginTop: "20px", fontFamily: "JPFont" }}>
            Loading...Please wait...
          </p>
        </div>
      ) : (
        <>
          {insertedItems.map((item, index) => {
            if (item.type === "text") {
              return (
                <div
                  key={index}
                  style={{
                    textAlign: item.alignment as "left" | "center" | "right",
                    fontSize: item.fontSize ? `${item.fontSize}px` : undefined,
                  }}
                >
                  {item.text}
                </div>
              );
            } else if (item.type === "image") {
              return (
                <img
                  key={index}
                  src={item.src}
                  alt={`uploaded-${index}`}
                  style={{ width: `${item.size}%`, height: "auto" }}
                />
              );
            } else if (item.type === "event" && item.count === 0) {
              return (
                <div
                  key={index}
                  style={{
                    width: "90%",
                    height: "auto",
                    margin: "auto",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="dayGridMonth"
                    locales={[jaLocale]}
                    locale="ja"
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "",
                    }}
                    events={events} // Pass events to FullCalendar
                    height="400px"
                  />
                </div>
              );
            } else if (item.type === "sns") {
              return (
                <div key={index} style={styles.snsContainer}>
                  {item.snsLinks &&
                    item.snsLinks.map(
                      (snsLink: { name: string; url: string | null }) => (
                        <div key={snsLink.name}>
                          <a
                            href={snsLink.url || undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src={
                                snsLink.name === "youtube"
                                  ? "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
                                  : snsLink.name === "spotify"
                                  ? spotifyIcon
                                  : snsLink.name === "x"
                                  ? xIcon
                                  : snsLink.name === "instagram"
                                  ? "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                                  : snsLink.name === "facebook"
                                  ? facebookIcon
                                  : snsLink.name === "soundcloud"
                                  ? soundCloud
                                  : snsLink.name === "applemusic"
                                  ? appleMusicIcon
                                  : ""
                              }
                              alt={snsLink.name}
                              width={30}
                              height={30}
                            />
                          </a>
                        </div>
                      )
                    )}
                </div>
              );
            }
            return null;
          })}
          <button onClick={handleToggle} style={buttonStyles.button(isOpen)}>
            <Image src={penIcon} alt="pen" />
          </button>

          {isOpen && (
            <div style={buttonStyles.tabContainer(isOpen)}>
              {[
                { src: icon1, label: "テキスト" },
                { src: icon2, label: "カレンダー" },
                { src: icon3, label: "メディア" },
                { src: icon4, label: "形状" },
                { src: icon5, label: "音楽" },
                { src: icon6, label: "リンク" },
                { label: "元に戻す", icon: <ReplyIcon /> },
                { src: icon8, label: "" },
              ].map((icon, index) => (
                <div
                  key={index}
                  style={styles.iconContainer}
                  onClick={() => handleIconClick(icon.label)}
                >
                  {icon.icon ? (
                    icon.icon
                  ) : (
                    <Image
                      src={icon.src}
                      alt={`icon${index + 1}`}
                      width={30}
                      height={30}
                    />
                  )}
                  <span style={styles.label}>{icon.label}</span>
                </div>
              ))}
              <div style={styles.overlay}>
                <Button
                  type="submit"
                  text="推しノート完成!"
                  onClick={() => onSubmit(insertedItems)}
                />
              </div>
            </div>
          )}

          {/* テキストモーダル */}
          {activeModal === "テキスト" && (
            <TextModal
              text={text}
              setText={setText}
              fontSize={fontSize}
              setFontSize={setFontSize}
              alignment={alignment}
              setAlignment={setAlignment}
              closeModal={closeModal}
              handleText={handleText}
            />
          )}

          {/* カレンダーモーダル */}
          {activeModal === "カレンダー" && (
            <CalendarModal closeModal={closeModal} setEvents={handleAddEvent} />
          )}

          {/* メディアモーダル */}
          {activeModal === "メディア" && (
            <MediaModal
              uploadedImage={uploadedImage}
              setUploadedImage={setUploadedImage}
              imageSize={imageSize}
              setImageSize={setImageSize}
              closeModal={closeModal}
              handleComplete={handleComplete}
            />
          )}

          {activeModal === "リンク" && (
            <SnsLinksModal
              snsLinks={
                snsLinks.filter((link) => link.url !== null) as {
                  name: string;
                  url: string;
                }[]
              }
              setSnsLinks={handleAddSnsLinks}
              closeModal={closeModal}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MakeFavoritePage;
