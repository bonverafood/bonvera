"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
  sendAskMessage,
  submitAskContact,
  submitAskName,
} from "@/features/site-messages/actions";
import {
  askFollowUpAck,
  askPromptAskContact,
  askPromptAskName,
  systemAck,
} from "@/features/site-messages/schema";

const STORAGE_ID = "bonvera-ask-conversation-id";
const STORAGE_STEP = "bonvera-ask-step";
const STORAGE_PROMPTED = "bonvera-ask-prompted";
const STORAGE_OPENED = "bonvera-ask-opened";
const AUTO_MS = 30_000;

type Bubble = {
  id: string;
  role: "visitor" | "system";
  body: string;
};

type Step = "message" | "name" | "contact" | "done";

function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

function mergeBubbles(prev: Bubble[], incoming: Bubble[], dropId?: string) {
  const base = dropId ? prev.filter((b) => b.id !== dropId) : [...prev];
  const knownIds = new Set(base.map((b) => b.id));
  const knownBodies = new Set(
    base.map((b) => `${b.role}:${b.body.trim()}`),
  );
  for (const msg of incoming) {
    const key = `${msg.role}:${msg.body.trim()}`;
    if (knownIds.has(msg.id) || knownBodies.has(key)) continue;
    base.push(msg);
    knownIds.add(msg.id);
    knownBodies.add(key);
  }
  return base;
}

function ensureSystemBubble(prev: Bubble[], body: string): Bubble[] {
  const key = `system:${body.trim()}`;
  if (prev.some((b) => `${b.role}:${b.body.trim()}` === key)) return prev;
  return [
    ...prev,
    { id: `local-sys-${Date.now()}`, role: "system", body },
  ];
}

