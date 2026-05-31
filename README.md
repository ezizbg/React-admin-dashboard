# React Admin Dashboard

## 1. Project Overview

**React Admin Dashboard** — a single-page application for managing client accounts and operational metrics.  
The system combines data viewing, filtering, detailed entity cards, and request state management in a unified interface.

The application can serve as a foundation for internal B2B tools: admin panels, CRM modules, support dashboards, and client base monitoring.

---

## 2. Core Features

- Authentication and protected routes
- Dashboard with key metrics and account statuses
- API data loading with centralized error handling
- Accounts table with search, filtering, and sorting
- Account detail page
- Section navigation via React Router
- Interface states: loading / error / empty / retry
- Skeleton loading and toast notifications
- RU/EN interface localization

---

## 3. Technology Stack

### Core

- React 19
- Vite

### State Management

- TanStack React Query (server state)
- Context API (auth, i18n, UI notifications)

### Routing

- React Router

### API

- Fetch API
- Custom HTTP client (`timeout`, `retry`, error normalization)

### UI

- Component-based architecture
- CSS design tokens, responsive layout, micro-interactions

### Development Tools

- ESLint
- Vitest

---

## 4. Project Architecture

The project is organized in layers:

- `app` — application entry point, routing, providers, global error boundaries
- `entities` — domain entities and data access
- `features` — isolated business capabilities (auth, i18n)
- `shared` — reusable infrastructure (API client, common utilities)

This separation reduces module coupling, simplifies maintenance, and allows the application to scale without structural degradation.

---

## 5. Data Handling

Server state is managed via **React Query**:

- Data caching between screens
- Deduplication of identical requests
- Stale strategy for controlled refetching
- Centralized `retry` for recoverable errors

The API layer is implemented through a single HTTP client:

- Request timeout
- Error classification (`network`, `timeout`, `http`, `server`)
- Normalized messages for UI

---

## 6. Implementation Details

- **Error Boundary** at the application level to protect against runtime failures
- **Lazy loading + Suspense** for optimized page loading
- Separation of server state and UI state
- Edge-case protection: handling partial/incomplete API data
- TTL session in authentication and automatic invalidation

---

## 7. Installation & Running

```bash
npm install
npm run dev
npm run build
```

---

## 8. Demo

- GitHub Pages: `https://ezizbg.github.io/React-admin-dashboard/`
