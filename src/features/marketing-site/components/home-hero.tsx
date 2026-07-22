"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

export function HomeHero() {
  const t = useTranslations("Marketing");

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-[var(--marketing-hero)] text-white">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/brand/hero.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,16,24,0.55)_0%,rgba(12,16,24,0.35)_40%,rgba(12,16,24,0.72)_100%)]" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pt-28 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <motion.p
          className="font-display mb-3 text-4xl tracking-[0.18em] uppercase sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {t("brand")}
        </motion.p>

        <motion.h1
          className="font-display max-w-3xl text-3xl leading-tight font-medium text-balance sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28 }}
        >
          {t("home.hero.headline")}
        </motion.h1>

        <motion.p
          className="mt-4 max-w-xl text-base text-white/80 sm:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {t("home.hero.support")}
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.52 }}
        >
          <Link
            href="/urunler"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 rounded-md bg-white px-5 text-[var(--marketing-ink)] hover:bg-white/90",
            )}
          >
            {t("home.hero.ctaPrimary")}
          </Link>
          <Link
            href="/iletisim"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 rounded-md border-white/45 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white",
            )}
          >
            {t("home.hero.ctaSecondary")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
