import { useCallback, useEffect, useState } from "react";
import { getUsers } from "../services/usersApi";
import { enrichAccount } from "../utils/accountModel";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const loadUsers = useCallback(async (signal) => {
    setStatus("loading");
    setError("");

    try {
      const data = await getUsers({ signal });
      setUsers(data.map(enrichAccount));
      setStatus("success");
    } catch (requestError) {
      if (requestError.name === "AbortError") {
        return;
      }

      setError(requestError.message || "Не удалось загрузить данные");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadUsers(controller.signal);

    return () => controller.abort();
  }, [loadUsers]);

  return {
    users,
    isLoading: status === "loading",
    isError: status === "error",
    error,
    refetch: () => loadUsers()
  };
}
