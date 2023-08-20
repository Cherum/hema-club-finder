import React, { useState } from 'react';
import axios from 'axios';
import { SHA256 } from 'crypto-js';
import GroupFormOverlay from './add_group.js'; // Adjust the path
import './MenuBar.css'; // Stil für die Menüleiste

function MenuBar() {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    const handleOpenOverlay = () => {
        setIsOverlayOpen(true);
    };

    const handleCloseOverlay = () => {
        setIsOverlayOpen(false);
    };

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        console.log('handleLoginSubmit');

        // Hash the password using SHA-256
        const hashedPassword = SHA256(password).toString();

        const user = {
            username: username,
            password_hash: hashedPassword,
        };

        try {
            const response = await axios.post('http://localhost:3000/login', user);
            // Handle successful login
            console.log('Logged in:', response.data);
        } catch (error) {
            console.log("Login invalid")
        }
    };

    return (
        <div className="menu-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="menu-item">HEMA Gruppe finden</div>
            <div className="menu-item">
                <button onClick={handleOpenOverlay}>Gruppe eintragen</button>
                <GroupFormOverlay isOpen={isOverlayOpen} onRequestClose={handleCloseOverlay} />
            </div>
            <div className="menu-item">
                <div>
                    <form onSubmit={handleLoginSubmit}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ fontSize: '12px' }}
                        />
                        <input
                            type="password"
                            placeholder="Passwort"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ fontSize: '12px' }}
                        />
                        <button type="submit" style={{ fontSize: '12px' }}>Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default React.memo(MenuBar);
