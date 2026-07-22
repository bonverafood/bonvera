import { unstable_noStore as noStore } from "next/cache";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { listProducts } from "@/lib/data";
import type { Product } from "@/lib/data/types";
import { getStudioUser } from "@/lib/supabase/auth";
import { cn } from "@/lib/utils";

function formatDate(value: Date | string | null) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export async function ProductListPage() {
  noStore();
  const t = await getTranslations("ProductStudio");

  let items: Product[] = [];
  let loadError: string | null = null;

  try {
    const user = await getStudioUser();
    if (!user) {
      loadError = "Oturum gerekli. Tekrar giris yapin.";
    } else {
      items = await listProducts();
    }
  } catch (error) {
    console.error("[product-studio] list", error);
    loadError =
      error instanceof Error ? error.message : "Urun listesi yuklenemedi.";
  }

  if (loadError) {
    return (
      <div className="space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("listTitle")}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t("listDescription")}
            </p>
          </div>
        </header>
        <p className="text-destructive text-sm" role="alert">
          {loadError}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("listTitle")}
          </h1>
          <p className="text-muted-foreground text-sm">{t("listDescription")}</p>
        </div>
        <Link
          href="/studio/urunler/yeni"
          className={cn(buttonVariants(), "h-9 px-4")}
        >
          {t("newProduct")}
        </Link>
      </header>

      {items.length === 0 ? (
        <div className="border-border rounded-xl border border-dashed px-6 py-16 text-center">
          <p className="text-foreground font-medium">{t("emptyTitle")}</p>
          <p className="text-muted-foreground mt-2 text-sm">
            {t("emptyDescription")}
          </p>
          <Link
            href="/studio/urunler/yeni"
            className={cn(buttonVariants(), "mt-6 inline-flex h-9 px-4")}
          >
            {t("newProduct")}
          </Link>
        </div>
      ) : (
        <div className="border-border overflow-hidden rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs tracking-wide uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">{t("columns.name")}</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">
                  {t("columns.slug")}
                </th>
                <th className="px-4 py-3 font-medium">{t("columns.status")}</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">
                  {t("columns.updated")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {items.map((product: Product) => (
                <tr
                  key={product.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/studio/urunler/${product.id}`}
                      className="text-foreground font-medium hover:underline"
                    >
                      {product.nameTr}
                    </Link>
                  </td>
                  <td className="text-muted-foreground hidden px-4 py-3 sm:table-cell">
                    {product.slug}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={product.status}
                      label={t(`status.${product.status}`)}
                    />
                  </td>
                  <td className="text-muted-foreground hidden px-4 py-3 md:table-cell">
                    {formatDate(product.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  status,
  label,
}: {
  status: Product["status"];
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
        status === "published" && "bg-primary/10 text-primary",
        status === "draft" && "bg-muted text-muted-foreground",
        status === "archived" && "bg-destructive/10 text-destructive",
      )}
    >
      {label}
    </span>
  );
}
