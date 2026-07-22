import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";

const SEED = [
  {
    slug: "icli-kofte",
    status: "published" as const,
    nameTr: "Icli Kofte",
    summaryTr:
      "El yapimi, dengeli baharat ve krispi dokuyla Bonvera'nin imza lezzeti.",
    bodyTr:
      "Bonvera icli kofte; geleneksel tarif ve modern uretim disiplinini bir araya getirir.",
    imageUrl: "/brand/product-icli-kofte.jpg",
    seoTitleTr: "Icli Kofte — Bonvera",
    seoDescriptionTr: "Premium icli kofte. Crafted in France.",
    sortOrder: 1,
    publishedAt: new Date(),
  },
  {
    slug: "yaprak-sarmasi",
    status: "published" as const,
    nameTr: "Yaprak Sarmasi",
    summaryTr:
      "Ince sarilmis, zeytinyagli ve ferah — geleneksel sunum icin ideal.",
    bodyTr:
      "Yaprak sarmasi, Bonvera'nin meze koleksiyonunun vazgecilmezlerinden.",
    imageUrl: "/brand/hero.jpg",
    seoTitleTr: "Yaprak Sarmasi — Bonvera",
    seoDescriptionTr: "Premium yaprak sarmasi. Crafted in France.",
    sortOrder: 2,
    publishedAt: new Date(),
  },
  {
    slug: "ezme",
    status: "draft" as const,
    nameTr: "Ezme",
    summaryTr: "Canli, baharatli ve taze — meze tabaklarinin vazgecilmezi.",
    bodyTr: "Ezme; taze biber, domates ve baharat dengesiyle hazirlanir.",
    imageUrl: "/brand/product-icli-kofte.jpg",
    seoTitleTr: "Ezme — Bonvera",
    seoDescriptionTr: "Premium ezme. Crafted in France.",
    sortOrder: 3,
    publishedAt: null,
  },
] as const;

/** Idempotent seed for Product Studio placeholders. */
export async function seedProducts() {
  for (const item of SEED) {
    const [existing] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, item.slug))
      .limit(1);
    if (existing) continue;
    await db.insert(products).values(item);
  }
}

seedProducts()
  .then(() => {
    console.log("Seeded products.");
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
