
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowUpRight,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Globe2,
} from "lucide-react";
import "./Login.css";

function Login({ onLogin, theme, onToggleTheme }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isArabic = i18n.language.startsWith("ar");

  const toggleLanguage = () => {
    const nextLanguage = isArabic ? "en" : "ar";
    i18n.changeLanguage(nextLanguage);
    localStorage.setItem("appLanguage", nextLanguage);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError(t("login.invalidEmail"));
      return;
    }

    if (password.length < 6) {
      setError(t("login.shortPassword"));
      return;
    }

    const success = onLogin(email, password);

    if (!success) {
      setError(
        isArabic
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة، أو الحساب غير موجود."
          : "Incorrect email or password, or account does not exist."
      );
      return;
    }

    navigate("/");
  };

  return (
    <main className="login-page">
      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />

      <button
        type="button"
        className="login-language-toggle"
        onClick={toggleLanguage}
        aria-label={t("axiom.nav.switchLanguage")}
      >
        <Globe2 size={16} />
        <span>{isArabic ? "EN" : "عربي"}</span>
      </button>

      <button
        type="button"
        className="login-theme-toggle"
        onClick={onToggleTheme}
        aria-label={
          theme === "dark"
            ? t("login.switchToLight")
            : t("login.switchToDark")
        }
        title={
          theme === "dark"
            ? t("login.lightMode")
            : t("login.darkMode")
        }
      >
        {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
      </button>

     <Link to="/" className="login-logo">
  <span>✳</span>
</Link>
      <section className="login-container">
        <div className="login-heading">
          <span className="login-eyebrow">
            {t("login.welcome")}
          </span>

          <h1>
            {t("login.enterWorkspace")}{" "}
            <span>{t("login.workspace")}</span>
          </h1>

          <p>{t("login.description")}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">
            {t("login.email")}
          </label>

          <div className="login-input">
            <Mail size={18} />
            <input
              id="login-email"
              type="email"
              placeholder="doctor@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <label htmlFor="login-password">
            {t("login.password")}
          </label>

          <div className="login-input">
            <LockKeyhole size={18} />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder={t("login.passwordPlaceholder")}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={t("login.togglePassword")}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-submit">
            {t("login.signIn")}
            <ArrowUpRight size={18} />
          </button>
        </form>

        <div className="login-signup-link">
          <span>
            {isArabic
              ? "ليس لديك حساب؟"
              : "Don't have an account?"}
          </span>
          <Link to="/signup">
            {isArabic ? "إنشاء حساب جديد" : "Create an account"}
          </Link>
        </div>

        <div className="login-footer">
          <span>{t("login.secureWorkspace")}</span>
          <span>{t("login.poweredBy")} ✳</span>
        </div>
      </section>
    </main>
  );
}

export default Login;
