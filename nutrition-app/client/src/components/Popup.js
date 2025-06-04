// src/components/Popup.jsx
import React, { useEffect, useRef } from 'react';
import '../styles/Popup.css';

const Popup = ({ open, message, success, onClose }) => {
    const panelRef = useRef();

    // Đóng popup khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (open && panelRef.current && !panelRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, onClose]);

    // Nếu open === false, không render gì
    if (!open) return null;

    return (
        <div className="popup-overlay">
            <div
                ref={panelRef}
                className={`popup-box ${success ? 'success' : 'error'}`}
            >
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Popup;
