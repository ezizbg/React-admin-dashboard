import { BarChart2, Layers, Target, TrendingUp } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { ErrorState } from "../components/ui/PageState";
import { Skeleton } from "../components/ui/Skeleton";
import { StatCard } from "../components/ui/StatCard";
import { useUsersQuery } from "../entities/user/api/userQueries";
import { useI18n } from "../features/i18n/i18nContext";
import { formatCurrency } from "../utils/accountModel";
import { getInitials } from "../utils/formatters";

const PLANS = ["starter", "growth", "scale", "enterprise"];
const STATUSES = ["active", "trial", "attention", "risk"];

const PLAN_COLORS = {
  starter: "var(--muted)",
  growth: "var(--primary)",
  scale: "var(--blue)",
  enterprise: "var(--amber)",
};

const STATUS_COLORS = {
  active: "var(--green)",
  trial: "var(--blue)",
  attention: "var(--amber)",
  risk: "var(--rose)",
};

const HEALTH_BANDS = [
  { label: "50–65", color: "var(--rose)" },
  { label: "66–75", color: "var(--amber)" },
  { label: "76–85", color: "var(--primary)" },
  { label: "86–100", color: "var(--green)" },
];

function DonutChart({ segments }) {
  let cumulative = 0;
  const gradient = segments
    .map(({ percent, color }) => {
      const from = cumulative;
      cumulative += percent;
      return `${color} ${from}% ${cumulative}%`;
    })
    .join(", ");

  return (
    <div
      className="donut-chart"
      style={{ background: `conic-gradient(${gradient})` }}
      aria-hidden="true"
    />
  );
}

