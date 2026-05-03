import { BarChart3, LayoutDashboard, UsersRound, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useI18n } from "../../features/i18n/i18nContext";

const navItems = [
  { to: "/dashboard", labelKey: "common.dashboard", icon: LayoutDashboard },
  { to: "/users", labelKey: "common.accounts", icon: UsersRound }
];

export function Sidebar({ isOpen, onClose }) {
  const { t } = useI18n();

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
          {navItems.map((item) => (
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
      </aside>

      {isOpen ? <button className="app-overlay" type="button" onClick={onClose} aria-label={t("common.closeMenu")} /> : null}
    </>
  );
}
