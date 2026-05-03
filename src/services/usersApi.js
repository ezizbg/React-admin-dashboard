import { request } from "../shared/api/httpClient";

function normalizeUser(rawUser) {
  return {
    id: rawUser?.id ?? 0,
    name: rawUser?.name ?? "Unknown user",
    username: rawUser?.username ?? "unknown",
    email: rawUser?.email ?? "unknown@example.com",
    phone: rawUser?.phone ?? "N/A",
    website: rawUser?.website ?? "",
    company: {
      name: rawUser?.company?.name ?? "Unknown company",
      catchPhrase: rawUser?.company?.catchPhrase ?? ""
    },
    address: {
      city: rawUser?.address?.city ?? "N/A",
      street: rawUser?.address?.street ?? "N/A",
      suite: rawUser?.address?.suite ?? "N/A",
      zipcode: rawUser?.address?.zipcode ?? "N/A",
      geo: {
        lat: rawUser?.address?.geo?.lat ?? "0",
        lng: rawUser?.address?.geo?.lng ?? "0"
      }
    }
  };
}

export function getUsers(options) {
  return request("/users", options).then((users) => users.map(normalizeUser));
}

export function getUserById(userId, options) {
  return request(`/users/${userId}`, options).then(normalizeUser);
}
