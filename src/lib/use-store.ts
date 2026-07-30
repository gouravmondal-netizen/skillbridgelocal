import { useSyncExternalStore, useCallback } from "react";
import { store } from "./skillbridge";

export function useStore() {
  const snap = useSyncExternalStore(
    useCallback((cb: () => void) => store.subscribe(cb), []),
    () => store.get(),
    () => store.get(),
  );
  return snap;
}

export { store };
