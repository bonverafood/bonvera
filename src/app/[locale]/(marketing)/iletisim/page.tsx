import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MarketingPageIntro } from "@/features/marketing-site";
import { ContactForm } from "@/features/site-messages";
import { buildPageMetadata } from "@/lib/seo";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Marketing");
  return buildPageMetadata("iletisim", {
    title: t("contact.metaTitle"),
    description: t("contact.metaDescription"),
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Marketing");

  return (
    <>
      <MarketingPageIntro
        eyebrow={t("contact.eyebrow")}
        title={t("contact.title")}
        description={t("contact.description")}
      />
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8 lg:py-20">
        <div className="space-y-6 text-sm leading-relaxed">
          <div>
            <p className="text-muted-foreground text-xs tracking-[0.14em] uppercase">
              {t("contact.locationLabel")}
            </p>
            <p className="mt-2 text-base">{t("footer.location")}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs tracking-[0.14em] uppercase">
              {t("contact.emailLabel")}
            </p>
            <a
              href={`mailto:${t("footer.email")}`}
              className="text-primary mt-2 inline-block text-base hover:underline"
            >
              {t("footer.email")}
            </a>
          </div>
        </div>

        <ContactForm />
      </section>
    </>
  );
}
