// Global auth state (user, token) + login/register/logout functins
// any screen can know if the user is logged in and call auth actions
//only long auth instead of on each screen

import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Creaete the context object
const AuthContext = createContext(null);

// Helper hook so it can use `const auth = useAuth()` in screens
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return value;
}

// Provider component that wraps the app
export function AuthProvider({ children }) {
  // STATE: who is logged in and their token and loading flag
  const [user, setUser] = useState(null); // will hold { id, email, name, createdAt}
  const [token, setToken] = useState(null); // JWT from the backend
  const [isAuthLoading, setIsAuthLoading] = useState(true); // true while resorting session

  const API_BASE_URL = "http://172.28.248.13:4000/api";

  // on app start, tries to restore a saved session from AsyncStorage
  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      setIsAuthLoading(true);

      const savedToken = await AsyncStorage.getItem("authToken");
      if (!savedToken) {
        // no token saved - user is logged ot
        setIsAuthLoading(false);

        return;
      }
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      if (!response.ok) {
        //Token is invalid or expired - clear it
        await AsyncStorage.removeItem("authToken");
        setToken(null);
        setUser(null);
        setIsAuthLoading(false);
        return;
      }

      const userData = await response.json();

      // if token is good, restore state
      setToken(savedToken);
      setUser(userData);
    } catch (error) {
      console.error("Error restoring auth session:", error);
      //on any error, treat as logged out
      setToken(null);
      setUser(null);
      await AsyncStorage.removeItem("AuthToken");
    } finally {
      setIsAuthLoading(false);
    }
  }

  // LOGIN: call backend /auth/login, save token and user
  async function login({ email, password }) {
    try {
      setIsAuthLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // backend should send { message: "Invalid email or password" }
        const message = data?.message || "Login failed.";
        throw new Error(message);
      }

      // Save token and user in state and Async storage
      setToken(data.token);
      setUser(data.user);
      await AsyncStorage.setItem("authToken", data.token);

      return data; // screen can react
    } catch (error) {
      console.error("Error in login:", error);
      throw error; // let screen show an alert
    } finally {
      setIsAuthLoading(false);
    }
  }

  // REGISTER: call backend /auth/register, asve token and user
  async function register({ name, email, password }) {
    try {
      setIsAuthLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        const message = data?.message || "Registration failed.";
        throw new Error(message);
      }

      setToken(data.token);
      setUser(data.user);
      await AsyncStorage.setItem("authToken", data.token);

      return data;
    } catch (error) {
      console.error("Error in register:", error);
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  }

  // LOGOUT: clear everything and remove token from storage
  async function logout() {
    try {
      setIsAuthLoading(true);
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem("authToken");
    } catch (error) {
      console.error("Error in logout:", error);
    } finally {
      setIsAuthLoading(false);
    }
  }

  const value = {
    user,
    token,
    isAuthLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
