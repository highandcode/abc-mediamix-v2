import type { NavigatorSnapshot } from "../lib/sectionNavigator";

/** Dev-only readout of the section navigator's state machine. Never rendered in production — see Home.tsx. */
export default function SectionNavigatorDebug({ snapshot }: { snapshot: NavigatorSnapshot | null }) {
  if (!snapshot) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[100] rounded-lg bg-black/80 px-3 py-2 font-mono text-[10px] leading-relaxed text-lime-300 shadow-lg">
      <div>section: {snapshot.currentIndex + 1} / {snapshot.totalFrames} ({snapshot.frameId})</div>
      <div>kind: {snapshot.kind}</div>
      <div>state: {snapshot.state}</div>
      <div>locked: {String(snapshot.locked)}</div>
      <div>completed: {String(snapshot.completed)}</div>
    </div>
  );
}
