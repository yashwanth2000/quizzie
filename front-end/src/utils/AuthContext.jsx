import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const backendUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const token = Cookies.get("access_token");
    const userFromStorage = sessionStorage.getItem("user");

    if (token && userFromStorage) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userFromStorage));
    }
  }, []);

  const setUserAndSessionStorage = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const register = async (formData) => {
    try {
      const res = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const login = async (formData) => {
    try {
      const res = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setIsLoggedIn(true);
        setUserAndSessionStorage(data.user);
        Cookies.set("access_token", data.token, {
          sameSite: "none",
          secure: true,
        });
      } else {
        throw new Error(
          data.message || "An unexpected error occurred. Please try again."
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const res = await fetch(`${backendUrl}/auth/logout`, {
        credentials: "include",
      });

      if (res.ok) {
        setIsLoggedIn(false);
        setUser(null);
        sessionStorage.removeItem("user");
        Cookies.remove("access_token");
      } else {
        console.error("Logout failed:", res.status);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
