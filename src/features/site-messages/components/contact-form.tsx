"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { submitContactMessage } from "../actions";

export function ContactForm() {
  const t = useTranslations("Marketing.contact");
  const locale = useLocale() as "fr" | "tr";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setDone(false);

    startTransition(async () => {
      const result = await submitContactMessage({
        locale,
        name,
        email,
        message,
        website: "",
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDone(true);
      setName("");
      setEmail("");
      setMessage("");
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border-border bg-card space-y-5 border p-6 sm:p-8"
    >
      <div className="space-y-2">
        <Label htmlFor="name">{t("form.name")}</Label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={pending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t("form.email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={pending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{t("form.message")}</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          disabled={pending}
        />
      </div>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <Button type="submit" disabled={pending}>
        {pending ? t("form.submitting") : t("form.submit")}
      </Button>
      {done ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          {t("form.success")}
        </p>
      ) : null}
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </form>
  );
}
