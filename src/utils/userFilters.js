export const sortOptions = [
  { value: "name", labelKey: "sort.name" },
  { value: "email", labelKey: "sort.email" },
  { value: "company", labelKey: "sort.company" },
  { value: "city", labelKey: "sort.city" },
  { value: "revenue", labelKey: "sort.revenue" },
  { value: "health", labelKey: "sort.health" }
];

export function getUserField(user, field) {
  const fields = {
    name: user.name,
    email: user.email,
    company: user.company?.name,
    city: user.address?.city,
    health: user.healthScore,
    revenue: user.monthlyRevenue
  };

  return fields[field] ?? "";
}

export function filterAndSortUsers(users, { query, city, plan, status, sortBy, direction }) {
  const normalizedQuery = query.trim().toLowerCase();

  return users
    .filter((user) => {
      const searchableText = [
        user.name,
        user.username,
        user.email,
        user.company?.name,
        user.address?.city,
        user.plan,
        user.accountStatus
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(normalizedQuery);
      const matchesCity = city === "all" || user.address?.city === city;
      const matchesPlan = plan === "all" || user.plan === plan;
      const matchesStatus = status === "all" || user.accountStatus === status;

      return matchesSearch && matchesCity && matchesPlan && matchesStatus;
    })
    .sort((firstUser, secondUser) => {
      const firstValue = getUserField(firstUser, sortBy);
      const secondValue = getUserField(secondUser, sortBy);
      const result =
        typeof firstValue === "number"
          ? firstValue - secondValue
          : String(firstValue).toLowerCase().localeCompare(String(secondValue).toLowerCase());

      return direction === "asc" ? result : -result;
    });
}
