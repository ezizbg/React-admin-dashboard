import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { LanguageToggle } from "../components/ui/LanguageToggle";
import { useToast } from "../components/ui/useToast";
import { useAuth } from "../features/auth/authContext";
import { useI18n } from "../features/i18n/i18nContext";
import { useTheme } from "../features/theme/themeContext";
import { getInitials } from "../utils/formatters";

function getStoredNotifPrefs() {
  try {
    const stored = localStorage.getItem("notif-prefs");
    return stored ? JSON.parse(stored) : { emailAlerts: true, atRisk: true, trialExpiry: false };
  } catch {
    return { emailAlerts: true, atRisk: true, trialExpiry: false };
  }
}

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t } = useI18n();
  const { notify } = useToast();

  const [notifPrefs, setNotifPrefs] = useState(getStoredNotifPrefs);

  useEffect(() => {
    document.title = `${t("common.settings")} | AdminFlow`;
  }, [t]);

  function toggleNotif(key) {
    setNotifPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem("notif-prefs", JSON.stringify(next));
      } catch {}
      return next;
    });
    notify(t("settings.saved"), "success");
  }

  return (
    <div className="page-stack">
      <section className="page-intro">
        <div>
          <span className="eyebrow">{t("settings.eyebrow")}</span>
          <h2>{t("settings.title")}</h2>
          <p>{t("settings.description")}</p>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section__header">
          <h3>{t("settings.profile")}</h3>
          <p>{t("settings.profileDesc")}</p>
        </div>
        <div className="settings-row">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span className="avatar" style={{ flexShrink: 0 }} aria-hidden="true">
              {getInitials(user?.name)}
            </span>
            <div className="settings-row__label">
              <strong>{user?.name}</strong>
              <p>{user?.email}</p>
            </div>
          </div>
          <span className="badge badge--green">{t("common.admin")}</span>
        </div>
        <div className="settings-row">
          <div className="settings-row__label">
            <strong>{t("settings.role")}</strong>
            <p>{t("settings.roleDesc")}</p>
          </div>
          <span style={{ color: "var(--muted)", fontSize: "0.86rem", fontWeight: 700 }}>
            {t("common.admin")}
          </span>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section__header">
          <h3>{t("settings.appearance")}</h3>
          <p>{t("settings.appearanceDesc")}</p>
        </div>
        <div className="settings-row">
          <div className="settings-row__label">
            <strong>{t("settings.theme")}</strong>
            <p>{isDark ? t("settings.themeDark") : t("settings.themeLight")}</p>
          </div>
          <button className="button button--secondary" type="button" onClick={toggleTheme}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? t("settings.switchLight") : t("settings.switchDark")}
          </button>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section__header">
          <h3>{t("settings.language")}</h3>
          <p>{t("settings.languageDesc")}</p>
        </div>
        <div className="settings-row">
          <div className="settings-row__label">
            <strong>{t("settings.interfaceLanguage")}</strong>
            <p>{t("settings.interfaceLanguageDesc")}</p>
          </div>
          <LanguageToggle />
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section__header">
          <h3>{t("settings.notifications")}</h3>
          <p>{t("settings.notificationsDesc")}</p>
        </div>

        <div className="settings-row">
          <div className="settings-row__label">
            <strong>{t("settings.emailAlerts")}</strong>
            <p>{t("settings.emailAlertsDesc")}</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notifPrefs.emailAlerts}
              onChange={() => toggleNotif("emailAlerts")}
            />
            <span className="toggle-switch__track" />
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-row__label">
            <strong>{t("settings.atRiskAlerts")}</strong>
            <p>{t("settings.atRiskAlertsDesc")}</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notifPrefs.atRisk}
              onChange={() => toggleNotif("atRisk")}
            />
            <span className="toggle-switch__track" />
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-row__label">
            <strong>{t("settings.trialAlerts")}</strong>
            <p>{t("settings.trialAlertsDesc")}</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notifPrefs.trialExpiry}
              onChange={() => toggleNotif("trialExpiry")}
            />
            <span className="toggle-switch__track" />
          </label>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section__header">
          <h3>{t("settings.dangerZone")}</h3>
          <p>{t("settings.dangerZoneDesc")}</p>
        </div>
        <div className="settings-row">
          <div className="settings-row__label">
            <strong>{t("settings.signOut")}</strong>
            <p>{t("settings.signOutDesc")}</p>
          </div>
          <button className="button button--secondary" type="button" onClick={logout}>
            {t("common.logout")}
          </button>
        </div>
      </section>
    </div>
  );
}
