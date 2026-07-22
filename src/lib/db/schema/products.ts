import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "published",
  "archived",
]);

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  status: productStatusEnum("status").notNull().default("draft"),
  nameTr: text("name_tr").notNull(),
  summaryTr: text("summary_tr").notNull().default(""),
  bodyTr: text("body_tr").notNull().default(""),
  imageUrl: text("image_url"),
  seoTitleTr: text("seo_title_tr"),
  seoDescriptionTr: text("seo_description_tr"),
  ogImageUrl: text("og_image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
