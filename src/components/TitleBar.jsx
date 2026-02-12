import React, { useState, useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import heepIcon from '../assets/heep-icon.png';
import { version } from '../../package.json';

const TitleBar = ({ theme, onCheckUpdate, isChecking, title }) => {
    const [isMaximized, setIsMaximized] = useState(false);
    const appWindow = getCurrentWindow();

    useEffect(() => {
        const checkMaximized = async () => {
            setIsMaximized(await appWindow.isMaximized());
        };
        checkMaximized();

        const unlisten = appWindow.onResized(async () => {
            checkMaximized();
        });

        return () => {
            unlisten.then(f => f());
        }
    }, []);

    const handleMinimize = () => appWindow.minimize();
    const handleMaximize = async () => {
        if (isMaximized) {
            await appWindow.unmaximize();
        } else {
            await appWindow.maximize();
        }
        setIsMaximized(!isMaximized);
    };
    const handleClose = () => appWindow.close();

    return (
        <div className={`titlebar ${theme === 'light' ? 'light' : 'dark'}`}>
            <div className="titlebar-left" data-tauri-drag-region>
                <img src={heepIcon} alt="icon" className="titlebar-icon" />
                <span className="titlebar-text">{title || 'Heep.'}</span>
            </div>

            <div className="titlebar-right">
                <button
                    className={`update-check-btn ${isChecking ? 'checking' : ''}`}
                    onClick={onCheckUpdate}
                    disabled={isChecking}
                    title={`Check for Updates - Heep.app (v${version})`}
                >
                    <svg
                        className={isChecking ? 'spin-animation' : ''}
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" />
                    </svg>
                </button>

                <div className="window-controls">
                    <button className="titlebar-button minimize" onClick={handleMinimize} title="Minimize">
                        <svg width="10" height="1" viewBox="0 0 10 1"><rect width="10" height="1" fill="currentColor" /></svg>
                    </button>

                    <button className="titlebar-button maximize" onClick={handleMaximize} title={isMaximized ? "Restore" : "Maximize"}>
                        {isMaximized ? (
                            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2,2 L2,8 L8,8 L8,2 L2,2 Z M1,1 L9,1 L9,9 L1,9 L1,1 Z" fill="currentColor" fillRule="evenodd" /></svg> // Simple restore icon
                        ) : (
                            <svg width="10" height="10" viewBox="0 0 10 10"><rect width="9" height="9" x="0.5" y="0.5" stroke="currentColor" fill="none" /></svg>
                        )}
                    </button>

                    <button className="titlebar-button close" onClick={handleClose} title="Close">
                        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M0,0 L10,10 M10,0 L0,10" stroke="currentColor" strokeWidth="1" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TitleBar;
