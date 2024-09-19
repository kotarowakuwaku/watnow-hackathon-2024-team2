'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import penIcon from '../images/pen.png';
import icon1 from '../images/T.png'; // テキストアイコン
import icon2 from '../images/Today.png'; // カレンダーアイコン
import icon3 from '../images/Media.png'; // メディアアイコン
import icon4 from '../images/shape.png'; // 形状アイコン
import icon5 from '../images/music.png'; // 音楽アイコン
import icon6 from '../images/link.png'; // リンクアイコン
import ReplyIcon from '@mui/icons-material/Reply';
import icon8 from '../images/color.png'; // 色アイコン
import right from '../images/rightSort.png'; // 右矢印アイコン
import left from '../images/leftSort.png'; // 左矢印アイコン
import center from '../images/centerSort.png'; // 中央矢印アイコン


const styles = {
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
        opacity: isOpen ? 1 : 0, // 透明度を変更
        transition: 'opacity 0.3s ease', // トランジションを追加
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
    modal: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        padding: '20px',
        zIndex: 20,
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
    },
    slider: {
        width: '100%',
        marginBottom: '10px',
    },
    preview: {
        marginTop: '20px',
        padding: '10px',
        border: '1px solid #ccc',
    },
    alignmentButton: (isActive) => ({
        border: 'none',
        background: isActive ? '#969696' : 'transparent',
        color: isActive ? '#fff' : 'black',
        cursor: 'pointer',
    }),
};

const MakeFavoritePage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState('');
    const [fontSize, setFontSize] = useState(16);
    const [alignment, setAlignment] = useState('left');
    const [activeModal, setActiveModal] = useState(null);
    const [insertedText, setInsertedText] = useState([]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleIconClick = (label) => {
        if (label === 'ペン') {
            setInsertedText(insertedText.slice(0, -1));
        } else {
            setActiveModal(label);
        }
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    const handleText = () => {
        const tempTextData = {
            text: text,
            fontSize: fontSize,
            alignment: alignment,
        };
        setInsertedText([...insertedText, tempTextData]);
        setText('');
        setFontSize(16);
        setAlignment('left');
    };

    return (
        <div style={styles.container}>
            {insertedText.map((textData, index) => (
                <div key={index} style={{ fontSize: `${textData.fontSize}px`, textAlign: textData.alignment }}>
                    {textData.text}
                </div>
            ))}
            <button
                onClick={handleToggle}
                style={styles.button(isOpen)}
            >
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

            {/* モーダル */}
            {activeModal === 'テキスト' && (
                <div style={styles.modal}>
                    <input
                        type="text"
                        style={{ ...styles.input, fontSize: `${fontSize}px` }}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="テキストを入力"
                    />
                    <input
                        type="range"
                        style={styles.slider}
                        min="10"
                        max="50"
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '10px', border: '1px solid #ccc', padding: '5px', borderRadius: '5px', justifyContent: "space-between" }}>
                        <button onClick={() => setAlignment('left')} style={styles.alignmentButton(alignment === 'left')}>
                            <Image src={left} alt={"leftSort"} width={30} height={30} />
                        </button>
                        <button onClick={() => setAlignment('center')} style={styles.alignmentButton(alignment === 'center')}>
                            <Image src={center} alt={"centerSort"} width={30} height={30} />
                        </button>
                        <button onClick={() => setAlignment('right')} style={styles.alignmentButton(alignment === 'right')}>
                            <Image src={right} alt={"rightSort"} width={30} height={30} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <button onClick={closeModal} style={{ marginRight: 'auto' }}>閉じる</button>
                        <button onClick={handleText} style={{ marginLeft: 'auto' }}>決定</button>
                    </div>
                </div>
            )}

            {activeModal === 'メディア' && (
                <div style={styles.modal}>
                    <h3>カレンダー機能</h3>
                    <button onClick={closeModal}>閉じる</button>
                </div>
            )}
        </div>
    );
};

export default MakeFavoritePage;
