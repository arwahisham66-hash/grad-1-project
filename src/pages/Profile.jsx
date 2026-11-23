
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Camera,
  Mail,
  Stethoscope,
  Building2,
  MapPin,
  Pencil,
  Save,
  LogOut,
  X,
} from "lucide-react";
import "./Profile.css";

function Profile({ user, onUpdateUser, onLogout }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    specialty: user?.specialty || "",
    hospital: user?.hospital || "",
    workplace: user?.workplace || "",
    picture: user?.picture || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login", { replace: true });
  };

  const initials = formData.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <main className="profile-page">
      <div className="profile-glow profile-glow-one" />
      <div className="profile-glow profile-glow-two" />

      <div className="profile-wrapper">
        <button
          className="profile-back"
          type="button"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={17} />
          {t("profile.backHome")}
        </button>

        <div className="profile-heading">
          <span className="profile-eyebrow">
            {t("profile.eyebrow")}
          </span>

          <h1>
            {t("profile.my")} <span>{t("profile.profileTitle")}</span>
          </h1>

          <p>{t("profile.description")}</p>
        </div>

        <section className="profile-card">
          <div className="profile-card-top">
            <div className="profile-avatar">
              {formData.picture ? (
                <img src={formData.picture} alt="Profile" />
              ) : (
                <span>{initials || "DR"}</span>
              )}
              <span className="profile-avatar-status" />
            </div>

            <div className="profile-main-info">
              <h2>{formData.name || t("profile.doctorName")}</h2>
              <p>
                {formData.specialty || t("profile.medicalSpecialist")}
              </p>

              <span className="profile-status">
                <span />
                {t("profile.activeAccount")}
              </span>
            </div>

            <button
              type="button"
              className="profile-edit-button"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <X size={16} /> : <Pencil size={16} />}
              {isEditing
                ? t("profile.cancel")
                : t("profile.editProfile")}
            </button>
          </div>

          <div className="profile-divider" />

          <form className="profile-details" onSubmit={handleSave}>
            <div className="profile-section-title">
              <span>{t("profile.personalInformation")}</span>
              {isEditing && <small>{t("profile.editMode")}</small>}
            </div>

            <div className="profile-fields">
              <div className="profile-field">
                <label>{t("profile.fullName")}</label>
                <div className="profile-field-input">
                  <Pencil size={17} />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder={t("profile.namePlaceholder")}
                    required
                  />
                </div>
              </div>

              <div className="profile-field">
                <label>{t("profile.emailAddress")}</label>
                <div className="profile-field-input">
                  <Mail size={17} />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="doctor@example.com"
                    required
                  />
                </div>
              </div>

              <div className="profile-field">
                <label>{t("profile.medicalSpecialty")}</label>
                <div className="profile-field-input">
                  <Stethoscope size={17} />
                  <input
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder={t("profile.specialtyPlaceholder")}
                  />
                </div>
              </div>

              <div className="profile-field">
                <label>{t("profile.hospital")}</label>
                <div className="profile-field-input">
                  <Building2 size={17} />
                  <input
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder={t("profile.hospitalPlaceholder")}
                  />
                </div>
              </div>

              <div className="profile-field profile-field-full">
                <label>{t("profile.workplace")}</label>
                <div className="profile-field-input">
                  <MapPin size={17} />
                  <input
                    name="workplace"
                    value={formData.workplace}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder={t("profile.workplacePlaceholder")}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="profile-field profile-field-full">
                  <label>{t("profile.pictureUrl")}</label>
                  <div className="profile-field-input">
                    <Camera size={17} />
                    <input
                      name="picture"
                      type="url"
                      value={formData.picture}
                      onChange={handleChange}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="profile-form-actions">
                <button type="submit" className="profile-save-button">
                  <Save size={17} />
                  {t("profile.saveChanges")}
                </button>
              </div>
            )}
          </form>

          <div className="profile-divider" />

          <div className="profile-bottom">
            <div>
              <strong>{t("profile.accountAccess")}</strong>
              <p>{t("profile.logoutDescription")}</p>
            </div>

            <button
              type="button"
              className="profile-logout-button"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              {t("profile.logout")}
            </button>
          </div>
        </section>

        <p className="profile-footnote">
          AXIOM MEDICAL WORKSPACE <span>✳</span>
        </p>
      </div>
    </main>
  );
}

export default Profile;
