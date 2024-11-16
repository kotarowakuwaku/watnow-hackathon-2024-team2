'use client';

import xIcon from "../../images/x.png";
import spotifyIcon from "../../images/spotify.png";
import facebookIcon from "../../images/facebook.png";
import appleMusicIcon from "../../images/Apple_Music_icon.png";
import soundCloud from "../../images/soundcloud.png";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import penIcon from '../../images/pen.png';
import icon1 from '../../images/T.png'; // テキストアイコン
import icon2 from '../../images/Today.png'; // カレンダーアイコン
import icon3 from '../../images/Media.png'; // メディアアイコン
import icon4 from '../../images/shape.png'; // 形状アイコン
import icon5 from '../../images/music.png'; // 音楽アイコン
import icon6 from '../../images/link.png'; // リンクアイコン
import ReplyIcon from '@mui/icons-material/Reply';
import icon8 from '../../images/color.png'; // 色アイコン
import TextModal from '../../components/TextModal';
import MediaModal from '../../components/MediaModal';
import CalendarModal from '../../components/CalendarModal';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import SnsLinksModal from "@/app/components/SnsLinksModal";
import { supabase } from "@/app/utils/supabase/supabase";

export const styles = {
    container: {
        position: 'relative',
        height: "100vh",
    },
    button: (isOpen) => ({
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
    tabContainer: (isOpen) => ({
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
    alignmentButton: (isActive) => ({
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

const MakeFavoritePage = ({ params }: { params: { favoriteName: string } }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState('');
    const [fontSize, setFontSize] = useState(16);
    const [alignment, setAlignment] = useState('left');
    const [activeModal, setActiveModal] = useState(null);
    const [insertedItems, setInsertedItems] = useState([]);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageSize, setImageSize] = useState(100);
    const [events, setEvents] = useState([]); // State for calendar events

    const [snsLinks, setSnsLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
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
                setSnsLinks((prevLinks) => [
                    ...prevLinks,
                    ...Object.entries(responseData.sns_links)
                        .filter(([name, url]) => url !== null && !prevLinks.some((link) => link.name === name))
                        .map(([name, url]) => ({ name, url }))
                ]);
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching genres:', error);
            setIsLoading(false);
        } finally {
            setIsLoading(false); 
        }
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleIconClick = (label) => {
        if (label === '元に戻す') {
            if (insertedItems[insertedItems.length - 1].type === 'event') {
                if (events.length === 0) {
                    setInsertedItems(insertedItems.slice(0, -1));
                } else {
                    setEvents((prevEvents) => prevEvents.slice(0, -1));
                }
            } else {
                setInsertedItems(insertedItems.slice(0, -1));
            }

        } else if (label === '') {
            onSubmit(insertedItems);
        }
        else {
            setActiveModal(label);
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        const newSubmitData = [];
        const imageUrl = [];

        for (const item of data) {
            if (item.type === 'image') {
                const base64Data = item.src.split(',')[1];
                const blob = new Blob([Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))], {
                    type: 'image/jpeg',
                });

                const fileName = `uploads/${Date.now()}.jpg`;
                const { error: uploadError } = await supabase.storage
                    .from('oshiNote_images')
                    .upload(fileName, blob, {
                        cacheControl: '3600',
                        upsert: false,
                    });

                if (uploadError) {
                    console.error('Error uploading file: ', uploadError.message);
                    window.alert(uploadError.message);
                    setIsLoading(false);
                    return;
                }

                const { data: publicImageUrlData } = await supabase.storage
                    .from('oshiNote_images')
                    .getPublicUrl(fileName);

                imageUrl.push({ [data.indexOf(item)]: publicImageUrlData.publicUrl });
            }
        }
        data.forEach((item: any) => {
            if (item.type === 'text') {
                newSubmitData.push({
                    type: item.type,
                    text: item.text,
                    fontSize: item.fontSize,
                    alignment: item.alignment,
                    order_index: data.indexOf(item),
                });
            } else if (item.type === 'image') {
                newSubmitData.push({
                    type: item.type,
                    src: imageUrl.find((key) => Object.keys(key)[0] == data.indexOf(item))?.[data.indexOf(item)] || null,
                    size: item.size,
                    order_index: data.indexOf(item),
                });
            } else if (item.type === 'event') {
                newSubmitData.push({
                    type: item.type,
                    title: item.title,
                    start_date: item.start,
                    end_date: item.end,
                    order_index: data.indexOf(item),
                });
            } else if (item.type === 'sns') {
                newSubmitData.push({
                    type: item.type,
                    snsLinks: item.snsLinks,
                    order_index: data.indexOf(item),
                });
            }
        });

        const decodedFavoriteName = decodeURIComponent(params.favoriteName);
        const userEmail = localStorage.getItem('userEmail');
        console.log(newSubmitData);
        if (userEmail && decodedFavoriteName && newSubmitData) {
            await submitFavorite({ oshi_name: decodedFavoriteName, email: userEmail, content: newSubmitData });
        } else {
            console.log("email is not found");
        }
    }

    const submitFavorite = async (data:
        {
            oshi_name: string;
            email: string;
            content: string[];
        }
    ) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content/create-content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oshi_name: data.oshi_name,
                    email: data.email,
                    content: data.content,
                }),
            });

            if (response.ok) {
                window.location.href = "/home";
            } else {
                console.error('Failed to fetch');
            }
        } catch (error) {
            console.error('Error fetching genres:', error);
        } finally {
            setIsLoading(false); // データ取得後にローディングを終了
        }
    };

    const closeModal = () => {
        setActiveModal(null);
        setUploadedImage(null);
        console.log(events);
    };

    const handleText = () => {
        const tempTextData = {
            type: 'text',
            text: text,
            fontSize: fontSize,
            alignment: alignment,
        };
        setInsertedItems([...insertedItems, tempTextData]);
        setText('');
        setFontSize(16);
        setAlignment('left');
        closeModal();
    };

    const handleAddSnsLinks = (newSnsLinks) => {
        if (newSnsLinks.length !== 0) {
            const snsData = {
                type: 'sns',
                snsLinks: newSnsLinks,
            };
            setInsertedItems([...insertedItems, snsData]);
        }
        closeModal();
    }

    const handleComplete = () => {
        if (uploadedImage) {
            const tempImageData = {
                type: 'image',
                src: uploadedImage,
                size: imageSize,
            };
            setInsertedItems([...insertedItems, tempImageData]);
        }
        closeModal();
    };


    const handleAddEvent = (newEvent) => {
        const eventData = {
            type: 'event',
            title: newEvent.title,
            start: newEvent.start,
            end: newEvent.end,
        };
        if (insertedItems.some((item) => item.type !== 'event') || insertedItems.length === 0) {
            setEvents((prevEvents) => [...prevEvents, newEvent]);
            setInsertedItems([...insertedItems, eventData]); // eventsも挿入
        } else {
            setEvents((prevEvents) => [...prevEvents, newEvent]);
        }
        closeModal();
    };


    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            {insertedItems.map((item, index) => {
                if (item.type === 'text') {
                    return (
                        <div key={index} style={{ textAlign: item.alignment, fontSize: item.fontSize ? `${item.fontSize}px` : undefined }}>
                            {item.text}
                        </div>
                    );
                } else if (item.type === 'image') {
                    return (
                        <img key={index} src={item.src} alt={`uploaded-${index}`} style={{ width: `${item.size}%`, height: 'auto' }} />
                    );
                } else if (item.type === 'event') {
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
                        <div key={index} style={styles.snsContainer}>
                            {item.snsLinks.map((snsLink) => (
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

            <button onClick={handleToggle} style={styles.button(isOpen)}>
                <Image src={penIcon} alt="pen" />
            </button>

            {isOpen && (
                <div style={styles.tabContainer(isOpen)}>
                    {[
                        { src: icon1, label: 'テキスト' },
                        { src: icon2, label: 'カレンダー' },
                        { src: icon3, label: 'メディア' },
                        { src: icon4, label: '形状' },
                        { src: icon5, label: '音楽' },
                        { src: icon6, label: 'リンク' },
                        { label: '元に戻す', icon: <ReplyIcon /> },
                        { src: icon8, label: '' },
                    ].map((icon, index) => (
                        <div key={index} style={styles.iconContainer} onClick={() => handleIconClick(icon.label)}>
                            {icon.icon ? icon.icon : <Image src={icon.src} alt={`icon${index + 1}`} width={30} height={30} />}
                            <span style={styles.label}>{icon.label}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* テキストモーダル */}
            {activeModal === 'テキスト' && (
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
            {activeModal === 'カレンダー' && (
                <CalendarModal
                    closeModal={closeModal}
                    setEvents={handleAddEvent}
                />
            )}

            {/* メディアモーダル */}
            {activeModal === 'メディア' && (
                <MediaModal
                    uploadedImage={uploadedImage}
                    setUploadedImage={setUploadedImage}
                    imageSize={imageSize}
                    setImageSize={setImageSize}
                    closeModal={closeModal}
                    handleComplete={handleComplete}
                />
            )}

            {activeModal === 'リンク' && (
                <SnsLinksModal
                    snsLinks={snsLinks}
                    setSnsLinks={handleAddSnsLinks}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

export default MakeFavoritePage;