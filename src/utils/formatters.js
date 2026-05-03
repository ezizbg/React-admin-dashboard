export function getInitials(name = "") {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getEmailDomain(email = "") {
  return email.split("@")[1] ?? "unknown";
}
