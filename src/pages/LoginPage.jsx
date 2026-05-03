import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LanguageToggle } from "../components/ui/LanguageToggle";
import { useToast } from "../components/ui/useToast";
import { useAuth } from "../features/auth/authContext";
import { useI18n } from "../features/i18n/i18nContext";

export function LoginPage() {
  const [form, setForm] = useState({
    email: "admin@example.com",
    password: "password"
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const { t } = useI18n();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname ?? "/dashboard";

  useEffect(() => {
    document.title = `${t("auth.title")} | SaaS Admin Dashboard`;
  }, [t]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!form.email.trim() || !form.password.trim()) {
        throw new Error(t("auth.emptyFields"));
      }

      await login(form);
      notify(t("auth.loginSuccess"), "success");
      navigate(redirectTo, { replace: true });
    } catch (submitError) {
      setError(submitError.message);
      notify(submitError.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-label="Login form">
        <div className="auth-panel__top">
          <div className="auth-panel__brand">
            <div className="brand-mark" aria-hidden="true">
              <BarChart3 size={24} />
            </div>
            <div>
              <strong>{t("common.appName")}</strong>
              <span>{t("common.appSubtitle")}</span>
            </div>
          </div>
          <LanguageToggle />
        </div>

        <div className="auth-panel__heading">
          <span className="eyebrow">{t("auth.eyebrow")}</span>
          <h1>{t("auth.title")}</h1>
          <p>{t("auth.description")}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            {t("auth.email")}
            <input
              autoComplete="email"
              name="email"
              onChange={handleChange}
              placeholder="admin@example.com"
              type="email"
              value={form.email}
            />
          </label>

          <label>
            {t("auth.password")}
            <input
              autoComplete="current-password"
              name="password"
              onChange={handleChange}
              placeholder="password"
              type="password"
              value={form.password}
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="button button--primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? t("auth.submitting") : t("auth.submit")}
          </button>
        </form>
      </section>

      <section className="auth-preview" aria-label={t("auth.previewAria")}>
        <div className="preview-window">
          <div className="preview-window__bar">
            <span />
            <span />
            <span />
          </div>
          <div className="preview-window__header">
            <strong>{t("auth.previewTitle")}</strong>
            <small>{t("auth.previewSubtitle")}</small>
          </div>
          <div className="preview-grid">
            <div className="preview-metric preview-metric--green" />
            <div className="preview-metric preview-metric--amber" />
            <div className="preview-metric preview-metric--rose" />
            <div className="preview-chart">
              <span style={{ height: "52%" }} />
              <span style={{ height: "78%" }} />
              <span style={{ height: "42%" }} />
              <span style={{ height: "88%" }} />
              <span style={{ height: "66%" }} />
            </div>
            <div className="preview-list">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
