import React from "react";
import { ErrorState } from "../../components/ui/PageState";

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Unhandled application error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="page">
          <ErrorState
            title="Application crashed"
            text="Unexpected error happened. Reload and try again."
            actionLabel="Reload"
            onAction={() => globalThis.location.reload()}
          />
        </main>
      );
    }

    return this.props.children;
  }
}

export function AppErrorBoundary({ children }) {
  return <RootErrorBoundary>{children}</RootErrorBoundary>;
}
