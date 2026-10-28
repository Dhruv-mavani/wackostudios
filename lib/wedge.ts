/** The orange wedge in the logo is a circular sector. Measured from public/logo.png (1578 x 549 px). */
export const LOGO_W = 1578;
export const LOGO_H = 549;
export const WEDGE = { x: 1414.67, y: 264.91, r: 144.53, angle: -0.37, half: 28.42 };

/** Sector path with the tip at (x, y), opening towards `angle`, spanning +/- `half` degrees. 180 is a full disc. */
export function sectorPath(half: number) {
  const { x, y, r, angle } = WEDGE;
  const h = Math.min(half, 179.9);
  const pt = (deg: number) => `${(x + r * Math.cos((deg * Math.PI) / 180)).toFixed(2)} ${(y + r * Math.sin((deg * Math.PI) / 180)).toFixed(2)}`;
  return `M${x} ${y}L${pt(angle - h)}A${r} ${r} 0 ${h > 90 ? 1 : 0} 1 ${pt(angle + h)}Z`;
}
