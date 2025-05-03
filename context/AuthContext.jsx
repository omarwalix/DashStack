"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout } from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await apiLogin(email, password);

      const userData = response?.data?.user || response?.user || response;

      if (!userData) {
        throw new Error("No user data received");
      }

      const formattedUser = {
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        userName: userData.user_name || "",
        email: userData.email || "",
        profileImageUrl: userData.profile_image_url || "",
      };

      setUser(formattedUser);
      localStorage.setItem("user", JSON.stringify(formattedUser));

      return formattedUser;
    } catch (error) {
      console.error("invalid email or password:", error);
      setUser(null);
      localStorage.removeItem("user");
      throw new Error(error.message || "invalid email or password. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