export function AnalyticsPage() {
  const { data: users = [], isLoading, isError, error, refetch } = useUsersQuery();
  const { language, t } = useI18n();

  useEffect(() => {
    document.title = `${t("common.analytics")} | AdminFlow`;
  }, [t]);

  const analytics = useMemo(() => {
    if (!users.length) return null;

    const revenueByPlan = Object.fromEntries(
      PLANS.map((p) => [p, users.filter((u) => u.plan === p).reduce((sum, u) => sum + u.monthlyRevenue, 0)])
    );
    const countByPlan = Object.fromEntries(
      PLANS.map((p) => [p, users.filter((u) => u.plan === p).length])
    );
    const countByStatus = Object.fromEntries(
      STATUSES.map((s) => [s, users.filter((u) => u.accountStatus === s).length])
    );

    const maxRevenue = Math.max(...Object.values(revenueByPlan), 1);
    const maxStatusCount = Math.max(...Object.values(countByStatus), 1);

    const healthBandCounts = [
      users.filter((u) => u.healthScore >= 50 && u.healthScore <= 65).length,
      users.filter((u) => u.healthScore >= 66 && u.healthScore <= 75).length,
      users.filter((u) => u.healthScore >= 76 && u.healthScore <= 85).length,
      users.filter((u) => u.healthScore >= 86).length,
    ];
    const maxHealthBand = Math.max(...healthBandCounts, 1);

    const topAccounts = [...users]
      .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
      .slice(0, 6);

    const avgMrr = Math.round(users.reduce((s, u) => s + u.monthlyRevenue, 0) / users.length);
    const totalSeats = users.reduce((s, u) => s + u.seats, 0);
    const avgHealth = Math.round(users.reduce((s, u) => s + u.healthScore, 0) / users.length);
    const atRiskCount = countByStatus.risk;

    const totalAccounts = users.length;
    const donutSegments = PLANS.map((p) => ({
      plan: p,
      percent: totalAccounts > 0 ? Math.round((countByPlan[p] / totalAccounts) * 100) : 0,
      color: PLAN_COLORS[p],
    })).filter((s) => s.percent > 0);

    return {
      revenueByPlan,
      countByPlan,
      countByStatus,
      maxRevenue,
      maxStatusCount,
      healthBandCounts,
      maxHealthBand,
      topAccounts,
      avgMrr,
      totalSeats,
      avgHealth,
      atRiskCount,
      donutSegments,
    };
  }, [users]);

  if (isError) {
    return <ErrorState title={t("status.couldNotLoadUsers")} text={error?.message} actionLabel={t("common.tryAgain")} onAction={refetch} />;
  }

  return (
    <div className="page-stack">
      <section className="page-intro">
        <div>
          <span className="eyebrow">{t("analytics.eyebrow")}</span>
          <h2>{t("analytics.title")}</h2>
          <p>{t("analytics.description")}</p>
        </div>
        <Badge tone="blue">{t("common.demoWorkspace")}</Badge>
      </section>

      <section className="metrics-grid" aria-label={t("analytics.metricsLabel")}>
        <StatCard
          icon={TrendingUp}
          label={t("analytics.avgMrr")}
          value={isLoading ? "..." : formatCurrency(analytics?.avgMrr ?? 0, language)}
          helper={t("analytics.avgMrrHelper")}
          trend={11}
        />
        <StatCard
          icon={Layers}
          label={t("analytics.totalSeats")}
          value={isLoading ? "..." : analytics?.totalSeats ?? 0}
          helper={t("analytics.totalSeatsHelper")}
          tone="amber"
          trend={6}
        />
        <StatCard
          icon={Target}
          label={t("analytics.avgHealth")}
          value={isLoading ? "..." : `${analytics?.avgHealth ?? 0}%`}
          helper={t("analytics.avgHealthHelper")}
          tone="green"
          trend={4}
        />
        <StatCard
          icon={BarChart2}
          label={t("analytics.atRisk")}
          value={isLoading ? "..." : analytics?.atRiskCount ?? 0}
          helper={t("analytics.atRiskHelper")}
          tone="rose"
        />
      </section>

      {isLoading ? (
        <section className="analytics-grid">
          <article className="panel content-section">
            <Skeleton className="skeleton--title" />
            <div style={{ display: "grid", gap: "14px", marginTop: "12px" }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ display: "grid", gap: "6px" }}>
                  <Skeleton className="skeleton--text" />
                  <Skeleton className="skeleton--meter" />
                </div>
              ))}
            </div>
          </article>
          <article className="panel content-section">
            <Skeleton className="skeleton--title" />
            <Skeleton className="skeleton--chart" />
          </article>
        </section>
      ) : null}

      {!isLoading && analytics ? (
        <>
          <section className="analytics-grid">
            <article className="content-section panel">
              <div className="section-heading">
                <div>
                  <h2>{t("analytics.revenueByPlan")}</h2>
                  <p>{t("analytics.revenueByPlanDesc")}</p>
                </div>
              </div>
              <div className="horiz-bars">
                {PLANS.map((plan, index) => (
                  <div className="horiz-bar" key={plan}>
                    <div className="horiz-bar__header">
                      <span>{t(`plans.${plan}`)}</span>
                      <span>{formatCurrency(analytics.revenueByPlan[plan], language)}</span>
                    </div>
                    <div className="horiz-bar__track">
                      <div
                        className="horiz-bar__fill"
                        style={{
                          width: `${(analytics.revenueByPlan[plan] / analytics.maxRevenue) * 100}%`,
                          background: PLAN_COLORS[plan],
                          animationDelay: `${index * 100}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="content-section panel">
              <div className="section-heading">
                <div>
                  <h2>{t("analytics.planMix")}</h2>
                  <p>{t("analytics.planMixDesc")}</p>
                </div>
              </div>
              <div className="donut-chart-wrap">
                <DonutChart segments={analytics.donutSegments} />
                <div className="donut-legend">
                  {analytics.donutSegments.map((seg) => (
                    <div className="donut-legend__item" key={seg.plan}>
                      <span className="donut-legend__dot" style={{ background: seg.color }} />
                      <span className="donut-legend__label">{t(`plans.${seg.plan}`)}</span>
                      <span className="donut-legend__value">{seg.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>

          <section className="analytics-grid">
            <article className="content-section panel">
              <div className="section-heading">
                <div>
                  <h2>{t("analytics.healthDist")}</h2>
                  <p>{t("analytics.healthDistDesc")}</p>
                </div>
              </div>
              <div className="health-bands">
                {HEALTH_BANDS.map(({ label, color }, index) => (
                  <div className="health-band" key={label}>
                    <b>{analytics.healthBandCounts[index]}</b>
                    <div
                      className="health-band__bar"
                      style={{
                        height: `${Math.max(8, (analytics.healthBandCounts[index] / analytics.maxHealthBand) * 130)}px`,
                        background: color,
                        animationDelay: `${index * 100}ms`,
                      }}
                    />
                    <small>{label}</small>
                  </div>
                ))}
              </div>
            </article>

            <article className="content-section panel">
              <div className="section-heading">
                <div>
                  <h2>{t("analytics.statusDist")}</h2>
                  <p>{t("analytics.statusDistDesc")}</p>
                </div>
              </div>
              <div className="horiz-bars">
                {STATUSES.map((status, index) => (
                  <div className="horiz-bar" key={status}>
                    <div className="horiz-bar__header">
                      <span>{t(`statuses.${status}`)}</span>
                      <span>{analytics.countByStatus[status]}</span>
                    </div>
                    <div className="horiz-bar__track">
                      <div
                        className="horiz-bar__fill"
                        style={{
                          width: `${(analytics.countByStatus[status] / analytics.maxStatusCount) * 100}%`,
                          background: STATUS_COLORS[status],
                          animationDelay: `${index * 100}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="content-section panel">
            <div className="section-heading">
              <div>
                <h2>{t("analytics.topAccounts")}</h2>
                <p>{t("analytics.topAccountsDesc")}</p>
              </div>
              <Link className="button button--secondary" to="/users">
                {t("common.viewAll")}
              </Link>
            </div>
            <div className="recent-list">
              {analytics.topAccounts.map((user) => (
                <Link className="recent-user" key={user.id} to={`/users/${user.id}`}>
                  <span className="avatar avatar--soft" aria-hidden="true">
                    {getInitials(user.name)}
                  </span>
                  <span>
                    <strong>{user.company?.name}</strong>
                    <small>{t(`plans.${user.plan}`)}</small>
                  </span>
                  <span className="recent-user__meta">
                    <Badge tone={user.accountStatusTone}>{t(`statuses.${user.accountStatus}`)}</Badge>
                    <small>{formatCurrency(user.monthlyRevenue, language)}</small>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
