import React from 'react';

type MediaModalProps = {
    uploadedImage: string;
    setUploadedImage: (uploadedImage: string) => void;
    imageSize: number;
    setImageSize: (imageSize: number) => void;
    closeModal: () => void;
    handleComplete: () => void;
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
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
    },
    preview: {
        marginTop: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        overflow: 'hidden',
    },
    slider: {
        width: '100%',
        marginBottom: '10px',
    },
};

const MediaModal = ({ uploadedImage, setUploadedImage, imageSize, setImageSize, closeModal, handleComplete }:
    MediaModalProps
) => {
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={styles.modal}>
            <h3>画像のアップロード</h3>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={styles.input}
            />
            {uploadedImage && (
                <div style={styles.preview}>
                    <img
                        src={uploadedImage}
                        alt="プレビュー"
                        style={{
                            width: `${imageSize}%`,
                            height: 'auto',
                        }}
                    />
                    <input
                        type="range"
                        min="50"
                        max="200"
                        value={imageSize}
                        onChange={(e) => setImageSize(e.target.value)}
                        style={styles.slider}
                    />
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button onClick={closeModal} style={{ marginRight: 'auto' }}>閉じる</button>
                <button onClick={handleComplete} style={{ marginLeft: 'auto' }}>完了</button>
            </div>
        </div>
    );
};

export default MediaModal;
