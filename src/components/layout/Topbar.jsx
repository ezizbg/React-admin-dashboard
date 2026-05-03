import { LogOut, Menu } from "lucide-react";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/authContext";
import { useI18n } from "../../features/i18n/i18nContext";
import { getInitials } from "../../utils/formatters";
import { LanguageToggle } from "../ui/LanguageToggle";

const pageTitles = {
  "/dashboard": "common.dashboard",
  "/users": "common.accounts"
};

function getTitleKey(pathname) {
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }

  if (pathname.startsWith("/users/")) {
    return "common.accountDetails";
  }

  return "common.dashboard";
}

export function Topbar({ onMenuClick }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const titleKey = useMemo(() => getTitleKey(location.pathname), [location.pathname]);

  return (
    <header className="topbar">
      <div className="topbar__title-row">
        <button className="icon-button topbar__menu" type="button" onClick={onMenuClick} aria-label={t("common.openMenu")}>
          <Menu size={22} />
        </button>
        <div>
          <span className="topbar__eyebrow">{t("common.workspace")}</span>
          <h1>{t(titleKey)}</h1>
        </div>
      </div>

      <div className="topbar__profile">
        <LanguageToggle />
        <div className="avatar" aria-hidden="true">
          {getInitials(user?.name)}
        </div>
        <div className="topbar__user">
          <strong>{user?.name}</strong>
          <span>{t("common.admin")}</span>
        </div>
        <button className="icon-button" type="button" onClick={logout} aria-label={t("common.logout")} title={t("common.logout")}>
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
