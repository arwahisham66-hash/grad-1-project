import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";

import AxiomHome from "./pages/AxiomHome";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AxiomNavbar from "./components/AxiomNavbar";

import "./i18n";

function AppContent() {
  const { i18n } = useTranslation();
  const location = useLocation();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("appTheme") || "dark"
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("axiomUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Restore saved language
  useEffect(() => {
    const savedLanguage = localStorage.getItem("appLanguage");

    if (savedLanguage === "en" || savedLanguage === "ar") {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  // Update page language direction
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = "ltr";
    document.body.dir = "ltr";
  }, [i18n.language]);

  // Apply theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("appTheme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "dark" ? "light" : "dark"
    );
  };

  // Login with an existing account
  const handleLogin = (email, password) => {
    const existingUsers = JSON.parse(
      localStorage.getItem("axiomUsers") || "[]"
    );

    const matchedUser = existingUsers.find(
      (account) =>
        account.email.toLowerCase() ===
          email.trim().toLowerCase() &&
        account.password === password
    );

    if (!matchedUser) {
      return false;
    }

    const { password: savedPassword, ...safeUser } = matchedUser;

    localStorage.setItem(
      "axiomUser",
      JSON.stringify(safeUser)
    );

    setUser(safeUser);

    return true;
  };

  // Create a new account
  const handleSignup = (newUser) => {
    const existingUsers = JSON.parse(
      localStorage.getItem("axiomUsers") || "[]"
    );

    const updatedUsers = [...existingUsers, newUser];

    localStorage.setItem(
      "axiomUsers",
      JSON.stringify(updatedUsers)
    );

    const { password: savedPassword, ...safeUser } = newUser;

    localStorage.setItem(
      "axiomUser",
      JSON.stringify(safeUser)
    );

    setUser(safeUser);
  };

  // Update profile information
  const handleUpdateUser = (updatedUser) => {
    localStorage.setItem(
      "axiomUser",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);

    const existingUsers = JSON.parse(
      localStorage.getItem("axiomUsers") || "[]"
    );

    const updatedUsers = existingUsers.map((account) =>
      account.email === updatedUser.email
        ? { ...account, ...updatedUser }
        : account
    );

    localStorage.setItem(
      "axiomUsers",
      JSON.stringify(updatedUsers)
    );
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("axiomUser");
    setUser(null);
  };

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  return (
    <>
      {user && !isLoginPage && !isSignupPage && (
        <AxiomNavbar
          theme={theme}
          onToggleTheme={toggleTheme}
          user={user}
          onLogout={handleLogout}
        />
      )}

      <Routes>
        {/* Login Page */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Login
                onLogin={handleLogin}
                theme={theme}
                onToggleTheme={toggleTheme}
              />
            )
          }
        />

        {/* Signup Page */}
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Signup
                onSignup={handleSignup}
                theme={theme}
                onToggleTheme={toggleTheme}
              />
            )
          }
        />

        {/* Home Page */}
     <Route
  path="/"
  element={
    user ? <AxiomHome /> : <Navigate to="/login" replace />
  }
/>

        {/* Dashboard Page */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Profile Page */}
        <Route
          path="/profile"
          element={
            user ? (
              <Profile
                user={user}
                onUpdateUser={handleUpdateUser}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Unknown Routes */}
        <Route
          path="*"
          element={
            <Navigate
              to={user ? "/" : "/login"}
              replace
            />
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;