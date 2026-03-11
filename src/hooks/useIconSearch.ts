import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const ICONIFY_BASE = "https://api.iconify.design";

async function fetchAllForPrefix(prefix: string): Promise<string[]> {
	const res = await fetch(`${ICONIFY_BASE}/collection?prefix=${prefix}`);
	const data = await res.json();
	const uncategorized: string[] = data.uncategorized ?? [];
	const categorized: string[] = Object.values(
		data.categories ?? {},
	).flat() as string[];
	const all = [...new Set([...uncategorized, ...categorized])];
	return all.map((n) => `${prefix}:${n}`);
}

export function useIconSearch(query: string, prefix: string) {
	const { data: allIcons = [], isFetching } = useQuery({
		queryKey: ["iconify-collection", prefix],
		queryFn: () => fetchAllForPrefix(prefix),
		staleTime: Infinity,
	});

	const trimmed = query.trim().toLowerCase();
	const icons = useMemo(() => {
		if (!trimmed) return allIcons;
		return allIcons.filter((name) => name.includes(trimmed));
	}, [allIcons, trimmed]);

	return { data: icons, isFetching };
}
