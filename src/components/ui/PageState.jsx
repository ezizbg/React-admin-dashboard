export function LoadingState({ title, text }) {
  return (
    <div className="status-message status-message--loading" aria-busy="true">
      <div className="loading-spinner" aria-hidden="true" />
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

export function ErrorState({ title, text, actionLabel, onAction }) {
  return (
    <div className="status-message status-message--error" role="alert">
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
      {onAction ? (
        <div className="status-message__action">
          <button className="button button--secondary" type="button" onClick={onAction}>
            {actionLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="status-message status-message--empty">
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
      {action ? <div className="status-message__action">{action}</div> : null}
    </div>
  );
}
