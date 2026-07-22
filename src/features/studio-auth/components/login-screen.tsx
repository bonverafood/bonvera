import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { LoginForm } from "./login-form";

type LoginScreenProps = {
  nextPath?: string;
};

export async function LoginScreen({ nextPath }: LoginScreenProps) {
  const t = await getTranslations("StudioAuth");

  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="border-border bg-card w-full max-w-md space-y-8 rounded-2xl border p-8 shadow-[var(--studio-shadow)]">
        <div className="space-y-3 text-center">
          <Image
            src="/brand/mark.png"
            alt=""
            width={168}
            height={168}
            className="mx-auto size-[10.5rem] object-contain object-top"
            priority
          />
          <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
            {t("brand")}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
        </div>
        <LoginForm nextPath={nextPath} />
      </div>
    </main>
  );
}
