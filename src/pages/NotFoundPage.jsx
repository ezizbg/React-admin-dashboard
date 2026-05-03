import { Link } from "react-router-dom";
import { StatusMessage } from "../components/ui/StatusMessage";
import { useI18n } from "../features/i18n/i18nContext";

export function NotFoundPage() {
  const { t } = useI18n();

  return (
    <StatusMessage
      title={t("status.pageNotFound")}
      text={t("status.routeDoesNotExist")}
      action={
        <Link className="button button--secondary" to="/dashboard">
          {t("status.goToDashboard")}
        </Link>
      }
    />
  );
}
