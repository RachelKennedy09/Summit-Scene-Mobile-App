// AuthContext.js
// Global auth state (user, token) + login/register/logout/upgrade functions
// Any screen can know if the user is logged in and call auth actions
// Centralizes auth logic instead of duplicating it across screens

import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API base URL
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://172.28.248.13:4000";

// Single place for our token key
const TOKEN_KEY = "authToken";

// Create the context object
const AuthContext = createContext(null);

// Helper hook so it can use: const { user, login } = useAuth()
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return value;
}

// Provider component that wraps the app
export function AuthProvider({ children }) {
  // STATE: who is logged in, their token, and loading flag
  // user will hold {_id, email, name, role, createdAt } from backend
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // JWT from the backend
  const [isAuthLoading, setIsAuthLoading] = useState(true); // true while restoring session

  // on app start, try to restore a saved session from AsyncStorage
  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      setIsAuthLoading(true);

      const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
      if (!savedToken) {
        // No token saved - user is out
        setToken(null);
        setUser(null);
        return;
      }

      // Try to fetch current user using /auth/me
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      if (!response.ok) {
        // Token is invalid or expired - clear it
        await AsyncStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        return;
      }

      const data = await response.json();
      // Handle both { user: {...} } and raw user object shapes
      const userData = data.user || data;

      // If token is still good, restore state
      setToken(savedToken);
      setUser(userData);
    } catch (error) {
      console.error("Error restoring auth session:", error);
      // On any error, treat as logged out
      setToken(null);
      setUser(null);
      await AsyncStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsAuthLoading(false);
    }
  }

  // LOGIN: call backend /api/auth/login, save token and user
  async function login({ email, password }) {
    try {
      setIsAuthLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
      await AsyncStorage.setItem(TOKEN_KEY, data.token);

      return data; // screen can react if needed
    } catch (error) {
      console.error("Error in login:", error);
      throw error; // let screen show an alert
    } finally {
      setIsAuthLoading(false);
    }
  }

  // REGISTER: create a new account
  async function register({
    name,
    email,
    password,
    role,
    avatarUrl,
    town,
    bio,
    lookingFor,
    instagram,
    website,
  }) {
    try {
      setIsAuthLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          // only send these if they exist
          avatarUrl: avatarUrl || undefined,
          town: town || undefined,
          bio: bio || undefined,
          lookingFor: lookingFor || undefined,
          instagram: instagram || undefined,
          website: website || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data?.message || "Registration failed.";
        throw new Error(message);
      }

      // store auth in context
      setToken(data.token);
      setUser(data.user);

      await AsyncStorage.setItem(TOKEN_KEY, data.token);

      return data;
    } catch (error) {
      console.error("Error in register:", error);
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  }

  // UPGRADE: local -> business
  async function upgradeToBusiness() {
    if (!token) {
      throw new Error("You must be logged in to upgrade your account.");
    }

    try {
      setIsAuthLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/users/upgrade-to-business`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const message = data?.message || "Upgrade failed.";
        throw new Error(message);
      }

      if (data.user) {
        setUser(data.user);
      }

      return data.user;
    } catch (error) {
      console.error("Error in upgradeToBusiness:", error);
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  }

  // UPDATE PROFILE: edit name/avatar/town/bio/etc. (not email/password yet)
  async function updateProfile(updates) {
    if (!token) {
      throw new Error("You must be logged in to update your profile.");
    }

    try {
      setIsAuthLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data?.message || "Failed to update profile.";
        throw new Error(message);
      }

      if (data.user) {
        setUser(data.user);
      }

      return data.user;
    } catch (error) {
      console.error("Error in updateProfile:", error);
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  }

  // LOGOUT
  async function logout() {
    try {
      setIsAuthLoading(true);
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem(TOKEN_KEY);
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
    upgradeToBusiness,
    updateProfile, // expose this to screens
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
