import React, { useState } from 'react';
import './MenuBar.css'; // Stil für die Menüleiste

function MenuBar() {
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleLoginClick = () => {
        setLoginOpen(!isLoginOpen);
    };

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        // Fügen Sie hier Ihre Login-Logik hinzu
        console.log('Login submitted:', username, password);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        // Fügen Sie hier Ihre Such-Logik hinzu
        console.log('Search submitted:', searchQuery);
    };

    return (
        <div className="menu-bar">
            <div className="menu-item">
                <button>Gruppe eintragen</button>
            </div>
            <div className="menu-item">
                <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
            </div>
            <div className="menu-item" onClick={handleLoginClick}>
                Login
                {isLoginOpen && (
                    <div className="login-dropdown">
                        <form onSubmit={handleLoginSubmit}>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="submit">Login</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default React.memo(MenuBar);
