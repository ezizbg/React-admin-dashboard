import { ArrowDownAZ, ArrowUpAZ, Eye, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { EmptyState, ErrorState } from "../components/ui/PageState";
import { useI18n } from "../features/i18n/i18nContext";
import { useUsersQuery } from "../entities/user/api/userQueries";
import { useToast } from "../components/ui/useToast";
import { formatCurrency, getAccountStatusOptions, getHealthTone, getPlanOptions } from "../utils/accountModel";
import { getInitials } from "../utils/formatters";
import { filterAndSortUsers, sortOptions } from "../utils/userFilters";

export function UsersPage() {
  const { data: users = [], isLoading, isError, error, refetch } = useUsersQuery();
  const { language, t } = useI18n();
  const { notify } = useToast();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [plan, setPlan] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [direction, setDirection] = useState("asc");

  const cities = useMemo(
    () => Array.from(new Set(users.map((user) => user.address?.city).filter(Boolean))).sort(),
    [users]
  );

  const plans = useMemo(() => getPlanOptions(), []);
  const statuses = useMemo(() => getAccountStatusOptions(), []);

  const visibleUsers = useMemo(
    () => filterAndSortUsers(users, { query, city, plan, status, sortBy, direction }),
    [users, query, city, plan, status, sortBy, direction]
  );

  const activeFiltersCount = [query.trim(), city !== "all", plan !== "all", status !== "all"].filter(Boolean).length;
  const hasActiveFilters = activeFiltersCount > 0;

  useEffect(() => {
    if (isError) {
      notify(error?.message || t("status.couldNotLoadUsers"), "error");
    }
  }, [error, isError, notify, t]);

  function toggleDirection() {
    setDirection((currentDirection) => (currentDirection === "asc" ? "desc" : "asc"));
  }

  function resetFilters() {
    setQuery("");
    setCity("all");
    setPlan("all");
    setStatus("all");
    setSortBy("name");
    setDirection("asc");
  }

  return (
    <div className="page-stack">
      <section className="page-intro">
        <div>
          <span className="eyebrow">{t("users.eyebrow")}</span>
          <h2>{t("users.title")}</h2>
          <p>{t("users.description")}</p>
        </div>
        <Badge tone="green">{isLoading ? t("users.badgeLoading") : t("users.badgeVisible", { count: visibleUsers.length })}</Badge>
      </section>

      <section className="content-section panel">
        <div className="section-heading">
          <div>
            <h2>{t("users.tableTitle")}</h2>
            <p>{isLoading ? t("users.loadingText") : t("users.countText", { visible: visibleUsers.length, total: users.length })}</p>
          </div>
          {hasActiveFilters ? (
            <button className="button button--secondary" type="button" onClick={resetFilters}>
              {t("common.reset")}
            </button>
          ) : null}
        </div>

        <div className="table-toolbar">
          <label className="search-field">
            <Search size={18} aria-hidden="true" />
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("users.searchPlaceholder")}
              type="search"
              value={query}
            />
          </label>

          <label className="select-field">
            {t("users.city")}
            <select value={city} onChange={(event) => setCity(event.target.value)}>
              <option value="all">{t("users.allCities")}</option>
              {cities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
          </label>

          <label className="select-field">
            {t("users.plan")}
            <select value={plan} onChange={(event) => setPlan(event.target.value)}>
              <option value="all">{t("users.allPlans")}</option>
              {plans.map((planName) => (
                <option key={planName} value={planName}>
                  {t(`plans.${planName}`)}
                </option>
              ))}
            </select>
          </label>

          <label className="select-field">
            {t("users.status")}
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">{t("users.allStatuses")}</option>
              {statuses.map((statusOption) => (
                <option key={statusOption.value} value={statusOption.value}>
                  {t(`statuses.${statusOption.value}`)}
                </option>
              ))}
            </select>
          </label>

          <label className="select-field">
            {t("users.sort")}
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </option>
              ))}
            </select>
          </label>

          <button className="button button--secondary table-toolbar__sort" type="button" onClick={toggleDirection}>
            {direction === "asc" ? <ArrowUpAZ size={18} /> : <ArrowDownAZ size={18} />}
            {direction === "asc" ? t("users.ascending") : t("users.descending")}
          </button>
        </div>

        <div className="filter-summary">
          <span>{hasActiveFilters ? t("users.activeFilters", { count: activeFiltersCount }) : t("users.noFilters")}</span>
        </div>

        {isError ? <ErrorState title={t("status.couldNotLoadUsers")} text={error?.message} actionLabel={t("common.tryAgain")} onAction={refetch} /> : null}

        {!isError ? (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>{t("users.contact")}</th>
                  <th>{t("users.company")}</th>
                  <th>{t("users.plan")}</th>
                  <th>{t("users.status")}</th>
                  <th>{t("users.health")}</th>
                  <th>MRR</th>
                  <th>{t("users.city")}</th>
                  <th aria-label={t("common.actions")} />
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr className="skeleton-row" key={index}>
                      <td colSpan="8">
                        <span />
                      </td>
                    </tr>
                  ))
                ) : null}

                {!isLoading ? visibleUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <span className="avatar avatar--soft" aria-hidden="true">
                          {getInitials(user.name)}
                        </span>
                        <span>
                          <strong>{user.name}</strong>
                          <small>@{user.username}</small>
                        </span>
                      </div>
                    </td>
                    <td>{user.company?.name}</td>
                    <td>{t(`plans.${user.plan}`)}</td>
                    <td>
                      <Badge tone={user.accountStatusTone}>{t(`statuses.${user.accountStatus}`)}</Badge>
                    </td>
                    <td>
                      <div className="health-meter health-meter--compact">
                        <span className={`health-meter__bar health-meter__bar--${getHealthTone(user.healthScore)}`}>
                          <i style={{ width: `${user.healthScore}%` }} />
                        </span>
                        <b>{user.healthScore}%</b>
                      </div>
                    </td>
                    <td>{formatCurrency(user.monthlyRevenue, language)}</td>
                    <td>{user.address?.city}</td>
                    <td>
                      <Link className="icon-button" to={`/users/${user.id}`} aria-label={`${t("common.open")} ${user.name}`} title={t("common.open")}>
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                )) : null}
              </tbody>
            </table>

            {!isLoading && visibleUsers.length === 0 ? (
              <EmptyState
                title={t("users.noResultsTitle")}
                text={t("users.noResultsText")}
                action={
                  hasActiveFilters ? (
                    <button className="button button--secondary" type="button" onClick={resetFilters}>
                      {t("common.reset")}
                    </button>
                  ) : null
                }
              />
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
