import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** True after hydration — safe gate for portals and other browser-only UI. */
export function useIsClient() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
