import { useQuery } from "@tanstack/react-query";
import { getSessionFn } from "#/server/auth.session";

export function useSession() {
  const query = useQuery({
    queryKey: ["session"],
    queryFn: () => getSessionFn(),
    staleTime: 60_000,
    // Data is seeded by the root beforeLoad — never treat as loading if we have it
    initialData: undefined,
  });
  return {
    data: query.data ?? null,
    isPending: query.isLoading,
    refetch: query.refetch,
  };
}
