import { Activity, BadgeDollarSign, CircleAlert, UsersRound } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { ErrorState } from "../components/ui/PageState";
import { Skeleton } from "../components/ui/Skeleton";
import { StatCard } from "../components/ui/StatCard";
import { useToast } from "../components/ui/useToast";
import { useUsersQuery } from "../entities/user/api/userQueries";
import { useI18n } from "../features/i18n/i18nContext";
import { formatCurrency, getHealthTone } from "../utils/accountModel";
import { getInitials } from "../utils/formatters";

export function DashboardPage() {
  const { data: users = [], isLoading, isError, error, refetch } = useUsersQuery();
  const { language, t } = useI18n();
  const { notify } = useToast();

  const activeAccounts = users.filter((user) => user.accountStatus === "active").length;
  const atRiskAccounts = users.filter((user) => user.accountStatus === "risk" || user.accountStatus === "attention").length;
  const monthlyRevenue = users.reduce((total, user) => total + user.monthlyRevenue, 0);
  const averageHealth = users.length
    ? Math.round(users.reduce((total, user) => total + user.healthScore, 0) / users.length)
    : 0;
  const recentUsers = users.slice(0, 5);
  const revenueBars = users.slice(0, 8);

  useEffect(() => {
    if (isError) {
      notify(error?.message || t("status.couldNotLoadUsers"), "error");
    }
  }, [error, isError, notify, t]);

  return (
    <div className="page-stack">
      <section className="page-intro">
        <div>
          <span className="eyebrow">{t("dashboard.eyebrow")}</span>
          <h2>{t("dashboard.title")}</h2>
          <p>{t("dashboard.description")}</p>
        </div>
        <Badge tone="blue">{t("common.demoWorkspace")}</Badge>
      </section>

      <section className="metrics-grid" aria-label={t("dashboard.metricsLabel")}>
        <StatCard
          icon={UsersRound}
          label={t("dashboard.accounts")}
          value={isLoading ? "..." : users.length}
          helper={t("dashboard.active", { count: activeAccounts })}
        />
        <StatCard
          icon={BadgeDollarSign}
          label={t("dashboard.mrr")}
          value={isLoading ? "..." : formatCurrency(monthlyRevenue, language)}
          helper={t("dashboard.mrrHelper")}
          tone="amber"
        />
        <StatCard
          icon={Activity}
          label={t("dashboard.health")}
          value={isLoading ? "..." : `${averageHealth}%`}
          helper={t("dashboard.healthHelper")}
          tone="green"
        />
        <StatCard
          icon={CircleAlert}
          label={t("dashboard.needsReview")}
          value={isLoading ? "..." : atRiskAccounts}
          helper={t("dashboard.needsReviewHelper")}
          tone="rose"
        />
      </section>

      <section className="dashboard-grid">
        <article className="content-section panel">
          <div className="section-heading">
            <div>
              <h2>{t("dashboard.revenueTitle")}</h2>
              <p>{t("dashboard.revenueDescription")}</p>
            </div>
          </div>

          <div className="revenue-chart" aria-label={t("dashboard.revenueTitle")}>
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div className="revenue-chart__item" key={index}>
                    <Skeleton className="skeleton--chart" />
                    <Skeleton className="skeleton--text" />
                  </div>
                ))
              : revenueBars.map((user) => (
                  <div className="revenue-chart__item" key={user.id}>
                    <span style={{ height: `${Math.min(100, Math.max(22, user.monthlyRevenue / 10))}%` }} />
                    <small>{user.company?.name.split(" ")[0]}</small>
                  </div>
                ))}
          </div>
        </article>

        <article className="content-section panel">
          <div className="section-heading">
            <div>
              <h2>{t("dashboard.healthTitle")}</h2>
              <p>{t("dashboard.healthDescription")}</p>
            </div>
          </div>

          <div className="health-list">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div className="health-row" key={index}>
                    <span>
                      <Skeleton className="skeleton--title" />
                      <Skeleton className="skeleton--text" />
                    </span>
                    <Skeleton className="skeleton--meter" />
                  </div>
                ))
              : recentUsers.slice(0, 4).map((user) => (
                  <Link className="health-row" key={user.id} to={`/users/${user.id}`}>
                    <span>
                      <strong>{user.company?.name}</strong>
                      <small>{t(`plans.${user.plan}`)}</small>
                    </span>
                    <div className="health-meter" aria-label={`${user.healthScore}% health`}>
                      <span className={`health-meter__bar health-meter__bar--${getHealthTone(user.healthScore)}`}>
                        <i style={{ width: `${user.healthScore}%` }} />
                      </span>
                      <b>{user.healthScore}%</b>
                    </div>
                  </Link>
                ))}
          </div>
        </article>
      </section>

      <section className="content-section panel">
        <div className="section-heading">
          <div>
            <h2>{t("dashboard.recentTitle")}</h2>
            <p>{t("dashboard.recentDescription")}</p>
          </div>
          <Link className="button button--secondary" to="/users">
            {t("common.viewAll")}
          </Link>
        </div>

        {isError ? <ErrorState title={t("status.couldNotLoadUsers")} text={error?.message} actionLabel={t("common.tryAgain")} onAction={refetch} /> : null}

        {!isError ? (
          <div className="recent-list">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <article className="recent-user" key={index}>
                    <Skeleton className="skeleton--avatar" />
                    <span>
                      <Skeleton className="skeleton--title" />
                      <Skeleton className="skeleton--text" />
                    </span>
                    <span className="recent-user__meta">
                      <Skeleton className="skeleton--chip" />
                      <Skeleton className="skeleton--text" />
                    </span>
                  </article>
                ))
              : recentUsers.map((user) => (
                  <Link className="recent-user" key={user.id} to={`/users/${user.id}`}>
                    <span className="avatar avatar--soft" aria-hidden="true">
                      {getInitials(user.name)}
                    </span>
                    <span>
                      <strong>{user.name}</strong>
                      <small>{user.company?.name}</small>
                    </span>
                    <span className="recent-user__meta">
                      <Badge tone={user.accountStatusTone}>{t(`statuses.${user.accountStatus}`)}</Badge>
                      <small>{formatCurrency(user.monthlyRevenue, language)}</small>
                    </span>
                  </Link>
                ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
