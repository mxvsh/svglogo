import { useEffect, useRef, useState } from "react";

declare const __BUILD_HASH__: string;

export function useVersionCheck() {
	const [updateAvailable, setUpdateAvailable] = useState(false);
	const checked = useRef(false);

	useEffect(() => {
		const check = async () => {
			if (checked.current) return;
			try {
				const res = await fetch(`/version.json?t=${Date.now()}`);
				const { hash } = await res.json();
				if (hash !== __BUILD_HASH__) {
					checked.current = true;
					setUpdateAvailable(true);
				}
			} catch {
				// ignore network errors
			}
		};

		const onVisibility = () => {
			if (document.visibilityState === "visible") void check();
		};
		document.addEventListener("visibilitychange", onVisibility);

		return () => {
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, []);

	return updateAvailable;
}
