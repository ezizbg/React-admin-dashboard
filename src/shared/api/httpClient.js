const API_URL = "https://jsonplaceholder.typicode.com";
const DEFAULT_TIMEOUT_MS = 8000;
const MAX_RETRIES = 2;

export class ApiError extends Error {
  constructor({ message, code, status = 0, isRetryable = false, details = null }) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.isRetryable = isRetryable;
    this.details = details;
  }
}

function withTimeout(signal, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  if (signal) {
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  return {
    signal: controller.signal,
    cleanup: () => clearTimeout(timeoutId)
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeHttpError(response, payload) {
  const status = response.status;
  const isServerError = status >= 500;
  const code = isServerError ? "SERVER_ERROR" : "HTTP_ERROR";

  return new ApiError({
    message: payload?.message || (isServerError ? "Server is temporarily unavailable" : "Request failed"),
    code,
    status,
    details: payload,
    isRetryable: isServerError
  });
}

function normalizeUnknownError(error) {
  if (error?.name === "AbortError") {
    return new ApiError({
      message: "Request timed out. Please try again.",
      code: "TIMEOUT",
      isRetryable: true
    });
  }

  if (error instanceof ApiError) {
    return error;
  }

  return new ApiError({
    message: "Network error. Check your connection.",
    code: "NETWORK_ERROR",
    isRetryable: true,
    details: error
  });
}

export async function request(endpoint, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    signal,
    timeoutMs = DEFAULT_TIMEOUT_MS
  } = options;

  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    const { signal: timeoutSignal, cleanup } = withTimeout(signal, timeoutMs);

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        signal: timeoutSignal,
        headers: {
          "Content-Type": "application/json",
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      });

      const contentType = response.headers.get("content-type") ?? "";
      const payload = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        throw normalizeHttpError(response, payload);
      }

      return payload;
    } catch (error) {
      const normalized = normalizeUnknownError(error);
      const canRetry = normalized.isRetryable && attempt < MAX_RETRIES && !signal?.aborted;

      if (!canRetry) {
        throw normalized;
      }

      await sleep(250 * 2 ** attempt);
      attempt += 1;
    } finally {
      cleanup();
    }
  }

  throw new ApiError({
    message: "Request failed after multiple attempts",
    code: "RETRY_EXHAUSTED",
    isRetryable: false
  });
}
