/* src/components/Header.jsx */
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';

const Header = () => {
    const [open, setOpen] = useState(false);
    const panelRef = useRef();

    useEffect(() => {
        const handleClickOutside = e => {
            if (open && panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    return (
        <div className="notif-container" ref={panelRef}>
            <button
                className="notif-btn"
                onClick={() => setOpen(prev => !prev)}
                title="Thông báo"
            >
                <FontAwesomeIcon icon={faBell} />
            </button>

            {open && (
                <div className="notif-panel">
                    <div className="panel-header">
                        <span>Thông Báo</span>
                        <button
                            className="close-btn"
                            onClick={() => setOpen(false)}
                            title="Đóng"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    <div className="notif-content">
                        <p>Chưa có thông báo mới.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