export function AskChatWidget() {
  const t = useTranslations("Marketing.chat");
  const locale = useLocale() as "fr" | "tr";
  const [open, setOpen] = useState(false);
  const [badge, setBadge] = useState(false);
  const [step, setStep] = useState<Step>("message");
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const listRef = useRef<HTMLDivElement>(null);
  const promptedRef = useRef(false);

  useEffect(() => {
    try {
      const id = sessionStorage.getItem(STORAGE_ID);
      const savedStep = sessionStorage.getItem(STORAGE_STEP) as Step | null;
      if (id) setConversationId(id);
      if (
        savedStep === "name" ||
        savedStep === "contact" ||
        savedStep === "done" ||
        savedStep === "message"
      ) {
        setStep(savedStep);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_STEP, step);
    } catch {
      /* ignore */
    }
  }, [step]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (promptedRef.current) return;
      try {
        if (sessionStorage.getItem(STORAGE_PROMPTED) === "1") return;
        sessionStorage.setItem(STORAGE_PROMPTED, "1");
      } catch {
        /* ignore */
      }
      promptedRef.current = true;

      if (isMobileViewport()) {
        try {
          if (sessionStorage.getItem(STORAGE_OPENED) !== "1") {
            setBadge(true);
          }
        } catch {
          setBadge(true);
        }
      } else {
        setOpen(true);
        setBadge(false);
        try {
          sessionStorage.setItem(STORAGE_OPENED, "1");
        } catch {
          /* ignore */
        }
      }
    }, AUTO_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [bubbles, open, step]);

  function openChat() {
    setOpen(true);
    setBadge(false);
    try {
      sessionStorage.setItem(STORAGE_OPENED, "1");
    } catch {
      /* ignore */
    }
  }

  function closeChat() {
    setOpen(false);
  }

  function rememberConversation(id: string) {
    setConversationId(id);
    try {
      sessionStorage.setItem(STORAGE_ID, id);
    } catch {
      /* ignore */
    }
  }

  function mapError(code: string) {
    if (code === "contactRequired") return t("errors.contactRequired");
    if (code === "invalidEmail") return t("errors.invalidEmail");
    return code;
  }

  function onSubmitMessage(event: React.FormEvent) {
    event.preventDefault();
    const text = body.trim();
    if (!text || pending) return;

    setError(null);
    const optimistic: Bubble = {
      id: `local-${Date.now()}`,
      role: "visitor",
      body: text,
    };
    setBubbles((prev) => [...prev, optimistic]);
    setBody("");

    // Only reuse thread after the lead flow is complete — otherwise stale
    // session ids skip the automatic name/contact prompts.
    const reuseId = step === "done" ? conversationId : null;

    startTransition(async () => {
      const result = await sendAskMessage({
        locale,
        body: text,
        conversationId: reuseId ?? undefined,
        website: "",
      });

      if (!result.ok) {
        setError(mapError(result.error));
        setBubbles((prev) => prev.filter((b) => b.id !== optimistic.id));
        setBody(text);
        return;
      }

      rememberConversation(result.data.conversationId);
      const incoming = result.data.messages.map((m) => ({
        id: m.id,
        role: m.role,
        body: m.body,
      }));

      setBubbles((prev) => {
        let next = mergeBubbles(prev, incoming, optimistic.id);
        if (result.data.nextStep === "name") {
          next = ensureSystemBubble(next, askPromptAskName(locale));
        } else if (result.data.nextStep === "done" && reuseId) {
          next = ensureSystemBubble(next, askFollowUpAck(locale));
        }
        return next;
      });
      setStep(result.data.nextStep);
    });
  }

  function onSubmitName(event: React.FormEvent) {
    event.preventDefault();
    if (!conversationId || pending) return;
    const value = name.trim();
    if (value.length < 2) {
      setError(t("errors.nameRequired"));
      return;
    }

    setError(null);
    const optimistic: Bubble = {
      id: `local-name-${Date.now()}`,
      role: "visitor",
      body: value,
    };
    setBubbles((prev) => [...prev, optimistic]);

    startTransition(async () => {
      const result = await submitAskName({
        locale,
        conversationId,
        name: value,
        website: "",
      });

      if (!result.ok) {
        setError(mapError(result.error));
        setBubbles((prev) => prev.filter((b) => b.id !== optimistic.id));
        return;
      }

      const incoming = result.data.messages.map((m) => ({
        id: m.id,
        role: m.role,
        body: m.body,
      }));
      setBubbles((prev) => {
        let next = mergeBubbles(prev, incoming, optimistic.id);
        next = ensureSystemBubble(next, askPromptAskContact(locale, value));
        return next;
      });
      setStep("contact");
    });
  }

  function onSubmitContact(event: React.FormEvent) {
    event.preventDefault();
    if (!conversationId || pending) return;

    setError(null);
    const summary =
      locale === "tr"
        ? [email.trim() && `E-posta: ${email.trim()}`, phone.trim() && `Telefon: ${phone.trim()}`]
            .filter(Boolean)
            .join("\n")
        : [
            email.trim() && `E-mail : ${email.trim()}`,
            phone.trim() && `Téléphone : ${phone.trim()}`,
          ]
            .filter(Boolean)
            .join("\n");

    const optimistic: Bubble = {
      id: `local-contact-${Date.now()}`,
      role: "visitor",
      body: summary,
    };
    setBubbles((prev) => [...prev, optimistic]);

    startTransition(async () => {
      const result = await submitAskContact({
        locale,
        conversationId,
        email,
        phone,
        website: "",
      });

      if (!result.ok) {
        setError(mapError(result.error));
        setBubbles((prev) => prev.filter((b) => b.id !== optimistic.id));
        return;
      }

      const incoming = result.data.messages.map((m) => ({
        id: m.id,
        role: m.role,
        body: m.body,
      }));
      setBubbles((prev) => {
        let next = mergeBubbles(prev, incoming, optimistic.id);
        next = ensureSystemBubble(next, systemAck(locale, "ask"));
        return next;
      });
      setStep("done");
      setEmail("");
      setPhone("");
    });
  }

  const composer =
    step === "name" ? (
      <form
        onSubmit={onSubmitName}
        className="border-border space-y-2 border-t p-3"
      >
        <label className="sr-only" htmlFor="ask-chat-name">
          {t("nameLabel")}
        </label>
        <Input
          id="ask-chat-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          autoComplete="name"
          disabled={pending}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={pending || name.trim().length < 2}
        >
          {pending ? t("sending") : t("nameSubmit")}
        </Button>
      </form>
    ) : step === "contact" ? (
      <form
        onSubmit={onSubmitContact}
        className="border-border space-y-2 border-t p-3"
      >
        <p className="text-muted-foreground text-xs leading-relaxed">
          {t("contactHint")}
        </p>
        <label className="sr-only" htmlFor="ask-chat-email">
          {t("emailLabel")}
        </label>
        <Input
          id="ask-chat-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          autoComplete="email"
          disabled={pending}
        />
        <label className="sr-only" htmlFor="ask-chat-phone">
          {t("phoneLabel")}
        </label>
        <Input
          id="ask-chat-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t("phonePlaceholder")}
          autoComplete="tel"
          inputMode="tel"
          disabled={pending}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={pending || (!email.trim() && !phone.trim())}
        >
          {pending ? t("sending") : t("contactSubmit")}
        </Button>
      </form>
    ) : (
      <form
        onSubmit={onSubmitMessage}
        className="border-border flex items-end gap-2 border-t p-3"
      >
        <label className="sr-only" htmlFor="ask-chat-input">
          {t("placeholder")}
        </label>
        <Textarea
          id="ask-chat-input"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={
            step === "done" ? t("followUpPlaceholder") : t("placeholder")
          }
          rows={2}
          className="min-h-0 resize-none"
          disabled={pending}
        />
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />
        <Button
          type="submit"
          size="icon"
          disabled={pending || !body.trim()}
          aria-label={t("send")}
        >
          <Send className="size-4" />
        </Button>
      </form>
    );

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-end p-4 sm:p-6">
      <div className="pointer-events-auto flex flex-col items-end gap-3">
        {open ? (
          <div
            className="border-border bg-card text-card-foreground flex h-[min(32rem,75vh)] w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-2xl border shadow-[0_18px_50px_-24px_rgba(15,23,42,0.45)]"
            role="dialog"
            aria-label={t("title")}
          >
            <div
              className="flex items-center justify-between gap-3 px-4 py-3 text-white"
              style={{ background: "var(--marketing-navy-deep)" }}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight">
                  {t("title")}
                </p>
                <p className="truncate text-xs text-white/70">{t("subtitle")}</p>
              </div>
              <button
                type="button"
                onClick={closeChat}
                className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label={t("close")}
              >
                <X className="size-4" />
              </button>
            </div>

            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm"
            >
              {bubbles.length === 0 ? (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t("greeting")}
                </p>
              ) : null}
              {bubbles.map((bubble) => (
                <div
                  key={bubble.id}
                  className={cn(
                    "max-w-[90%] whitespace-pre-wrap rounded-2xl px-3 py-2 leading-relaxed",
                    bubble.role === "visitor"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted text-foreground",
                  )}
                >
                  {bubble.body}
                </div>
              ))}
              {error ? (
                <p className="text-destructive text-xs">{error}</p>
              ) : null}
            </div>

            {composer}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => (open ? closeChat() : openChat())}
          className="relative flex size-14 items-center justify-center rounded-full text-white shadow-[0_12px_30px_-12px_rgba(15,23,42,0.55)] transition hover:scale-[1.03]"
          style={{ background: "var(--marketing-navy-deep)" }}
          aria-label={open ? t("close") : t("open")}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
          {badge && !open ? (
            <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-semibold text-white">
              1
            </span>
          ) : null}
        </button>
      </div>
    </div>
  );
}
