import { useSyncExternalStore } from "react";
import { getActiveNavigatorSnapshot, subscribeToActiveNavigator } from "../lib/sectionNavigator";

/** The active section navigator's latest snapshot, or null when none is running. */
export function useFrameSnapshot() {
  return useSyncExternalStore(subscribeToActiveNavigator, getActiveNavigatorSnapshot, () => null);
}
