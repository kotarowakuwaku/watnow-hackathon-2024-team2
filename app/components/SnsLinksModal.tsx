import React, { useState } from 'react';
import xIcon from "../images/x.png";
import spotifyIcon from "../images/spotify.png";
import facebookIcon from "../images/facebook.png";
import appleMusicIcon from "../images/Apple_Music_icon.png";
import soundCloud from "../images/soundCloud.png";
import { CSSProperties } from 'react';
import Image from 'next/image';

type SnsLinksModalProps = {
    snsLinks: {
        name: string;
        url: string;
    }[];
    setSnsLinks: (checkedLinks: { name: string; url: string }[]) => void;
    closeModal: () => void;
};

const styles: { [key: string]: CSSProperties } = {
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
    const [checkedLinks, setCheckedLinks] = useState<string[]>([]);
    const [selectedSns, setSelectedSns] = useState<{ name: string; url: string }[]>([]);

    const handleCheckboxChange = (name: string, url:string) => {
        setCheckedLinks(prevSelected => {
            if (prevSelected.includes(name)) {
                return prevSelected.filter(link => link !== name);
            } else {
                return [...prevSelected, name];
            }
        });
        setSelectedSns(prevSelected => {
            const existingIndex = prevSelected.findIndex(link => link.name === name);
            if (existingIndex !== -1) {
                return prevSelected.filter(link => link.name !== name);
            } else {
                return [...prevSelected, { name, url }];
            }
        });
        
    };

    const handleConfirm = () => {
        setSnsLinks(selectedSns);
        closeModal();
    };

    return (
        <div style={styles.modal}>
            <div style={styles.container}>
                <div style={styles.snsContainer}>
                    {snsLinks.map((sns) => (
                        <label key={sns.name} style={styles.label}>
                            <input
                                type="checkbox"
                                name="snsLink"
                                checked={checkedLinks.includes(sns.name)}
                                onChange={() => handleCheckboxChange(sns.name, sns.url)}
                                style={{ display: 'none' }} // チェックボックスを非表示に
                            />
                            <Image
                                src={
                                    sns.name === "youtube" ? "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png" :
                                    sns.name === "spotify" ? spotifyIcon :
                                    sns.name === "x" ? xIcon :
                                    sns.name === "instagram" ? "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" :
                                    sns.name === "facebook" ? facebookIcon :    
                                    sns.name === "soundcloud" ? soundCloud :
                                    sns.name === "applemusic" ? appleMusicIcon :
                                    ""
                                }
                                alt={sns.name}
                                width={25}
                                height={25}
                                style={{
                                    ...styles.icon,
                                    ...(checkedLinks.includes(sns.name) ? styles.iconSelected : {}),
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
