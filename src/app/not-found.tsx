import { defaultLocale } from "@/config/i18n";

export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale}>
      <body>
        <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6">
          <h1 className="text-2xl font-semibold">404</h1>
        </main>
      </body>
    </html>
  );
}
