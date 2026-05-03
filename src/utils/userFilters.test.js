import { describe, expect, it } from "vitest";
import { filterAndSortUsers } from "./userFilters";

const baseUsers = [
  {
    id: 1,
    name: "Alice",
    username: "alice",
    email: "alice@example.com",
    plan: "starter",
    accountStatus: "active",
    healthScore: 88,
    monthlyRevenue: 120,
    company: { name: "Alpha" },
    address: { city: "Tashkent" }
  },
  {
    id: 2,
    name: "Bob",
    username: "bob",
    email: "bob@example.com",
    plan: "growth",
    accountStatus: "risk",
    healthScore: 62,
    monthlyRevenue: 220,
    company: { name: "Beta" },
    address: { city: "London" }
  }
];

describe("filterAndSortUsers", () => {
  it("filters by query and city", () => {
    const result = filterAndSortUsers(baseUsers, {
      query: "alice",
      city: "Tashkent",
      plan: "all",
      status: "all",
      sortBy: "name",
      direction: "asc"
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Alice");
  });

  it("sorts by revenue descending", () => {
    const result = filterAndSortUsers(baseUsers, {
      query: "",
      city: "all",
      plan: "all",
      status: "all",
      sortBy: "revenue",
      direction: "desc"
    });

    expect(result[0].name).toBe("Bob");
    expect(result[1].name).toBe("Alice");
  });
});
