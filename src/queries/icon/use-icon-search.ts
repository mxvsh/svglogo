import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchCollection } from "#/infra/iconify/iconify-client";

export function useIconSearch(query: string, prefix: string) {
  const { data: allIcons = [], isFetching } = useQuery({
    queryKey: ["iconify-collection", prefix],
    queryFn: () => fetchCollection(prefix),
    staleTime: Number.POSITIVE_INFINITY,
  });

  const trimmed = query.trim().toLowerCase();
  const icons = useMemo(() => {
    if (!trimmed) return allIcons;
    return allIcons.filter((name) => name.includes(trimmed));
  }, [allIcons, trimmed]);

  return { data: icons, isFetching };
}
