CREATE TYPE "public"."product_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"status" "product_status" DEFAULT 'draft' NOT NULL,
	"name_tr" text NOT NULL,
	"summary_tr" text DEFAULT '' NOT NULL,
	"body_tr" text DEFAULT '' NOT NULL,
	"image_url" text,
	"seo_title_tr" text,
	"seo_description_tr" text,
	"og_image_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
