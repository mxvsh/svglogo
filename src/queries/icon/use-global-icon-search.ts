import { useQuery } from "@tanstack/react-query";
import { fetchGlobalSearch } from "#/infra/iconify/iconify-client";

export function useGlobalIconSearch(query: string, enabled: boolean) {
  return useQuery({
    queryKey: ["iconify-global-search", query],
    queryFn: () => fetchGlobalSearch(query),
    enabled: enabled && !!query,
    staleTime: 1000 * 60 * 5,
  });
}
