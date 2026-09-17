/** Parametric lemniscate (figure-eight / infinity curve) as an SVG path string. */
export function infinityPath(
  cx: number,
  cy: number,
  width: number,
  height: number,
  samples = 120
): string {
  const a = width / 2;
  const points: [number, number][] = [];
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * Math.PI * 2;
    const denom = 1 + Math.sin(t) * Math.sin(t);
    const x = (a * Math.cos(t)) / denom;
    const y = ((height / width) * a * Math.sin(t) * Math.cos(t)) / denom;
    points.push([cx + x, cy + y]);
  }
  return points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
}

/** Prepares a path element for a draw-on animation; returns its total length. */
export function prepareDraw(el: SVGPathElement): number {
  const length = el.getTotalLength();
  el.style.strokeDasharray = `${length}`;
  el.style.strokeDashoffset = `${length}`;
  return length;
}
