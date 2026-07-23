import { getTranslations } from "next-intl/server";
import Image from "next/image";

import { Link } from "@/lib/i18n/navigation";

import { MARKETING_NAV } from "../constants/nav";

export async function MarketingFooter() {
  const t = await getTranslations("Marketing");

  return (
    <footer className="border-border bg-[var(--marketing-ink)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/mark.png"
              alt=""
              width={56}
              height={56}
              className="size-14 object-contain brightness-0 invert"
            />
            <p className="font-display text-3xl tracking-[0.12em] uppercase">
              {t("brand")}
            </p>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/70">
            {t("footer.tagline")}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">
              {t("footer.explore")}
            </p>
            <ul className="space-y-2 text-sm">
              {MARKETING_NAV.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="text-white/80 transition-colors hover:text-white"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">
              {t("footer.contact")}
            </p>
            <ul className="space-y-2 text-sm text-white/80">
              <li>{t("footer.location")}</li>
              <li>
                <a
                  href={`mailto:${t("footer.email")}`}
                  className="hover:text-white"
                >
                  {t("footer.email")}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>{t("footer.rights", { year: 2023 })}</p>
          <p>{t("footer.craft")}</p>
        </div>
      </div>
    </footer>
  );
}
