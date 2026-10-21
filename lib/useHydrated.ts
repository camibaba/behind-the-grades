"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// false in the server HTML and during hydration, true once React has taken over
// the page. Used to keep submit buttons disabled until their handlers are live.
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
