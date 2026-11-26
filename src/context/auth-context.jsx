import { createContext, useContext, useEffect, useState } from "react";
import { DEMO_USER, IS_LOCAL_DEMO } from "@/lib/demo-data";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(IS_LOCAL_DEMO ? DEMO_USER : null);
  const [loading, setLoading] = useState(!IS_LOCAL_DEMO);

  const checkAuth = async () => {
    if (IS_LOCAL_DEMO) {
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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

  useEffect(() => {
    if (!IS_LOCAL_DEMO) {
      checkAuth();
    }
  }, []);

  const login = (provider) => {
    if (IS_LOCAL_DEMO) {
      window.location.href = "/dashboard";
      return;
    }
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  const logout = () => {
    if (IS_LOCAL_DEMO) {
      window.location.href = "/";
      return;
    }
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
