"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { sendAskMessage } from "@/features/site-messages/actions";

const STORAGE_ID = "bonvera-ask-conversation-id";
const STORAGE_PROMPTED = "bonvera-ask-prompted";
const STORAGE_OPENED = "bonvera-ask-opened";
const AUTO_MS = 30_000;

type Bubble = {
  id: string;
  role: "visitor" | "system";
  body: string;
};

function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

export function AskChatWidget() {
  const t = useTranslations("Marketing.chat");
  const locale = useLocale() as "fr" | "tr";
  const [open, setOpen] = useState(false);
  const [badge, setBadge] = useState(false);
  const [body, setBody] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const listRef = useRef<HTMLDivElement>(null);
  const promptedRef = useRef(false);

  useEffect(() => {
    try {
      const id = sessionStorage.getItem(STORAGE_ID);
      if (id) setConversationId(id);
    } catch {
      /* ignore */
    }
  }, []);

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
  }, [bubbles, open]);

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

  function onSubmit(event: React.FormEvent) {
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

    startTransition(async () => {
      const result = await sendAskMessage({
        locale,
        body: text,
        conversationId: conversationId ?? undefined,
        website: "",
      });

      if (!result.ok) {
        setError(result.error);
        setBubbles((prev) => prev.filter((b) => b.id !== optimistic.id));
        setBody(text);
        return;
      }

      setConversationId(result.data.conversationId);
      try {
        sessionStorage.setItem(STORAGE_ID, result.data.conversationId);
      } catch {
        /* ignore */
      }

      setBubbles((prev) => {
        const withoutOptimistic = prev.filter((b) => b.id !== optimistic.id);
        const incoming = result.data.messages.map((m) => ({
          id: m.id,
          role: m.role,
          body: m.body,
        }));
        const known = new Set(withoutOptimistic.map((b) => b.id));
        const merged = [...withoutOptimistic];
        for (const msg of incoming) {
          if (!known.has(msg.id)) merged.push(msg);
        }
        return merged;
      });
    });
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-end p-4 sm:p-6">
      <div className="pointer-events-auto flex flex-col items-end gap-3">
        {open ? (
          <div
            className="border-border bg-card text-card-foreground flex h-[min(28rem,70vh)] w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-2xl border shadow-[0_18px_50px_-24px_rgba(15,23,42,0.45)]"
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
                    "max-w-[90%] rounded-2xl px-3 py-2 leading-relaxed",
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

            <form
              onSubmit={onSubmit}
              className="border-border flex items-end gap-2 border-t p-3"
            >
              <label className="sr-only" htmlFor="ask-chat-input">
                {t("placeholder")}
              </label>
              <Textarea
                id="ask-chat-input"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={t("placeholder")}
                rows={2}
                className="min-h-0 resize-none"
                disabled={pending}
              />
              {/* honeypot */}
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
