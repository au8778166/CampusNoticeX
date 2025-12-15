import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/user/me`,
          { withCredentials: true }
        );
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    const logout = async () => {
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
    };
  
    useEffect(() => {
      fetchUser();
    }, []);
  
    return (
      <AuthContext.Provider
        value={{ user, loading, logout, fetchUser }} // 👈 ADD fetchUser
      >
        {children}
      </AuthContext.Provider>
    );
  }
  export const useAuth = () => {
    return useContext(AuthContext);
  };
  
  