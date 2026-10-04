export const snapTarget = (split: number) => split > 50 ? 100 : 0;

export function easedSplit(start: number, target: number, progress: number) {
  const t = Math.max(0, Math.min(1, progress));
  return start + (target - start) * (1 - (1 - t) ** 3);
}
