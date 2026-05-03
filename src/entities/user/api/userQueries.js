import { useQuery } from "@tanstack/react-query";
import { getUserById, getUsers } from "../../../services/usersApi";
import { enrichAccount } from "../../../utils/accountModel";

export const userQueryKeys = {
  all: ["users"],
  details: (userId) => ["users", String(userId)]
};

export function useUsersQuery() {
  return useQuery({
    queryKey: userQueryKeys.all,
    queryFn: async ({ signal }) => {
      const users = await getUsers({ signal });
      return users.map(enrichAccount);
    }
  });
}

export function useUserDetailsQuery(userId) {
  return useQuery({
    queryKey: userQueryKeys.details(userId),
    enabled: Boolean(userId),
    queryFn: async ({ signal }) => {
      const user = await getUserById(userId, { signal });
      return enrichAccount(user);
    }
  });
}
