# SaaS Admin Dashboard

React Admin dashboard upgraded to strong junior / junior+ production standards.

## Tech Stack

- React 19 + Vite
- React Router
- TanStack Query (server state, cache, deduplication)
- Context API (auth + i18n)
- Vitest (unit tests)
- CSS (design tokens + reusable UI primitives)

## Final Architecture

```text
src/
  app/
    App.jsx                    # routes + Suspense + lazy pages
    providers/
      ErrorBoundary.jsx        # root runtime protection
      QueryProvider.jsx        # QueryClient config
  entities/
    user/
      api/
        userQueries.js         # server-state hooks and query keys
  features/
    auth/
      AuthProvider.jsx         # session, TTL, auto logout
      ProtectedRoute.jsx
    i18n/
      I18nProvider.jsx
      i18nContext.js
      translations.js
  shared/
    api/
      httpClient.js            # timeout, retries, normalized errors
  components/
    layout/                    # shell components
    ui/                        # toasts, states, skeleton, badges
  pages/                       # route pages (dashboard/users/details/login)
  services/
    usersApi.js                # endpoint-specific normalization
  utils/
    accountModel.js
    userFilters.js
    userFilters.test.js        # unit tests
  styles/
    global.css
```

## Key Production Decisions

### Server state separated from UI state

- Server state is centralized in TanStack Query via `useUsersQuery` and `useUserDetailsQuery`
- Built-in cache + request deduplication + stale strategy via QueryClient defaults
- UI state remains local in pages (search/filter/sort controls)

### API client hardened for real-world failures

`src/shared/api/httpClient.js` implements:

- timeout with abort signal
- retry with backoff for retryable failures
- structured `ApiError` with `code/status/isRetryable`
- normalized error messages for network/timeout/http/server scenarios

### Error handling and runtime resilience

- Root-level Error Boundary (`src/app/providers/ErrorBoundary.jsx`)
- Page-level loading/error/empty states
- Retry actions on failed server requests
- Toast notifications for async failures and user feedback

### Auth session reliability

`AuthProvider` now includes:

- session TTL (`expiresAt`)
- validity checks on hydration
- automatic logout on expiry
- invalid session cleanup from storage

### Performance and rendering strategy

- Lazy route chunks for all pages
- Suspense fallback UI
- Query cache prevents duplicate network calls on page transitions
- Memoized selectors already used for table filtering/sorting

## Quality Gates

```bash
npm run lint
npm run test
npm run build
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173/`.

## Demo Credentials

Any non-empty credentials are valid.

Example:

```text
admin@example.com
password
```
