import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../api/axios";

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    xp: number;
    level: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const res = await api.get('/users/me');
                    setUser(res.data);
                } catch {
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [token]);

    const login = async (email: string, password: string) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
    };

    const register = async (username: string, email: string, password: string) => {
        const res = await api.post('/auth/register', { username, email, password});
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const refreshUser = async () => {
        const res = await api.get('/users/me');
        setUser(res.data);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth has to be inside AuthProvider');
    return context;
}