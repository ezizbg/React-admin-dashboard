import { TrendingDown, TrendingUp } from "lucide-react";
import { createElement } from "react";
import { useCountUp } from "../../hooks/useCountUp";

export function StatCard({ icon, label, value, tone = "primary", helper, trend }) {
  const isNumeric = typeof value === "number";
  const animated = useCountUp(isNumeric ? value : 0);
  const displayValue = isNumeric ? animated : value;

  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__icon" aria-hidden="true">
        {createElement(icon, { size: 22 })}
      </div>
      <div className="stat-card__body">
        <p className="stat-card__label">{label}</p>
        <strong className="stat-card__value">{displayValue}</strong>
        <div className="stat-card__footer">
          {trend !== undefined ? (
            <span className={`stat-card__trend stat-card__trend--${trend >= 0 ? "up" : "down"}`}>
              {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(trend)}%
            </span>
          ) : null}
          {helper ? <span className="stat-card__helper">{helper}</span> : null}
        </div>
      </div>
    </article>
  );
}
