const plans = [
  { value: "starter", basePrice: 49 },
  { value: "growth", basePrice: 149 },
  { value: "scale", basePrice: 349 },
  { value: "enterprise", basePrice: 799 }
];

const statuses = [
  { value: "active", tone: "green" },
  { value: "trial", tone: "blue" },
  { value: "attention", tone: "amber" },
  { value: "risk", tone: "rose" }
];

const lastActivity = ["today", "yesterday", "twoDays", "fiveDays", "oneWeek"];

export function enrichAccount(user) {
  const plan = plans[user.id % plans.length];
  const status = statuses[user.id % statuses.length];
  const seats = 4 + ((user.id * 3) % 22);
  const monthlyRevenue = plan.basePrice + seats * 12;
  const healthScore = 58 + ((user.id * 9) % 39);

  return {
    ...user,
    accountStatus: status.value,
    accountStatusTone: status.tone,
    healthScore,
    lastActivityKey: lastActivity[user.id % lastActivity.length],
    monthlyRevenue,
    plan: plan.value,
    seats
  };
}

export function getAccountStatusOptions() {
  return statuses;
}

export function getPlanOptions() {
  return plans.map((plan) => plan.value);
}

export function formatCurrency(value, language = "ru") {
  return new Intl.NumberFormat(language === "ru" ? "ru-RU" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function getHealthTone(score) {
  if (score >= 82) {
    return "green";
  }

  if (score >= 68) {
    return "amber";
  }

  return "rose";
}
