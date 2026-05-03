import {
  ArrowLeft,
  Building2,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { ErrorState, LoadingState } from "../components/ui/PageState";
import { useToast } from "../components/ui/useToast";
import { useUserDetailsQuery } from "../entities/user/api/userQueries";
import { useI18n } from "../features/i18n/i18nContext";
import { formatCurrency, getHealthTone } from "../utils/accountModel";
import { getInitials } from "../utils/formatters";

export function UserDetailsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { language, t } = useI18n();
  const [retryNonce, setRetryNonce] = useState(0);
  const { notify } = useToast();
  const { data: user, isLoading, isError, error, refetch } = useUserDetailsQuery(userId);

  useEffect(() => {
    if (retryNonce > 0) {
      refetch();
    }
  }, [refetch, retryNonce]);

  useEffect(() => {
    if (isError) {
      notify(error?.message || t("details.errorTitle"), "error");
    }
  }, [error, isError, notify, t]);

  if (isLoading) {
    return <LoadingState title={t("details.loadingTitle")} text={t("details.loadingText")} />;
  }

  if (isError || !user) {
    return (
      <ErrorState
        title={t("details.errorTitle")}
        text={error?.message}
        actionLabel={t("common.tryAgain")}
        onAction={() => setRetryNonce((value) => value + 1)}
      />
    );
  }

  const mapLink = `https://maps.google.com/?q=${user?.address?.geo?.lat},${user?.address?.geo?.lng}`;

  return (
    <div className="page-stack">
      <button className="button button--ghost page-back" type="button" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        {t("common.back")}
      </button>

      <section className="profile-header">
        <div className="profile-header__identity">
          <span className="avatar avatar--large" aria-hidden="true">
            {getInitials(user.name)}
          </span>
          <div>
            <span className="profile-header__eyebrow">{t("details.profileEyebrow")}</span>
            <h2>{user?.name}</h2>
            <p>{user?.company?.name} / @{user?.username}</p>
          </div>
        </div>

        <div className="profile-header__actions">
          <Badge tone={user.accountStatusTone}>{t(`statuses.${user.accountStatus}`)}</Badge>
          <a className="button button--secondary" href={`https://${user?.website}`} target="_blank" rel="noreferrer">
            <ExternalLink size={18} />
            {t("common.website")}
          </a>
        </div>
      </section>

      <section className="account-summary-grid">
        <article>
          <span>{t("details.plan")}</span>
          <strong>{t(`plans.${user.plan}`)}</strong>
        </article>
        <article>
          <span>{t("details.seats")}</span>
          <strong>{user.seats}</strong>
        </article>
        <article>
          <span>{t("details.mrr")}</span>
          <strong>{formatCurrency(user.monthlyRevenue, language)}</strong>
        </article>
        <article>
          <span>{t("details.health")}</span>
          <strong>{user.healthScore}%</strong>
        </article>
      </section>

      <section className="details-grid">
        <article className="details-card">
          <div className="details-card__icon" aria-hidden="true">
            <UserRound size={20} />
          </div>
          <div>
            <h3>{t("details.contact")}</h3>
            <p>
              <Mail size={16} />
              <a href={`mailto:${user?.email}`}>{user?.email}</a>
            </p>
            <p>
              <Phone size={16} />
              <a href={`tel:${user?.phone}`}>{user?.phone}</a>
            </p>
          </div>
        </article>

        <article className="details-card">
          <div className="details-card__icon details-card__icon--amber" aria-hidden="true">
            <Building2 size={20} />
          </div>
          <div>
            <h3>{t("details.company")}</h3>
            <p>{user?.company?.name}</p>
            <small>{user?.company?.catchPhrase}</small>
          </div>
        </article>

        <article className="details-card">
          <div className="details-card__icon details-card__icon--blue" aria-hidden="true">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3>{t("details.accountStatus")}</h3>
            <p>
              <Badge tone={user.accountStatusTone}>{t(`statuses.${user.accountStatus}`)}</Badge>
            </p>
            <div className="health-meter">
              <span className={`health-meter__bar health-meter__bar--${getHealthTone(user.healthScore)}`}>
                <i style={{ width: `${user.healthScore}%` }} />
              </span>
              <b>{user.healthScore}%</b>
            </div>
            <small>{t("details.lastActivity", { value: t(`lastActivity.${user.lastActivityKey}`) })}</small>
          </div>
        </article>

        <article className="details-card">
          <div className="details-card__icon details-card__icon--green" aria-hidden="true">
            <MapPin size={20} />
          </div>
          <div>
            <h3>{t("details.address")}</h3>
            <p>
              {user?.address?.street}, {user?.address?.suite}
            </p>
            <small>
              {user?.address?.city}, {user?.address?.zipcode}
            </small>
            <a className="inline-link" href={mapLink} target="_blank" rel="noreferrer">
              <Globe2 size={16} />
              {t("details.openMap")}
            </a>
          </div>
        </article>

        <article className="details-card">
          <div className="details-card__icon" aria-hidden="true">
            <UsersRound size={20} />
          </div>
          <div>
            <h3>{t("details.subscription")}</h3>
            <p>{t(`plans.${user.plan}`)}</p>
            <small>
              {t("details.subscriptionText", {
                seats: user.seats,
                mrr: formatCurrency(user.monthlyRevenue, language)
              })}
            </small>
          </div>
        </article>
      </section>
    </div>
  );
}
