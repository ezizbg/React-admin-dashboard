import { createElement } from "react";

export function StatCard({ icon, label, value, tone = "primary", helper }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__icon" aria-hidden="true">
        {createElement(icon, { size: 22 })}
      </div>
      <div>
        <p className="stat-card__label">{label}</p>
        <strong className="stat-card__value">{value}</strong>
        {helper ? <span className="stat-card__helper">{helper}</span> : null}
      </div>
    </article>
  );
}
