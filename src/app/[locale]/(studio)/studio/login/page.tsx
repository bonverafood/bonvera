import { setRequestLocale } from "next-intl/server";

import { LoginScreen } from "@/features/studio-auth";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
};

export default async function StudioLoginPage({
  params,
  searchParams,
}: LoginPageProps) {
  const { locale } = await params;
  const { next } = await searchParams;
  setRequestLocale(locale);

  const nextPath =
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/studio";

  return <LoginScreen nextPath={nextPath} />;
}
