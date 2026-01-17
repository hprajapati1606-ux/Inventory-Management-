import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check login status on app load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Token exists = user logged in
            setUser({ loggedIn: true });
        }
        setLoading(false);
    }, []);

    // LOGIN FUNCTION
    const login = async (email, password) => {
        const formData = new FormData();
        formData.append('username', email); // OAuth2PasswordRequestForm expects username
        formData.append('password', password);

        const response = await api.post('/auth/login', formData);

        const { access_token } = response.data;
        localStorage.setItem('token', access_token);

        // Mark user as logged in
        setUser({ loggedIn: true });
        return true;
    };

    // LOGOUT FUNCTION
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
