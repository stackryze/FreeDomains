import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // Using backend URL from env or defaulting to 5000 if local
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
            const res = await fetch(`${API_URL}/auth/me`, {
                credentials: "include", // Important for cookies (sessions)
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await res.json();
            if (data.authenticated) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (provider) => {
        // Redirect to backend auth route
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        window.location.href = `${API_URL}/auth/${provider}`;
    };

    const logout = () => {
        // Full ZITADEL SSO logout: backend destroys the session and ends the ZITADEL session.
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        setUser(null);
        window.location.href = `${API_URL}/auth/zitadel/logout`;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
