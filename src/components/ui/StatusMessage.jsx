export function StatusMessage({ title, text, action }) {
  return (
    <div className="status-message">
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
      {action ? <div className="status-message__action">{action}</div> : null}
    </div>
  );
}
