
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowUpRight,
  Globe2,
  Menu,
  X,
  Sun,
  Moon,
  UserRound,
  LogOut,
  ChevronDown,
} from "lucide-react";
import "./AxiomNavbar.css";

const links = [
  { id: "model", key: "home" },
  { id: "overview", key: "platform" },
  { id: "experience", key: "workspace" },
  { id: "workflow", key: "process" },
  { id: "home", key: "dashboard" },
  { id: "about", key: "team" },
  { id: "contact", key: "contact" },
];

function AxiomNavbar({ theme, onToggleTheme, user, onLogout }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [active, setActive] = useState("model");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 25);

      const threshold = window.innerHeight * 0.35;

      for (const { id } of [...links].reverse()) {
        const section = document.getElementById(id);

        if (section && section.getBoundingClientRect().top <= threshold) {
          setActive(id);
          return;
        }
      }

      setActive("model");
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const id = location.hash.slice(1);

      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
        });
      });
    }
  }, [location.pathname, location.hash]);

  const goTo = (event, id) => {
    event.preventDefault();
    setMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: `#${id}` } });
      window.history.replaceState(null, "", `/#${id}`);
      return;
    }

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    window.history.replaceState(null, "", `/#${id}`);
  };

  const toggleLanguage = () => {
    const nextLanguage = i18n.language.startsWith("ar") ? "en" : "ar";

    i18n.changeLanguage(nextLanguage);
    localStorage.setItem("appLanguage", nextLanguage);

    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = "ltr";
  };

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "DR";

  const navigateToProfile = () => {
    setProfileOpen(false);
    setMenuOpen(false);
    navigate("/profile");
  };

  const handleNavbarLogout = () => {
    setProfileOpen(false);
    onLogout();
    navigate("/login", { replace: true });
  };

  return (
    <header className={`axiom-navbar ${scrolled ? "is-scrolled" : ""}`}>
      <div className="axiom-nav-inner">
        <a
          href="#model"
          className="axiom-logo"
          onClick={(event) => goTo(event, "model")}
          aria-label="AXIOM home"
        >
          <span className="axiom-logo-symbol">✳</span>
        </a>

        <nav
          className={menuOpen ? "axiom-nav-links is-open" : "axiom-nav-links"}
          aria-label={t("axiom.nav.label")}
        >
          {links.map(({ id, key, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? "active" : ""}
              onClick={(event) => goTo(event, id)}
            >
              {label || t(`axiom.nav.${key}`)}
            </a>
          ))}
        </nav>

        <div className="axiom-nav-actions">
          <button
            type="button"
            className="language-button"
            onClick={toggleLanguage}
            aria-label={t("axiom.nav.switchLanguage")}
          >
            <Globe2 size={16} />
            <span>{i18n.language === "ar" ? "عربي" : "EN"}</span>
          </button>

          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a
            href="#home"
            className="nav-cta"
            onClick={(event) => goTo(event, "home")}
          >
            {t("axiom.nav.launch")}
            <ArrowUpRight size={15} />
          </a>

          {/* Profile Menu - After Get Started */}
          <div className="profile-menu-wrapper">
            <button
              type="button"
              className={`profile-menu-trigger ${profileOpen ? "is-open" : ""}`}
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
            >
              {user?.picture ? (
                <img src={user.picture} alt="Profile" />
              ) : (
                <span className="profile-menu-avatar">{initials}</span>
              )}

              <ChevronDown size={14} />
            </button>

            {profileOpen && (
              <>
                <div
                  className="profile-menu-overlay"
                  onClick={() => setProfileOpen(false)}
                />

                <div className="profile-dropdown">
                  <div className="profile-dropdown-user">
                    {user?.picture ? (
                      <img
                        className="profile-dropdown-avatar"
                        src={user.picture}
                        alt="Profile"
                      />
                    ) : (
                      <span className="profile-dropdown-avatar">
                        {initials}
                      </span>
                    )}

                    <div>
                      <strong>{user?.name || "Doctor"}</strong>
                      <span>{user?.email || ""}</span>
                    </div>
                  </div>

                  <div className="profile-dropdown-divider" />

                  <button
                    type="button"
                    onClick={navigateToProfile}
                  >
                    <UserRound size={17} />
                    My Profile
                  </button>

                  <button
                    type="button"
                    className="profile-dropdown-logout"
                    onClick={handleNavbarLogout}
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? t("axiom.nav.close") : t("axiom.nav.open")}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default AxiomNavbar;
