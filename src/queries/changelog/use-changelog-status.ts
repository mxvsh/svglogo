import { useState } from "react";
import { CHANGELOG } from "#/data/changelog";

const STORAGE_KEY = "svglogo:changelog_seen";
const LATEST = CHANGELOG[0].date;

function getHasNew(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== LATEST;
  } catch {
    return false;
  }
}

export function useChangelogStatus() {
  const [hasNew, setHasNew] = useState(getHasNew);

  function markSeen() {
    try {
      localStorage.setItem(STORAGE_KEY, LATEST);
    } catch {}
    setHasNew(false);
  }

  return { hasNew, markSeen };
}
