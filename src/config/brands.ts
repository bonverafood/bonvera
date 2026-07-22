/**
 * Brand registry — internal preparation for multi-brand Studio OS.
 *
 * MVP serves Bonvera at `/` only. Do not introduce public multi-brand
 * routing until a dedicated product phase. Features should still key
 * off `brandId` when modeling data.
 */

export const brands = [
  {
    id: "bonvera",
    name: "Bonvera",
    /** Public marketing is rooted at `/` for the MVP brand. */
    isPrimary: true,
  },
] as const;

export type BrandId = (typeof brands)[number]["id"];

export const primaryBrand =
  brands.find((brand) => brand.isPrimary) ?? brands[0];

export function getBrandById(id: string) {
  return brands.find((brand) => brand.id === id);
}
