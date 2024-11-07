import React, { useState } from 'react';
import xIcon from "../images/x.png";
import spotifyIcon from "../images/spotify.png";
import facebookIcon from "../images/facebook.png";
import appleMusicIcon from "../images/Apple_Music_icon.png";
import soundCloud from "../images/soundcloud.png";

import Image from 'next/image';

type SnsLinksModalProps = {
    snsLinks: {
        applemusic?: string;
        facebook?: string;
        instagram?: string;
        soundcloud?: string;
        spotify?: string;
        x?: string;
        youtube?: string;
    };
    setSnsLinks: (selectedLinks: string[]) => void;
    closeModal: () => void;
};

const styles = {
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
        width: '300px',
    },
    snsContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        fontSize: '0.875rem',
        textAlign: 'left',
        flexWrap: 'wrap',
    },
    container: {
        position: 'relative',
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
    },
    icon: {
        opacity: 0.2, // 半透明のデフォルト
        transition: 'opacity 0.3s',
    },
    iconSelected: {
        opacity: 1, // 選択されている場合
    },
};

const SnsLinksModal = ({ snsLinks, setSnsLinks, closeModal }: SnsLinksModalProps) => {
    const [selectedLinks, setSelectedLinks] = useState<string[]>([]);

    const handleCheckboxChange = (name: string) => {
        setSelectedLinks(prevSelected => {
            if (prevSelected.includes(name)) {
                return prevSelected.filter(link => link !== name);
            } else {
                return [...prevSelected, name];
            }
        });
    };

    const handleConfirm = () => {
        console.log('決定ボタンがクリックされました');
        setSnsLinks(selectedLinks);
        closeModal();
    };

    return (
        <div style={styles.modal}>
            <div style={styles.container}>
                <div style={styles.snsContainer}>
                    {Object.entries(snsLinks).map(([name, url]) => (
                        <label key={name} style={styles.label}>
                            <input
                                type="checkbox"
                                name="snsLink"
                                value={url}
                                checked={selectedLinks.includes(name)}
                                onChange={() => handleCheckboxChange(name)}
                                style={{ display: 'none' }} // チェックボックスを非表示に
                            />
                            <Image
                                src={
                                    name === "youtube" ? "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png" :
                                    name === "spotify" ? spotifyIcon :
                                    name === "x" ? xIcon :
                                    name === "instagram" ? "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" :
                                    name === "facebook" ? facebookIcon :    
                                    name === "soundcloud" ? soundCloud :
                                    name === "applemusic" ? appleMusicIcon :
                                    ""
                                }
                                alt={name}
                                width={25}
                                height={25}
                                style={{
                                    ...styles.icon,
                                    ...(selectedLinks.includes(name) ? styles.iconSelected : {}),
                                }}
                            />
                        </label>
                    ))}
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button onClick={closeModal} style={{ marginRight: 'auto' }}>閉じる</button>
                <button onClick={handleConfirm} style={{ marginLeft: 'auto' }}>決定</button>
            </div>
        </div>
    );
};

export default SnsLinksModal;
