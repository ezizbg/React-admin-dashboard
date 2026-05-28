import { Bell, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "../../features/i18n/i18nContext";

const STATIC_NOTIFICATIONS = [
  { id: 1, textKey: "notif.atRiskAccount", time: "2m", read: false },
  { id: 2, textKey: "notif.newAccount", time: "1h", read: false },
  { id: 3, textKey: "notif.revenueUp", time: "3h", read: true },
  { id: 4, textKey: "notif.trialExpiring", time: "5h", read: true },
  { id: 5, textKey: "notif.healthImproved", time: "1d", read: true },
];

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(STATIC_NOTIFICATIONS);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const { t } = useI18n();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="notif-trigger">
      <button
        ref={triggerRef}
        className="icon-button"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t("common.notifications")}
        aria-expanded={isOpen}
      >
        <Bell size={20} />
        {unreadCount > 0 ? <span className="notif-badge" aria-hidden="true" /> : null}
      </button>

      {isOpen ? (
        <div ref={panelRef} className="notif-panel" role="dialog" aria-label={t("common.notifications")}>
          <div className="notif-panel__header">
            <strong>{t("common.notifications")}</strong>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              {unreadCount > 0 ? (
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={markAllRead}
                  style={{ fontSize: "0.76rem", minHeight: "auto", padding: "2px 8px" }}
                >
                  {t("common.markAllRead")}
                </button>
              ) : null}
              <button
                className="icon-button"
                type="button"
                onClick={() => setIsOpen(false)}
                style={{ width: 28, height: 28, flexBasis: 28 }}
                aria-label={t("common.close")}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          <div className="notif-list">
            {notifications.map((notif) => (
              <div key={notif.id} className="notif-item">
                <span
                  className={`notif-item__dot ${notif.read ? "notif-item__dot--read" : "notif-item__dot--unread"}`}
                />
                <div>
                  <p className="notif-item__text">{t(notif.textKey)}</p>
                  <time className="notif-item__time">{t("notif.timeAgo", { time: notif.time })}</time>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
