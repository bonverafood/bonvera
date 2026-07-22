import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MarketingPageIntro } from "@/features/marketing-site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
          <p className="text-muted-foreground">{t("contact.note")}</p>
        </div>

        <form className="border-border bg-card space-y-5 border p-6 sm:p-8">
          <div className="space-y-2">
            <Label htmlFor="name">{t("contact.form.name")}</Label>
            <Input id="name" name="name" autoComplete="name" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("contact.form.email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">{t("contact.form.message")}</Label>
            <Textarea id="message" name="message" rows={5} disabled />
          </div>
          <Button type="button" disabled>
            {t("contact.form.submit")}
          </Button>
          <p className="text-muted-foreground text-xs">
            {t("contact.form.shellNote")}
          </p>
        </form>
      </section>
    </>
  );
}
