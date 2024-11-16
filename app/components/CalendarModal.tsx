import React, { useState } from 'react';
import { CSSProperties } from 'react';

type CalendarModalProps = {
    setEvents: (events: { title: string; start: string; end: string }) => void;
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
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
    },
    button: {
        marginTop: '20px',
    },
};

const CalendarModal = ({ setEvents, closeModal }: CalendarModalProps) => {
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    const handleAddEvent = () => {
        if (title && start) {
            const newEvent = { title, start, end: end || start };
            setEvents(newEvent); // newEvent を正しく渡す
            closeModal();
        }
    };

    return (
        <div style={styles.modal}>
            <input
                type="text"
                style={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="イベントタイトル"
            />
            <input
                type="date"
                style={styles.input}
                value={start}
                onChange={(e) => setStart(e.target.value)}
            />
            <input
                type="date"
                style={styles.input}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                placeholder="終了日 (任意)"
            />
            <button onClick={handleAddEvent} style={styles.button}>
                追加
            </button>
            <button onClick={closeModal} style={{ ...styles.button, marginLeft: '10px' }}>
                閉じる
            </button>
        </div>
    );
};

export default CalendarModal;
