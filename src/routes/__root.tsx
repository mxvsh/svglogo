import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";

const queryClient = new QueryClient({
	defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } },
});

export const Route = createRootRoute({
	component: RootLayout,
});

function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<Outlet />
		</QueryClientProvider>
	);
}
