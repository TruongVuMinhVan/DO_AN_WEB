// components/Popup.js
import React from 'react';
import '../styles/Popup.css';

export default function Popup({ message, onClose, success = true }) {
    // Đóng popup khi click ra ngoài
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('popup-overlay')) {
            onClose();
        }
    };

    return (
        <div className="popup-overlay" onClick={handleOverlayClick}>
            <div className={`popup-box ${success ? 'success' : 'error'}`}>
                <h2 className="text-xl font-semibold mb-4" style={{ color: success ? 'green' : 'red' }}>
                    {success ? 'Thành công' : 'Lỗi'}
                </h2>
                <p className="mb-6 text-gray-700">{message}</p>
                <button
                    onClick={onClose}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
}
