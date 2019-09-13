import React from 'react';
import '../styles/popup.css';

export default function Popup({ togglePopup, children }) {
    return (
        <div className="popup" onClick={togglePopup}>
            <div className="popup_inner">{children}</div>
        </div>
    );
}
