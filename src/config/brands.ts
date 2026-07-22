/**
 * Bonvera — the only brand this product serves.
 *
 * Bonvera Studio is single-brand by design. Do not introduce multi-brand
 * registries or tenant switchers. Another customer later = clone the repo.
 */

export const bonvera = {
  id: "bonvera",
  name: "Bonvera",
} as const;

export type BrandId = typeof bonvera.id;

/** @deprecated Prefer `bonvera` — kept for existing imports. */
export const primaryBrand = bonvera;

/** @deprecated Prefer `bonvera` — single-brand product. */
export const brands = [bonvera] as const;

export function getBrandById(id: string) {
  return id === bonvera.id ? bonvera : undefined;
}
