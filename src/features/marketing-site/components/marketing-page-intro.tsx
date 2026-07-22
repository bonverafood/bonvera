import type { ReactNode } from "react";

type MarketingPageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function MarketingPageIntro({
  eyebrow,
  title,
  description,
  children,
}: MarketingPageIntroProps) {
  return (
    <section className="border-border border-b">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-primary mb-3 text-xs font-semibold tracking-[0.18em] uppercase">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">
          {description}
        </p>
        {children}
      </div>
    </section>
  );
}
