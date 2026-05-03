import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app/App";
import { AppErrorBoundary } from "./app/providers/ErrorBoundary";
import { AppQueryProvider } from "./app/providers/QueryProvider";
import { AuthProvider } from "./features/auth/AuthProvider";
import { I18nProvider } from "./features/i18n/I18nProvider";
import { ToastProvider } from "./components/ui/ToastProvider";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppErrorBoundary>
      <AppQueryProvider>
        <I18nProvider>
          <BrowserRouter>
            <AuthProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </AuthProvider>
          </BrowserRouter>
        </I18nProvider>
      </AppQueryProvider>
    </AppErrorBoundary>
  </StrictMode>
);
