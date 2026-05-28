import { BarChart2, BarChart3, LayoutDashboard, Settings2, UsersRound, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/authContext";
import { useI18n } from "../../features/i18n/i18nContext";
import { getInitials } from "../../utils/formatters";

const mainNavItems = [
  { to: "/dashboard", labelKey: "common.dashboard", icon: LayoutDashboard },
  { to: "/users", labelKey: "common.accounts", icon: UsersRound },
  { to: "/analytics", labelKey: "common.analytics", icon: BarChart2 },
];

const systemNavItems = [
  { to: "/settings", labelKey: "common.settings", icon: Settings2 },
];

export function Sidebar({ isOpen, onClose }) {
  const { t } = useI18n();
  const { user } = useAuth();

  return (
    <>
      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__brand">
          <div className="brand-mark" aria-hidden="true">
            <BarChart3 size={22} />
          </div>
          <div>
            <strong>{t("common.appName")}</strong>
            <span>{t("common.appSubtitle")}</span>
          </div>
          <button className="icon-button sidebar__close" type="button" onClick={onClose} aria-label={t("common.closeMenu")}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar__nav" aria-label="Main navigation">
          <span className="sidebar__section-label">{t("sidebar.main")}</span>
          {mainNavItems.map((item) => (
            <NavLink
              className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link--active" : ""}`}
              key={item.to}
              to={item.to}
              onClick={onClose}
            >
              <item.icon size={19} />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          ))}

          <span className="sidebar__section-label" style={{ marginTop: "12px" }}>{t("sidebar.system")}</span>
          {systemNavItems.map((item) => (
            <NavLink
              className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link--active" : ""}`}
              key={item.to}
              to={item.to}
              onClick={onClose}
            >
              <item.icon size={19} />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__bottom">
          <div className="sidebar__user">
            <span
              className="avatar"
              style={{ width: 32, height: 32, flexBasis: 32, fontSize: "0.78rem" }}
              aria-hidden="true"
            >
              {getInitials(user?.name)}
            </span>
            <div className="sidebar__user-info">
              <strong>{user?.name}</strong>
              <span>{t("common.admin")}</span>
            </div>
          </div>
        </div>
      </aside>

      {isOpen ? (
        <button className="app-overlay" type="button" onClick={onClose} aria-label={t("common.closeMenu")} />
      ) : null}
    </>
  );
}
