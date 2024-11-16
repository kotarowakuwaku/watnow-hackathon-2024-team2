"use client";

import React, { useEffect, useState } from 'react';
import xIcon from "../../images/x.png"; // Ensure this path is correct
import spotifyIcon from "../../images/spotify.png"; // Ensure this path is correct
import Image from 'next/image';
import facebookIcon from "../../images/facebook.png";
import appleMusicIcon from "../../images/Apple_Music_icon.png";
import soundCloud from "../../images/soundCloud.png";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import Button from '@/app/components/Button';

const Preview = ({ params }: { params: { favoriteName: string } }) => {
    interface ContentItem {
        type: 'text' | 'image' | 'event' | 'sns';
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
    }
    
    const [getData, setGetData] = useState<ContentItem[]>([]);
    const [isLoading, setIsLoading] = useState(true); // ローディングステート
    const [events, setEvents] = useState<{ title: string; start: string; end: string }[]>([]);

    useEffect(() => {
        setIsLoading(true); // データ取得前にローディングを開始
        const decodedFavoriteName = decodeURIComponent(params.favoriteName);
        const fetchFavorite = async () => {
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail) {
                await getFavorite({ oshi_name: decodedFavoriteName, email: userEmail });
            } else {
                console.log("email is not found");
            }
        };
        fetchFavorite();
    }, []);

    const getFavorite = async (data:
        {
            oshi_name: string;
            email: string;
        }
    ) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content/fetch-content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oshi_name: data.oshi_name,
                    email: data.email
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                // order_index に基づいて並べ替え
                const sortedContent = responseData.content.sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index);
                setGetData(sortedContent); // 並び替えたデータをセット
                responseData.content.map((item: { type: string; title: string; start_date: string; end_date: string }) => {
                    if (item.type === 'event') {
                        setEvents((prevEvents) => {
                            if (!prevEvents.some(event => event.title === item.title)) {
                                return [...prevEvents, { title: item.title, start: item.start_date, end: item.end_date }];
                            }
                            return prevEvents;
                        });
                    }
                });
            }else {
                console.error('Failed to fetch genres');
            }
        } catch (error) {
            console.error('Error fetching genres:', error);
        } finally {
            setIsLoading(false); // データ取得後にローディングを終了
        }
    };

    const styles = {
        container: {
            position: 'relative',
            height: "100vh",
        },
        button: (isOpen: boolean) => ({
            position: 'absolute',
            bottom: isOpen ? '210px' : '20px',
            right: '20px',
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            fontSize: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '4px solid transparent',
            background: 'linear-gradient(white, white), linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
            backgroundClip: 'padding-box, border-box',
            padding: '5px',
            transition: 'bottom 0.3s ease',
            zIndex: 13,
        }),
        tabContainer: (isOpen: boolean) => ({
            position: 'absolute',
            width: "80%",
            bottom: '30px',
            right: '-30%',
            transform: 'translateX(-50%)',
            backgroundColor: '#D9D9D9',
            borderRadius: '50px',
            padding: '40px',
            zIndex: 10,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.3s ease',
        }),
        iconContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
        },
        label: {
            marginTop: '8px',
            fontSize: "0.625rem",
        },
        alignmentButton: (isActive: boolean) => ({
            border: 'none',
            background: isActive ? '#969696' : 'transparent',
            color: isActive ? '#fff' : 'black',
            cursor: 'pointer',
        }),
        snsContainer: {
            width: "80%",
            display: 'flex',
            fontSize: '0.875rem',
            textAlign: "left",
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.container as React.CSSProperties}>
            {getData.map((item, index) => {
                if (item.type === 'text') {
                    return (
                        <div key={index} style={{ textAlign: item.alignment as React.CSSProperties['textAlign'], fontSize: item.fontSize ? `${item.fontSize}px` : undefined }}>
                            {item.text}
                        </div>
                    );
                } else if (item.type === 'image') {
                    return (
                        <img key={index} src={item.src} alt={`uploaded-${index}`} style={{ width: `${item.size}%`, height: 'auto' }} />
                    );
                } else if (item.type === 'event' && item.count === 0) {
                    return (
                        <div key={index} style={{
                            width: '90%',
                            height: 'auto',
                            margin: 'auto',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            padding: '10px',
                            marginBottom: '10px',
                        }}>
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin]}
                                initialView="dayGridMonth"
                                locales={[jaLocale]}
                                locale='ja'
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: '',
                                }}
                                events={events} // Pass events to FullCalendar
                                height='400px'
                            />
                        </div>
                    );
                } else if (item.type === 'sns') {
                    return (
                        <div key={index} style={styles.snsContainer as React.CSSProperties}>
                            {item.snsLinks && item.snsLinks.map((snsLink) => (
                                <div key={snsLink.name}>
                                    <a href={snsLink.url} target="_blank" rel="noopener noreferrer">
                                        <Image
                                            src={
                                                snsLink.name === "youtube" ? "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png" :
                                                    snsLink.name === "spotify" ? spotifyIcon :
                                                        snsLink.name === "x" ? xIcon :
                                                            snsLink.name === "instagram" ? "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" :
                                                                snsLink.name === "facebook" ? facebookIcon :
                                                                    snsLink.name === "soundcloud" ? soundCloud :
                                                                        snsLink.name === "applemusic" ? appleMusicIcon :
                                                                            ""
                                            }
                                            alt={snsLink.name}
                                            width={30}
                                            height={30}
                                        />
                                    </a>
                                </div>
                            ))}
                        </div>
                    );
                }
                return null;
            })}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
            }}>
            <Button type='button' text='推し一覧ページに戻る' onClick={() => { window.location.href = "/home"; }}/>
            </div>
        </div>
    );
};

export default Preview;
